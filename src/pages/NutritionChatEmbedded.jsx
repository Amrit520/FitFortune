import { useState, useEffect, useRef } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { processNutritionText, generateNutritionAdvice } from '../services/geminiApi';

const NutritionChatEmbedded = () => {
  const { addMeal } = useNutrition();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! I'm your nutrition assistant. I can help you with meal tracking, nutritional advice, and more. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle input submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Process user input and generate response
    try {
      const userText = userMessage.text.toLowerCase();
      
      // Determine if it's a food logging request
      if (userText.includes('ate') || 
          userText.includes('had') || 
          userText.includes('log') ||
          userText.includes('track') ||
          userText.includes('record')) {
        
        // Process the text to extract nutrition information
        const nutritionData = await processNutritionText(userMessage.text);
        
        // Log the meal
        if (nutritionData) {
          await addMeal({
            name: nutritionData.foodItem,
            calories: nutritionData.calories,
            protein: nutritionData.protein,
            carbs: nutritionData.carbs,
            fats: nutritionData.fats
          });
          
          // Add meal logged confirmation
          setTimeout(() => {
            const botResponse = {
              id: Date.now(),
              sender: 'bot',
              text: `I've logged ${nutritionData.foodItem} with ${nutritionData.calories} calories, ${nutritionData.protein}g protein, ${nutritionData.carbs}g carbs, and ${nutritionData.fats}g fat.`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
          }, 1000);
        }
      } else {
        // Handle general nutrition questions using the AI advice generator
        setTimeout(async () => {
          const adviceResponse = await generateNutritionAdvice(userMessage.text);
          
          const botResponse = {
            id: Date.now(),
            sender: 'bot',
            text: adviceResponse,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Error response
      setTimeout(() => {
        const botResponse = {
          id: Date.now(),
          sender: 'bot',
          text: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 500);
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-3 ${message.sender === 'user' ? 'text-right' : ''}`}
          >
            <div 
              className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="mb-3">
            <div className="inline-block rounded-lg px-4 py-2 bg-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
          />
          <button
            type="submit"
            className="bg-green-500 text-white rounded-r-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NutritionChatEmbedded; 