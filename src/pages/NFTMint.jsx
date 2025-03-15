import React, { useEffect, useState } from 'react';
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from '@aptos-labs/wallet-adapter-react';

// Constants
const NETWORK_STR = Network.DEVNET; // For testing purposes
const CONTRACT_ADDRESS = "642f1e7b29e62e2c859b0bffe4e4ee06a89098bec8a54418a5481c89d9a898dc";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
const COLLECTION_NAME = "Fitness Journey NFT";
const MAX_MINT = 3;
const COLLECTION_SIZE = 100;

// Collection images
const COLLECTION_COVER_URL = "/assets/nft/nft-cover.jpg";
const COLLECTION_BACKGROUND_URL = "/assets/nft/nft-background.jpg";
const SAMPLE_IMAGE_1 = "/assets/nft/nft-sample-1.jpg";
const SAMPLE_IMAGE_2 = "/assets/nft/nft-sample-2.jpg";
const NFT_LOGO = "/assets/nft/nft-logo.svg";
const FITNESS_BADGE = "/assets/nft/fitness-badge.png";

// Ethereum logo SVG
const ethereumLogo = (
  <svg width="20" height="20" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
    <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
    <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
    <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"/>
    <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
    <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"/>
  </svg>
);

// Aptos logo SVG
const aptosLogo = (
  <svg width="20" height="20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M55.6 0H24.4C10.9 0 0 10.9 0 24.4v31.3C0 69.1 10.9 80 24.4 80h31.3C69.1 80 80 69.1 80 55.6V24.4C80 10.9 69.1 0 55.6 0z" fill="#fff"/>
    <path d="M40 16L28.8 36.8 40 32.8l11.2 4-11.2-20.8zM28.8 40l11.2 8 11.2-8-11.2 16-11.2-16z" fill="#8C8C8C"/>
    <path d="M40 64L28.8 44.8h22.4L40 64z" fill="#343434"/>
  </svg>
);

// Quantity toggle component
const QuantityToggle = ({ onChange }) => {
  const [count, setCount] = useState(1);
  
  const decreaseQuantity = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      onChange(newCount);
    }
  };
  
  const increaseQuantity = () => {
    if (count < MAX_MINT) {
      const newCount = count + 1;
      setCount(newCount);
      onChange(newCount);
    }
  };
  
  return (
    <div className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg">
      <button 
        onClick={decreaseQuantity} 
        className="bg-white p-1 rounded-md shadow-sm hover:bg-gray-200 disabled:opacity-50"
        disabled={count === 1}
      >
        <span className="text-xl font-bold">-</span>
      </button>
      <span className="text-lg font-semibold">{count}</span>
      <button 
        onClick={increaseQuantity} 
        className="bg-white p-1 rounded-md shadow-sm hover:bg-gray-200 disabled:opacity-50"
        disabled={count === MAX_MINT}
      >
        <span className="text-xl font-bold">+</span>
      </button>
    </div>
  );
};

// Connect wallet button component
const ConnectWalletButton = ({ connected, onClick, type = "aptos" }) => {
  return (
    <button 
      className={`px-4 py-2 ${type === "ethereum" ? "bg-purple-600 hover:bg-purple-700" : "bg-green-500 hover:bg-green-600"} text-white rounded-md transition shadow-md flex items-center`}
      onClick={onClick}
    >
      {type === "ethereum" ? 
        <span className="mr-2">{ethereumLogo}</span> : 
        <span className="mr-2">{aptosLogo}</span>
      }
      {connected ? `Disconnect ${type === "ethereum" ? "MetaMask" : "Wallet"}` : `Connect ${type === "ethereum" ? "MetaMask" : "Wallet"}`}
    </button>
  );
};

const NFTMint = () => {
  const wallet = useWallet();
  
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(COLLECTION_SIZE);
  const [canMint, setCanMint] = useState(true);
  const [expireTime, setExpireTime] = useState(0);
  const [mintFee, setMintFee] = useState(0);
  const [isWhitelistOnly, setIsWhitelistOnly] = useState(false);
  const [whiteList, setWhitelist] = useState([]);
  const [isWhitelist, setIsWhitelist] = useState(true);
  const [notificationActive, setNotificationActive] = useState(false);
  
  // Fitness profile form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '', // in cm
    weight: '', // in kg
    waistSize: '', // in cm
    bicepSize: '', // in cm
    photoMetadata: null,
    videoMetadata: null
  });
  
  const [formValid, setFormValid] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  
  // MetaMask state
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [ethAccount, setEthAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  
  // My Petra wallet state
  const [myPetraAddress, setMyPetraAddress] = useState('');
  const [savedPetraAddress, setSavedPetraAddress] = useState('');
  const [isMyPetraConnected, setIsMyPetraConnected] = useState(false);
  const [showPetraForm, setShowPetraForm] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask) {
      setHasMetaMask(true);
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(err => console.error("Error checking MetaMask accounts:", err));
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
    
    // Load saved Petra address from localStorage if exists
    const savedAddress = localStorage.getItem('myPetraAddress');
    if (savedAddress) {
      setSavedPetraAddress(savedAddress);
    }
  }, []);
  
  // Check if connected wallet is my saved Petra wallet
  useEffect(() => {
    if (wallet.connected && wallet.account?.address && savedPetraAddress) {
      // Check if the current connected address matches the saved address
      const isConnectedMyWallet = wallet.account.address.toString() === savedPetraAddress;
      setIsMyPetraConnected(isConnectedMyWallet);
      
      if (isConnectedMyWallet) {
        console.log("Your saved Petra wallet is connected!");
      }
    } else {
      setIsMyPetraConnected(false);
    }
    
    // Reset connecting state when wallet connection changes
    setIsConnecting(false);
  }, [wallet.connected, wallet.account, savedPetraAddress]);
  
  // Handle MetaMask account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setEthAccount(null);
      setEthBalance(null);
    } else {
      // User connected
      setEthAccount(accounts[0]);
      
      // Get balance
      if (window.ethereum) {
        window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        })
        .then(balance => {
          // Convert from wei to ETH
          const etherValue = parseInt(balance, 16) / 1e18;
          setEthBalance(etherValue.toFixed(4));
        })
        .catch(err => {
          console.error("Error getting balance:", err);
          setEthBalance("Error");
        });
      }
    }
  };
  
  // Connect to saved Petra wallet
  const connectSavedPetraWallet = async () => {
    if (!savedPetraAddress) {
      console.error("No saved Petra wallet address found");
      return;
    }
    
    // If already connected and it's the saved wallet, no need to reconnect
    if (wallet.connected && wallet.account?.address?.toString() === savedPetraAddress) {
      console.log("Your wallet is already connected!");
      return;
    }
    
    try {
      setIsConnecting(true);
      
      // Disconnect current wallet if connected
      if (wallet.connected) {
        await wallet.disconnect();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Short delay
      }
      
      // Connect wallet
      await wallet.connect();
      
      // Check if the connected wallet matches saved address
      setTimeout(() => {
        if (wallet.connected && wallet.account?.address?.toString() !== savedPetraAddress) {
          console.warn("Connected wallet doesn't match your saved wallet address. Please use your saved wallet in Petra extension.");
        }
      }, 1500);
    } catch (error) {
      console.error("Error connecting to saved wallet:", error);
      console.error("Failed to connect to your saved wallet. Please try manually connecting.");
      setIsConnecting(false);
    }
  };
  
  // Save my Petra wallet address
  const saveMyPetraAddress = () => {
    if (!myPetraAddress.trim()) {
      console.error("Please enter a valid Petra wallet address");
      return;
    }
    
    // Basic validation - check if it looks like an Aptos address
    if (!myPetraAddress.startsWith('0x') || myPetraAddress.length < 10) {
      console.error("Invalid Aptos wallet address format");
      return;
    }
    
    // Save to state and localStorage
    setSavedPetraAddress(myPetraAddress);
    localStorage.setItem('myPetraAddress', myPetraAddress);
    
    // Check if it matches current connected wallet
    if (wallet.connected && wallet.account?.address) {
      const isConnectedMyWallet = wallet.account.address.toString() === myPetraAddress;
      setIsMyPetraConnected(isConnectedMyWallet);
      
      if (isConnectedMyWallet) {
        console.log("Your wallet is already connected!");
      } else {
        console.log("Your wallet is saved but not currently connected");
      }
    }
    
    setShowPetraForm(false);
    setMyPetraAddress(''); // Reset input
  };
  
  // Handle Petra address input change
  const handlePetraAddressChange = (e) => {
    setMyPetraAddress(e.target.value);
  };
  
  // Remove saved Petra address
  const removeSavedPetraAddress = () => {
    setSavedPetraAddress('');
    localStorage.removeItem('myPetraAddress');
    setIsMyPetraConnected(false);
    console.log("Your saved wallet has been removed");
  };
  
  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (!hasMetaMask) {
      console.error("MetaMask not detected. Please install MetaMask to use this feature.");
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      handleAccountsChanged(accounts);
      console.log("MetaMask connected successfully!");
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      console.error(`Failed to connect to MetaMask: ${error.message || "Unknown error"}`);
    }
  };
  
  // Disconnect from MetaMask
  const disconnectMetaMask = () => {
    setEthAccount(null);
    setEthBalance(null);
    console.log("MetaMask disconnected");
  };

  // Connect wallet - modified to track connection state
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      await wallet.connect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      console.error("Failed to connect wallet. Please try again.");
      setIsConnecting(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await wallet.disconnect();
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      console.error("Failed to disconnect wallet");
    }
  };

  // Check if user can mint
  useEffect(() => {
    setNotificationActive(false);
    setMinting(false);
    setIsWhitelist(false);
    getCandyMachineResourceData();
    
    if (wallet.connected) {
      if (isWhitelistOnly) {
        if (!whiteList.includes(wallet.account?.address?.toString())) {
          setIsWhitelist(false);
          console.error("Unable to mint as your address is not in the whitelist.");
        } else {
          setIsWhitelist(true);
        }
      }
    }
  }, [wallet.connected, isWhitelistOnly, whiteList]);
  
  // Validate form data
  useEffect(() => {
    const { name, age, height, weight, waistSize, bicepSize, photoMetadata } = formData;
    
    // Basic validation
    const isFormComplete = 
      name.trim() !== '' && 
      age !== '' && !isNaN(Number(age)) && 
      height !== '' && !isNaN(Number(height)) && 
      weight !== '' && !isNaN(Number(weight)) && 
      waistSize !== '' && !isNaN(Number(waistSize)) && 
      bicepSize !== '' && !isNaN(Number(bicepSize)) && 
      photoMetadata !== null;
    
    setFormValid(isFormComplete);
  }, [formData]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
      // Check file size - limit to 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (files[0].size > maxSize) {
        console.error(`File is too large. Maximum size is 5MB. Your file is ${(files[0].size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Create URL preview
      if (name === 'photoMetadata') {
        setPhotoPreview(URL.createObjectURL(files[0]));
      } else if (name === 'videoMetadata') {
        setVideoPreview(URL.createObjectURL(files[0]));
      }
    }
  };
  
  // Helper function to convert file to base64 with compression if needed
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // For images, we can compress them if needed
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          
          img.onload = () => {
            // Create a canvas to compress the image
            const canvas = document.createElement('canvas');
            
            // Calculate size to maintain aspect ratio but reduce dimensions
            let width = img.width;
            let height = img.height;
            
            // If image is large, scale it down
            const maxDimension = 1200; // Set max dimension
            if (width > height && width > maxDimension) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else if (height > maxDimension) {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw image on canvas with new dimensions
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get compressed data URL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // 0.8 quality - adjust as needed
            
            // Return the base64 data (without the data URL prefix)
            resolve(dataUrl.split(',')[1]);
          };
        };
        
        reader.onerror = error => reject(error);
      } else {
        // For other file types, just convert to base64 without compression
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
      }
    });
  };

  // Helper function for async operations
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  // Format time for display
  function convertMsToTime(timestamp) {
    if (!timestamp) return "Not set";
    
    // Create a Date object from the Unix timestamp
    const date = new Date(timestamp * 1000);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Determine AM/PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');
  
    // Construct the final formatted date and time string
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  
    return `${formattedDate} ${formattedTime}`;
  }

  // Get data from the smart contract
  async function getCandyMachineResourceData() {
    try {
      setCurrentSupply(0); // Default value
      setMaxSupply(COLLECTION_SIZE); // Use our constant
      setMintFee(1000000); // Default 0.01 APT (in octas)
      
      // Try to fetch data, but don't block rendering if it fails
      const response = await fetch(`${NODE_URL}/accounts/${CONTRACT_ADDRESS}/resources`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).catch(err => {
        console.warn("Error fetching contract data:", err);
        return null;
      });
      
      if (!response || !response.ok) {
        console.warn("Could not fetch contract data. Using default values");
        return;
      }
      
      const resources = await response.json();
      console.log("Contract resources:", resources);
      
      // Look for the module data
      const moduleDataResource = resources.find(resource => 
        resource.type && resource.type.includes("::minting::ModuleData")
      );
      
      if (moduleDataResource && moduleDataResource.data) {
        const data = moduleDataResource.data;
        
        if (data.expiration_timestamp) setExpireTime(data.expiration_timestamp);
        if (data.current_supply) setCurrentSupply(data.current_supply);
        if (data.maximum_supply) setMaxSupply(data.maximum_supply);
        
        if (Array.isArray(data.whitelist_addr)) {
          setWhitelist(data.whitelist_addr);
          if (data.whitelist_only) {
            setIsWhitelistOnly(true);
          }
        }
        
        // Handle pricing data
        if (data.presale_status && data.publicsale_status) {
          setMintFee(data.public_price || 1000000);
        } else if (data.presale_status) {
          setMintFee(data.per_sale_price || 1000000);
        } else {
          setMintFee(data.public_price || 1000000);
        }
      }
    } catch (error) {
      console.error("Error processing contract data:", error);
      // Don't show error toast as it's distracting - just use default values
    }
  }
  
  // Submit form and proceed with minting
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formValid) {
      console.error("Please complete all required fields");
      return;
    }
    
    setIsFormVisible(false);
    
    // Proceed with mint if form is valid
    await mint();
  };

  // Mint NFT function
  const mint = async () => {
    if (!wallet.account?.address) {
      setNotificationActive(true);
      await timeout(3000);
      setNotificationActive(false);
      return;
    }
    
    try {
      setMinting(true);
      
      // Prepare file data - limit size for metadata 
      let photoMetadataBase64 = "";
      let videoMetadataBase64 = "";
      
      if (formData.photoMetadata) {
        try {
          photoMetadataBase64 = await fileToBase64(formData.photoMetadata);
          // Truncate if it's too large
          if (photoMetadataBase64.length > 100000) { // ~100KB limit
            photoMetadataBase64 = photoMetadataBase64.substring(0, 100000);
          }
        } catch (err) {
          console.error("Error processing image:", err);
          console.error("Error processing image. Please try a smaller file.");
          setMinting(false);
          return;
        }
      }
      
      if (formData.videoMetadata) {
        try {
          videoMetadataBase64 = await fileToBase64(formData.videoMetadata);
          // Truncate if it's too large
          if (videoMetadataBase64.length > 50000) { // ~50KB limit
            videoMetadataBase64 = ""; // Just omit video if too large
            console.warn("Video was too large and was omitted");
          }
        } catch (err) {
          console.error("Error processing video:", err);
          videoMetadataBase64 = "";
        }
      }
      
      // Create metadata as a simplified string to avoid data size issues
      const metadataUrl = "https://example.com/metadata/"; // Placeholder URL
      
      try {
        const txHash = await wallet.signAndSubmitTransaction({
          sender: wallet.account.address,
          data: {
            function: `${CONTRACT_ADDRESS}::minting::mint_nft`,
            typeArguments: [],
            functionArguments: [
              quantity, // Quantity to mint
              formData.name, // Name
              parseInt(formData.age), // Age
              parseFloat(formData.height), // Height
              parseFloat(formData.weight), // Weight
              parseFloat(formData.waistSize), // Waist Size
              parseFloat(formData.bicepSize), // Bicep Size
              metadataUrl + Date.now(), // Use a timestamp as a placeholder for real metadata
              "" // Empty string for video metadata to simplify
            ],
          },
        });
        
        setMinting(false);
        getCandyMachineResourceData();
        
        console.log(`Minting Success! Transaction hash: ${txHash.hash}`);
        
        // Reset form
        setFormData({
          name: '',
          age: '',
          height: '',
          weight: '',
          waistSize: '',
          bicepSize: '',
          photoMetadata: null,
          videoMetadata: null
        });
        setPhotoPreview(null);
        setVideoPreview(null);
        setIsFormVisible(true);
        
      } catch (err) {
        console.error("Transaction error:", err);
        console.error(`Minting failed: ${err.message}`);
        setMinting(false);
        setIsFormVisible(true);
      }
    } catch (error) {
      console.error("Mint error:", error);
      console.error("Error during minting process");
      setMinting(false);
      setIsFormVisible(true);
    }
  };
  
  // Render UI components
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col lg:flex-row mb-6 gap-6 items-start">
        <div className="w-full lg:w-1/3">
          <h1 className="text-3xl font-bold mb-4">Fitness Journey NFTs</h1>
          <p className="text-gray-600 mb-6">
            Mint a unique NFT to commemorate your fitness achievements and journey.
            Each NFT contains your fitness metrics captured at this moment in time.
          </p>
          
          {/* Collection Image */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
            <img 
              src={COLLECTION_COVER_URL} 
              alt="Fitness Journey NFT Collection" 
              className="w-full h-48 object-cover"
              onError={e => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x200?text=Fitness+Journey+NFT";
              }}
            />
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-500">
              <h2 className="text-white text-xl font-bold">{COLLECTION_NAME}</h2>
              <p className="text-white/80 text-sm">Minted: {currentSupply} / {maxSupply}</p>
              <p className="text-white/80 text-sm">Price: {mintFee / 100000000} APT</p>
              {expireTime > 0 && (
                <p className="text-white/80 text-sm">Expires: {convertMsToTime(expireTime)}</p>
              )}
            </div>
          </div>
          
          {/* Wallet Connections */}
          <div className="bg-white shadow-lg rounded-xl p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Connect Wallets</h2>
            
            {/* Saved Petra Wallet Section */}
            {savedPetraAddress && (
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">My Petra Wallet</h3>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs md:text-sm text-gray-600 break-all">
                    {savedPetraAddress.substring(0, 6)}...{savedPetraAddress.substring(savedPetraAddress.length - 4)}
                  </p>
                  <div className="flex items-center gap-2">
                    {isMyPetraConnected ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Connected
                      </span>
                    ) : (
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center"
                        onClick={connectSavedPetraWallet}
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 bg-blue-300 rounded-full mr-1"></span>
                            Connect
                          </>
                        )}
                      </button>
                    )}
                    <button 
                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-white rounded-full border border-red-200" 
                      onClick={removeSavedPetraAddress}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Petra Wallet Input Form */}
            {showPetraForm && (
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Add Your Petra Wallet</h3>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="Enter your Petra wallet address (0x...)"
                    value={myPetraAddress}
                    onChange={handlePetraAddressChange}
                  />
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                      onClick={saveMyPetraAddress}
                    >
                      Save Wallet
                    </button>
                    <button 
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm"
                      onClick={() => {
                        setShowPetraForm(false);
                        setMyPetraAddress('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Add My Wallet Button */}
            {!showPetraForm && !savedPetraAddress && (
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center mb-4 text-sm w-full"
                onClick={() => setShowPetraForm(true)}
              >
                <span className="mr-2">{aptosLogo}</span>
                Add My Petra Wallet
              </button>
            )}
            
            {/* Wallet Connections */}
            <div className="flex flex-col gap-3">
              <button 
                className={`px-4 py-2 ${wallet.connected ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white rounded-md transition shadow-md flex items-center justify-center`}
                onClick={wallet.connected ? disconnectWallet : connectWallet}
                disabled={isConnecting}
              >
                <span className="mr-2">{aptosLogo}</span>
                {isConnecting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </div>
                ) : (
                  wallet.connected ? "Disconnect Wallet" : "Connect Petra Wallet"
                )}
              </button>
              
              <ConnectWalletButton 
                connected={ethAccount !== null}
                onClick={ethAccount !== null ? disconnectMetaMask : connectMetaMask}
                type="ethereum"
              />
            </div>
            
            {/* Connected Wallets Display */}
            <div className="mt-4">
              {wallet.connected && (
                <div className="mb-3 p-2 bg-green-50 border border-green-100 rounded-md">
                  <h3 className="text-sm font-semibold text-gray-700">Connected Aptos Wallet:</h3>
                  <p className="text-xs text-gray-600 break-all">{wallet.account?.address.toString()}</p>
                  {isMyPetraConnected && (
                    <p className="text-xs text-green-600 mt-1">✓ This is your saved wallet</p>
                  )}
                </div>
              )}
              
              {ethAccount && (
                <div className="mb-3 p-2 bg-purple-50 border border-purple-100 rounded-md">
                  <h3 className="text-sm font-semibold text-gray-700">Connected Ethereum Wallet:</h3>
                  <p className="text-xs text-gray-600 break-all">{ethAccount}</p>
                  {ethBalance && <p className="text-xs text-gray-600">Balance: {ethBalance} ETH</p>}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-xl p-6">
          {isFormVisible ? (
            // Fitness Profile Form
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-6">Create Your Fitness Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="age">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="height">Height (cm)</label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your height in cm"
                    value={formData.height}
                    onChange={handleInputChange}
                    step="0.1"
                    min="50"
                    max="250"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="weight">Weight (kg)</label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your weight in kg"
                    value={formData.weight}
                    onChange={handleInputChange}
                    step="0.1"
                    min="20"
                    max="300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="waistSize">Waist Size (cm)</label>
                  <input
                    id="waistSize"
                    name="waistSize"
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your waist size in cm"
                    value={formData.waistSize}
                    onChange={handleInputChange}
                    step="0.1"
                    min="40"
                    max="200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="bicepSize">Bicep Size (cm)</label>
                  <input
                    id="bicepSize"
                    name="bicepSize"
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your bicep size in cm"
                    value={formData.bicepSize}
                    onChange={handleInputChange}
                    step="0.1"
                    min="15"
                    max="70"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Upload Your Fitness Photos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Fitness Photo (Required)
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      {photoPreview ? (
                        <div className="mb-2">
                          <img 
                            src={photoPreview} 
                            alt="Preview" 
                            className="max-h-40 mx-auto rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="py-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <input 
                        type="file" 
                        name="photoMetadata" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Fitness Video (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      {videoPreview ? (
                        <div className="mb-2">
                          <video 
                            src={videoPreview} 
                            controls 
                            className="max-h-40 mx-auto rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="py-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <input 
                        type="file" 
                        name="videoMetadata" 
                        accept="video/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  type="submit" 
                  className={`bg-blue-600 text-white px-8 py-3 rounded-md shadow-md hover:bg-blue-700 transition ${!formValid && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!formValid || !wallet.connected}
                >
                  Continue to Mint
                </button>
                
                {!wallet.connected && (
                  <p className="text-red-500 mt-2">You need to connect your wallet to mint NFTs.</p>
                )}
              </div>
            </form>
          ) : (
            // Minting Section
            <div>
              <h2 className="text-2xl font-bold mb-6">Mint Your Fitness NFT</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2">Fitness Profile Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {formData.name}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Age:</span> {formData.age} years</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Height:</span> {formData.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700"><span className="font-medium">Weight:</span> {formData.weight} kg</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Waist Size:</span> {formData.waistSize} cm</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Bicep Size:</span> {formData.bicepSize} cm</p>
                  </div>
                </div>
                
                {photoPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Fitness Photo:</p>
                    <img 
                      src={photoPreview} 
                      alt="Fitness" 
                      className="h-24 rounded-md border border-gray-300"
                    />
                  </div>
                )}
                
                <button 
                  className="mt-4 text-blue-600 hover:text-blue-800"
                  onClick={() => setIsFormVisible(true)}
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Select Quantity</h3>
                  <QuantityToggle onChange={handleQuantityChange} />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Price per NFT:</span>
                    <span className="font-medium">{mintFee / 100000000} APT</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Quantity:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Price:</span>
                    <span>{(quantity * mintFee) / 100000000} APT</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <button 
                    className={`bg-blue-600 text-white px-8 py-3 rounded-md shadow-md hover:bg-blue-700 transition ${(minting || !wallet.connected) && 'opacity-50 cursor-not-allowed'}`}
                    onClick={mint}
                    disabled={minting || !wallet.connected}
                  >
                    {minting ? 'Minting...' : 'Mint NFT'}
                  </button>
                  
                  {!wallet.connected && (
                    <p className="text-red-500 mt-2">You need to connect your wallet to mint NFTs.</p>
                  )}
                  
                  {notificationActive && !wallet.connected && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mt-4">
                      <p>Please connect your wallet to continue.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">About Fitness Journey NFTs</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <p className="text-gray-600 mb-4">
              These NFTs allow you to memorialize your fitness journey on the blockchain. 
              Each NFT contains metadata with your fitness metrics at the time of minting.
            </p>
            <p className="text-gray-600 mb-4">
              As you progress in your fitness journey, mint new NFTs to track your improvement 
              over time. You can mint up to 3 NFTs per transaction.
            </p>
            <p className="text-gray-600">
              The NFTs are minted on the Aptos blockchain, ensuring your fitness achievements 
              are secured and verifiable.
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <img 
              src={COLLECTION_BACKGROUND_URL}
              alt="Fitness NFT"
              className="w-full h-48 object-cover rounded-xl shadow-md"
              onError={e => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x200?text=Fitness+Journey";
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Sample Fitness NFT Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-xl shadow-md">
            <img 
              src={SAMPLE_IMAGE_1} 
              alt="Sample Fitness NFT 1" 
              className="w-full h-64 object-cover"
              onError={e => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x300?text=Fitness+NFT";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Starting Point</h3>
                  <p className="text-white/80 text-sm">Weight: 85kg | Height: 180cm</p>
                </div>
                <img 
                  src={FITNESS_BADGE} 
                  alt="Achievement Badge" 
                  className="h-12 w-12"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/50x50?text=Badge";
                  }}
                />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-md">
            <img 
              src={SAMPLE_IMAGE_2} 
              alt="Sample Fitness NFT 2" 
              className="w-full h-64 object-cover"
              onError={e => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x300?text=Fitness+NFT";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">6 Month Progress</h3>
                  <p className="text-white/80 text-sm">Weight: 75kg | Height: 180cm</p>
                </div>
                <img 
                  src={FITNESS_BADGE} 
                  alt="Achievement Badge" 
                  className="h-12 w-12"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/50x50?text=Badge";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTMint; 