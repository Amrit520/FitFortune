import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Get user's display name from metadata or email
  const displayName = user?.user_metadata?.fullName || user?.email?.split('@')[0] || 'User';
  
  // Get first letter of name for avatar placeholder
  const avatarLetter = displayName.charAt(0).toUpperCase();
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* User avatar */}
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          {avatarLetter}
        </div>
        
        {/* Username */}
        <span className="hidden md:block text-gray-700 font-medium">
          {displayName}
        </span>
        
        {/* Dropdown arrow */}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <a 
            href="#" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setIsOpen(false);
              navigate('/dashboard');
            }}
          >
            Dashboard
          </a>
          
          <a 
            href="#" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setIsOpen(false);
              navigate('/profile');
            }}
          >
            Profile Settings
          </a>
          
          <a 
            href="#" 
            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
          >
            Sign Out
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 