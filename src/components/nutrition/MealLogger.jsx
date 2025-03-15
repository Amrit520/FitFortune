import { useState, useEffect, useRef } from 'react';
import { useNutrition } from '../../context/NutritionContext';
import { initSpeechRecognition, processNutritionText } from '../../services/geminiApi';

// Common foods database for quick-add functionality
const COMMON_FOODS = [
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, mealType: 'snack' },
  { name: 'Boiled Egg', calories: 78, protein: 6.3, carbs: 0.6, fats: 5.3, mealType: 'breakfast' },
  { name: 'Greek Yogurt', calories: 130, protein: 12, carbs: 9, fats: 4, mealType: 'breakfast' },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, mealType: 'lunch' },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13, mealType: 'dinner' },
  { name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fats: 4, mealType: 'lunch' },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fats: 15, mealType: 'snack' },
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, mealType: 'snack' },
  { name: 'Spinach', calories: 7, protein: 0.9, carbs: 1.1, fats: 0.1, mealType: 'lunch' },
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fats: 0.6, mealType: 'dinner' },
  { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fats: 1.8, mealType: 'lunch' },
  { name: 'Milk', calories: 103, protein: 8, carbs: 12, fats: 2.4, mealType: 'breakfast' },
];

// More comprehensive food database for search
const FOOD_DATABASE = [
  ...COMMON_FOODS,
  // Vegetables from the list
  { name: 'Artichoke', calories: 60, protein: 4.2, carbs: 13.4, fats: 0.2, mealType: 'lunch' },
  { name: 'Arugula', calories: 25, protein: 2.6, carbs: 3.7, fats: 0.7, mealType: 'lunch' },
  { name: 'Asparagus', calories: 27, protein: 2.9, carbs: 5.2, fats: 0.2, mealType: 'dinner' },
  { name: 'Bamboo Shoots', calories: 27, protein: 2.6, carbs: 5.2, fats: 0.3, mealType: 'lunch' },
  { name: 'Beetroot', calories: 43, protein: 1.6, carbs: 9.6, fats: 0.2, mealType: 'lunch' },
  { name: 'Bell Pepper', calories: 31, protein: 1, carbs: 6, fats: 0.3, mealType: 'lunch' },
  { name: 'Bitter Melon', calories: 17, protein: 1, carbs: 3.7, fats: 0.2, mealType: 'dinner' },
  { name: 'Bok Choy', calories: 13, protein: 1.5, carbs: 2.2, fats: 0.2, mealType: 'dinner' },
  { name: 'Brussels Sprouts', calories: 43, protein: 3.4, carbs: 9, fats: 0.3, mealType: 'dinner' },
  { name: 'Cabbage', calories: 25, protein: 1.3, carbs: 5.8, fats: 0.1, mealType: 'lunch' },
  { name: 'Carrot', calories: 41, protein: 0.9, carbs: 9.6, fats: 0.2, mealType: 'snack' },
  { name: 'Cauliflower', calories: 25, protein: 2, carbs: 5, fats: 0.1, mealType: 'dinner' },
  { name: 'Celery', calories: 16, protein: 0.7, carbs: 3, fats: 0.2, mealType: 'snack' },
  { name: 'Chayote', calories: 19, protein: 0.8, carbs: 4.3, fats: 0.1, mealType: 'lunch' },
  { name: 'Chicory', calories: 23, protein: 1.7, carbs: 4.7, fats: 0.3, mealType: 'lunch' },
  { name: 'Collard Greens', calories: 33, protein: 2.5, carbs: 5.7, fats: 0.5, mealType: 'dinner' },
  { name: 'Corn', calories: 86, protein: 3.2, carbs: 19, fats: 1.2, mealType: 'dinner' },
  { name: 'Cucumber', calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, mealType: 'lunch' },
  { name: 'Daikon Radish', calories: 18, protein: 0.6, carbs: 4.1, fats: 0.1, mealType: 'lunch' },
  { name: 'Eggplant', calories: 25, protein: 1, carbs: 6, fats: 0.2, mealType: 'dinner' },
  
  // Fruits from the list
  { name: 'Apricot', calories: 48, protein: 1.4, carbs: 11, fats: 0.4, mealType: 'snack' },
  { name: 'Blackberry', calories: 43, protein: 1.4, carbs: 10, fats: 0.5, mealType: 'snack' },
  { name: 'Blueberry', calories: 57, protein: 0.7, carbs: 14, fats: 0.3, mealType: 'snack' },
  { name: 'Cantaloupe', calories: 34, protein: 0.8, carbs: 8, fats: 0.2, mealType: 'breakfast' },
  { name: 'Cherry', calories: 50, protein: 1, carbs: 12, fats: 0.3, mealType: 'snack' },
  { name: 'Clementine', calories: 47, protein: 0.9, carbs: 12, fats: 0.1, mealType: 'snack' },
  { name: 'Coconut', calories: 354, protein: 3.3, carbs: 15, fats: 33, mealType: 'snack' },
  { name: 'Cranberry', calories: 46, protein: 0.4, carbs: 12, fats: 0.1, mealType: 'snack' },
  { name: 'Date', calories: 282, protein: 2.5, carbs: 75, fats: 0.4, mealType: 'snack' },
  { name: 'Dragonfruit', calories: 60, protein: 1.2, carbs: 13, fats: 0, mealType: 'breakfast' },
  { name: 'Fig', calories: 74, protein: 0.8, carbs: 19, fats: 0.3, mealType: 'snack' },
  { name: 'Grape', calories: 69, protein: 0.7, carbs: 18, fats: 0.2, mealType: 'snack' },
  { name: 'Grapefruit', calories: 42, protein: 0.8, carbs: 11, fats: 0.1, mealType: 'breakfast' },
  { name: 'Kiwi', calories: 61, protein: 1.1, carbs: 15, fats: 0.5, mealType: 'snack' },
  { name: 'Lemon', calories: 29, protein: 1.1, carbs: 9, fats: 0.3, mealType: 'snack' },
  { name: 'Lime', calories: 30, protein: 0.7, carbs: 10, fats: 0.2, mealType: 'snack' },
  { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fats: 0.4, mealType: 'snack' },
  { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fats: 0.1, mealType: 'breakfast' },
  { name: 'Papaya', calories: 43, protein: 0.5, carbs: 11, fats: 0.4, mealType: 'breakfast' },
  { name: 'Peach', calories: 39, protein: 0.9, carbs: 10, fats: 0.3, mealType: 'snack' },
  
  // Dairy products from the list
  { name: 'Butter', calories: 717, protein: 0.9, carbs: 0.1, fats: 81, mealType: 'breakfast' },
  { name: 'Cheese', calories: 402, protein: 25, carbs: 1.3, fats: 33, mealType: 'snack' },
  { name: 'Yogurt', calories: 59, protein: 3.5, carbs: 5, fats: 3.3, mealType: 'breakfast' },
  { name: 'Cream', calories: 340, protein: 2.1, carbs: 2.8, fats: 36, mealType: 'breakfast' },
  { name: 'Sour Cream', calories: 198, protein: 2.4, carbs: 4.6, fats: 19, mealType: 'dinner' },
  { name: 'Whipped Cream', calories: 257, protein: 2.2, carbs: 3.3, fats: 27, mealType: 'snack' },
  { name: 'Condensed Milk', calories: 321, protein: 7.9, carbs: 54, fats: 8.7, mealType: 'breakfast' },
  { name: 'Buttermilk', calories: 40, protein: 3.3, carbs: 4.8, fats: 0.9, mealType: 'breakfast' },
  { name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fats: 4.3, mealType: 'breakfast' },
  { name: 'Cream Cheese', calories: 342, protein: 6.1, carbs: 3.7, fats: 34, mealType: 'breakfast' },
  { name: 'Kefir', calories: 60, protein: 3.3, carbs: 4.8, fats: 3.3, mealType: 'breakfast' },
  { name: 'Ricotta', calories: 174, protein: 11, carbs: 3.8, fats: 13, mealType: 'lunch' },
  { name: 'Mozzarella', calories: 280, protein: 22, carbs: 2.2, fats: 22, mealType: 'lunch' },
  { name: 'Cheddar', calories: 403, protein: 25, carbs: 1.3, fats: 33, mealType: 'lunch' },
  { name: 'Parmesan', calories: 431, protein: 38, carbs: 3.2, fats: 29, mealType: 'dinner' },
  
  // Grains from the list
  { name: 'Rice', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, mealType: 'lunch' },
  { name: 'Wheat', calories: 327, protein: 13, carbs: 71, fats: 2.5, mealType: 'breakfast' },
  { name: 'Maize', calories: 365, protein: 9.4, carbs: 74, fats: 4.7, mealType: 'lunch' },
  { name: 'Barley', calories: 354, protein: 12, carbs: 73, fats: 2.3, mealType: 'dinner' },
  { name: 'Oats', calories: 389, protein: 16, carbs: 66, fats: 6.9, mealType: 'breakfast' },
  { name: 'Millet', calories: 378, protein: 11, carbs: 73, fats: 4.2, mealType: 'lunch' },
  { name: 'Rye', calories: 335, protein: 10, carbs: 69, fats: 1.6, mealType: 'breakfast' },
  { name: 'Sorghum', calories: 329, protein: 10, carbs: 72, fats: 3.3, mealType: 'lunch' },
  { name: 'Buckwheat', calories: 343, protein: 13, carbs: 72, fats: 3.4, mealType: 'breakfast' },
  { name: 'Amaranth', calories: 371, protein: 14, carbs: 65, fats: 6.5, mealType: 'breakfast' },
  { name: 'Teff', calories: 367, protein: 13, carbs: 73, fats: 2.4, mealType: 'breakfast' },
  { name: 'Farro', calories: 340, protein: 14, carbs: 71, fats: 2.5, mealType: 'lunch' },
  { name: 'Spelt', calories: 338, protein: 14, carbs: 70, fats: 2.4, mealType: 'lunch' },
  { name: 'Bulgur', calories: 342, protein: 12, carbs: 76, fats: 1.3, mealType: 'lunch' },
  { name: 'Wild Rice', calories: 357, protein: 14, carbs: 75, fats: 1.1, mealType: 'dinner' },
  
  // Additional foods
  { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fats: 4.8, mealType: 'lunch' },
  { name: 'Lentils', calories: 116, protein: 9, carbs: 20, fats: 0.4, mealType: 'lunch' },
  { name: 'Chickpeas', calories: 164, protein: 8.9, carbs: 27, fats: 2.6, mealType: 'lunch' },
  { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fats: 50, mealType: 'snack' },
  { name: 'Almonds', calories: 576, protein: 21, carbs: 22, fats: 49, mealType: 'snack' },
  { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fats: 65, mealType: 'snack' },
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fats: 100, mealType: 'lunch' },
  { name: 'Honey', calories: 304, protein: 0.3, carbs: 82, fats: 0, mealType: 'breakfast' },
  { name: 'Dark Chocolate', calories: 598, protein: 7.8, carbs: 46, fats: 43, mealType: 'snack' },
  { name: 'Protein Shake', calories: 120, protein: 20, carbs: 7, fats: 1, mealType: 'snack' },
  { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 43, fats: 3.4, mealType: 'breakfast' },
  { name: 'Bagel', calories: 245, protein: 9.4, carbs: 47, fats: 1.7, mealType: 'breakfast' },
  { name: 'Tuna', calories: 132, protein: 29, carbs: 0, fats: 1, mealType: 'lunch' },
  { name: 'Turkey Breast', calories: 104, protein: 24, carbs: 0, fats: 0.7, mealType: 'lunch' },
  { name: 'Ground Beef', calories: 250, protein: 26, carbs: 0, fats: 15, mealType: 'dinner' },
  { name: 'Pasta', calories: 158, protein: 5.8, carbs: 31, fats: 0.9, mealType: 'dinner' },
  { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, mealType: 'dinner' },
  { name: 'Hummus', calories: 166, protein: 7.9, carbs: 14, fats: 9.6, mealType: 'snack' },
  { name: 'Green Tea', calories: 2, protein: 0, carbs: 0, fats: 0, mealType: 'snack' },
  { name: 'Popcorn', calories: 375, protein: 11, carbs: 74, fats: 4.3, mealType: 'snack' }
];

const MealLogger = () => {
  const { addMeal, meals, deleteMeal, updateMeal } = useNutrition();
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealType: 'breakfast',
    time: new Date().toTimeString().slice(0, 5)
  });
  const [isListening, setIsListening] = useState(false);
  const [todayMeals, setTodayMeals] = useState([]);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editingMealId, setEditingMealId] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const micButtonRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    const recognition = initSpeechRecognition();
    setSpeechRecognition(recognition);
  }, []);
  
  // Filter today's meals
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const filtered = meals.filter(meal => 
      meal.created_at && meal.created_at.startsWith(today)
    );
    
    // Sort by time if available
    const sorted = [...filtered].sort((a, b) => {
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });
    
    setTodayMeals(sorted);
  }, [meals]);
  
  // Handle food search
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase();
      const results = FOOD_DATABASE.filter(food => 
        food.name.toLowerCase().includes(term)
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm]);
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'name') {
      setSearchTerm(value);
    }
  };
  
  // Select a food from search results
  const selectFood = (food) => {
    setNewMeal({
      name: food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fats: food.fats.toString(),
      mealType: food.mealType || newMeal.mealType,
      time: newMeal.time
    });
    setSearchTerm('');
    setShowSearchResults(false);
  };
  
  // Quick add a common food
  const quickAddFood = (food) => {
    const mealData = {
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      mealType: food.mealType,
      time: newMeal.time
    };
    
    addMeal(mealData);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newMeal.name || !newMeal.calories) {
      return;
    }
    
    try {
      // Convert string values to numbers
      const mealData = {
        name: newMeal.name,
        calories: Number(newMeal.calories),
        protein: Number(newMeal.protein) || 0,
        carbs: Number(newMeal.carbs) || 0,
        fats: Number(newMeal.fats) || 0,
        mealType: newMeal.mealType,
        time: newMeal.time
      };
      
      if (editingMealId) {
        await updateMeal(editingMealId, mealData);
        setEditingMealId(null);
      } else {
        await addMeal(mealData);
      }
      
      // Reset form
      setNewMeal({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        mealType: 'breakfast',
        time: new Date().toTimeString().slice(0, 5)
      });
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };
  
  // Start editing a meal
  const startEditingMeal = (meal) => {
    setNewMeal({
      name: meal.name,
      calories: meal.calories.toString(),
      protein: meal.protein.toString(),
      carbs: meal.carbs.toString(),
      fats: meal.fats.toString(),
      mealType: meal.mealType || 'breakfast',
      time: meal.time || new Date().toTimeString().slice(0, 5)
    });
    setEditingMealId(meal.id);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingMealId(null);
    setNewMeal({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      mealType: 'breakfast',
      time: new Date().toTimeString().slice(0, 5)
    });
  };
  
  // Handle meal deletion
  const handleDeleteMeal = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteMeal(mealId);
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };
  
  // Start voice recognition
  const startListening = () => {
    if (!speechRecognition) return;
    
    setIsListening(true);
    setRecognizedText('');
    
    speechRecognition.onResult((text) => {
      setRecognizedText(text);
    });
    
    speechRecognition.onError((error) => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    });
    
    speechRecognition.start();
  };
  
  // Stop voice recognition and process text
  const stopListening = async () => {
    if (!speechRecognition) return;
    
    speechRecognition.stop();
    setIsListening(false);
    
    if (recognizedText) {
      setProcessing(true);
      
      try {
        // Process the text to extract nutrition information
        const nutritionData = await processNutritionText(recognizedText);
        
        if (nutritionData) {
          // Update form with extracted data
          setNewMeal({
            name: nutritionData.foodItem,
            calories: nutritionData.calories.toString(),
            protein: nutritionData.protein.toString(),
            carbs: nutritionData.carbs.toString(),
            fats: nutritionData.fats.toString(),
            mealType: newMeal.mealType,
            time: newMeal.time
          });
        }
      } catch (error) {
        console.error('Error processing nutrition text:', error);
      } finally {
        setProcessing(false);
      }
    }
  };
  
  // Filter meals by category
  const filteredMeals = activeCategory === 'all'
    ? todayMeals
    : todayMeals.filter(meal => meal.mealType === activeCategory);

  // Get meal type icon
  const getMealTypeIcon = (type) => {
    switch(type) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🥗';
      case 'dinner':
        return '🍽️';
      case 'snack':
        return '🥪';
      default:
        return '🍽️';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-green-500 p-4 text-white">
        <h2 className="text-xl font-semibold">Food Diary</h2>
        <p className="text-sm text-green-100">Track everything you eat and drink</p>
      </div>
      
      {/* Quick Add Common Foods */}
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-medium mb-2 text-gray-700">Quick Add Common Foods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMON_FOODS.slice(0, 8).map((food, index) => (
            <button
              key={index}
              onClick={() => quickAddFood(food)}
              className="bg-white border border-gray-200 rounded-lg p-2 text-left hover:bg-green-50 transition"
            >
              <div className="flex items-center">
                <span className="mr-2">{getMealTypeIcon(food.mealType)}</span>
                <div>
                  <p className="font-medium text-sm">{food.name}</p>
                  <p className="text-xs text-gray-500">{food.calories} cal</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Voice Input Section */}
      <div className="p-4 bg-green-50 border-b border-green-100">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Voice Food Logging</h3>
            <p className="text-sm text-gray-600">Describe what you ate</p>
          </div>
          <button
            ref={micButtonRef}
            onClick={isListening ? stopListening : startListening}
            disabled={processing}
            className={`ml-auto p-3 rounded-full ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Voice Status */}
        {isListening && (
          <div className="text-sm text-green-700 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Listening... Describe what you ate
          </div>
        )}
        
        {processing && (
          <div className="text-sm text-blue-600 flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing your food...
          </div>
        )}
        
        {recognizedText && !isListening && !processing && (
          <div className="text-sm text-gray-700 mt-2">
            <p className="font-medium">Recognized:</p>
            <p className="italic">{recognizedText}</p>
          </div>
        )}
      </div>
      
      {/* Manual Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-b">
        <h3 className="font-medium mb-3 text-gray-700">
          {editingMealId ? 'Edit Meal' : 'Add New Meal'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newMeal.name}
              onChange={handleInputChange}
              placeholder="Search or enter food name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
              required
              autoComplete="off"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((food, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-green-50 cursor-pointer border-b flex items-center"
                    onClick={() => selectFood(food)}
                  >
                    <span className="mr-2">{getMealTypeIcon(food.mealType)}</span>
                    <div>
                      <div>{food.name}</div>
                      <div className="text-xs text-gray-500">
                        {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={newMeal.calories}
              onChange={handleInputChange}
              placeholder="e.g. 500"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={newMeal.protein}
              onChange={handleInputChange}
              placeholder="e.g. 30"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={newMeal.carbs}
              onChange={handleInputChange}
              placeholder="e.g. 50"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="fats" className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
            <input
              type="number"
              id="fats"
              name="fats"
              value={newMeal.fats}
              onChange={handleInputChange}
              placeholder="e.g. 15"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <select
              id="mealType"
              name="mealType"
              value={newMeal.mealType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={newMeal.time}
            onChange={handleInputChange}
            className="w-full md:w-1/3 p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium p-3 rounded transition"
          >
            {editingMealId ? 'Update Meal' : 'Log This Meal'}
          </button>
          
          {editingMealId && (
            <button
              type="button"
              onClick={cancelEditing}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium p-3 rounded transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {/* Today's Meals List */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Today's Meals ({todayMeals.length})</h3>
          
          {/* Meal type filter tabs */}
          <div className="flex text-sm">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2 py-1 rounded-l-md ${
                activeCategory === 'all'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('breakfast')}
              className={`px-2 py-1 ${
                activeCategory === 'breakfast'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🍳 Breakfast
            </button>
            <button
              onClick={() => setActiveCategory('lunch')}
              className={`px-2 py-1 ${
                activeCategory === 'lunch'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🥗 Lunch
            </button>
            <button
              onClick={() => setActiveCategory('dinner')}
              className={`px-2 py-1 ${
                activeCategory === 'dinner'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🍽️ Dinner
            </button>
            <button
              onClick={() => setActiveCategory('snack')}
              className={`px-2 py-1 rounded-r-md ${
                activeCategory === 'snack'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🥪 Snack
            </button>
          </div>
        </div>
        
        {filteredMeals.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No meals logged yet today</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {filteredMeals.map((meal, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-3 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{getMealTypeIcon(meal.mealType || 'other')}</span>
                    <div>
                      <h4 className="font-medium">{meal.name}</h4>
                      <div className="text-xs text-gray-500">
                        {meal.time ? (
                          <span>{meal.time}</span>
                        ) : (
                          <span>No time recorded</span>
                        )}
                        {' • '}
                        <span className="capitalize">{meal.mealType || 'Other'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold">{meal.calories} cal</span>
                    <div className="flex space-x-1 mt-1">
                      <button 
                        onClick={() => startEditingMeal(meal)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 grid grid-cols-3 gap-1">
                  <div className="bg-blue-50 px-2 py-1 rounded text-center">
                    <span className="font-medium text-blue-700">{meal.protein}g</span>
                    <span className="text-xs block text-gray-500">Protein</span>
                  </div>
                  <div className="bg-orange-50 px-2 py-1 rounded text-center">
                    <span className="font-medium text-orange-700">{meal.carbs}g</span>
                    <span className="text-xs block text-gray-500">Carbs</span>
                  </div>
                  <div className="bg-yellow-50 px-2 py-1 rounded text-center">
                    <span className="font-medium text-yellow-700">{meal.fats}g</span>
                    <span className="text-xs block text-gray-500">Fats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealLogger; 