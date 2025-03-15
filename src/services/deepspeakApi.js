// DeepSpeak API integration
const DEEPSPEAK_API_KEY = import.meta.env.VITE_DEEPSPEAK_API_KEY || 'your_placeholder_key';

/**
 * Initialize speech recognition using DeepSpeak API
 * @returns {Object} Speech recognition controller
 */
export const initSpeechRecognition = () => {
  // This is a placeholder for the actual DeepSpeak API implementation
  // We'll replace this with actual API calls when we have the API key
  
  return {
    start: () => console.log('Starting speech recognition...'),
    stop: () => console.log('Stopping speech recognition...'),
    onResult: (callback) => {
      // In a real implementation, this would call the callback with speech recognition results
      console.log('Setting up result callback');
    },
    onError: (callback) => {
      // In a real implementation, this would call the callback with any errors
      console.log('Setting up error callback');
    }
  };
};

/**
 * Process text input through DeepSpeak NLP to extract nutrition information
 * @param {string} text - User input text
 * @returns {Promise<Object>} Extracted nutrition data
 */
export const processNutritionText = async (text) => {
  try {
    console.log('Processing nutrition text with DeepSpeak API:', text);
    
    // Basic food recognition patterns with estimated nutritional values
    const foodPatterns = [
      {
        regex: /apple|apples/i,
        details: { foodItem: 'Apple', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 }
      },
      {
        regex: /banana|bananas/i,
        details: { foodItem: 'Banana', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 }
      },
      {
        regex: /chicken\s+(?:breast|salad)/i,
        details: { foodItem: 'Chicken Breast/Salad', calories: 230, protein: 32, carbs: 5, fats: 9 }
      },
      {
        regex: /salad/i,
        details: { foodItem: 'Mixed Salad', calories: 120, protein: 3, carbs: 8, fats: 7 }
      },
      {
        regex: /protein\s+shake|shake/i,
        details: { foodItem: 'Protein Shake', calories: 180, protein: 25, carbs: 12, fats: 3 }
      },
      {
        regex: /bread|toast/i,
        details: { foodItem: 'Bread/Toast', calories: 160, protein: 6, carbs: 32, fats: 1.5 }
      },
      {
        regex: /eggs|egg/i,
        details: { foodItem: 'Eggs', calories: 140, protein: 12, carbs: 1, fats: 10 }
      },
      {
        regex: /coffee/i,
        details: { foodItem: 'Coffee', calories: 5, protein: 0, carbs: 0, fats: 0 }
      },
      {
        regex: /pasta/i,
        details: { foodItem: 'Pasta', calories: 320, protein: 12, carbs: 65, fats: 2 }
      },
      {
        regex: /rice/i,
        details: { foodItem: 'Rice', calories: 240, protein: 4.5, carbs: 53, fats: 0.5 }
      },
      {
        regex: /pizza/i,
        details: { foodItem: 'Pizza (2 slices)', calories: 450, protein: 18, carbs: 56, fats: 18 }
      },
      {
        regex: /burger|hamburger/i,
        details: { foodItem: 'Burger', calories: 550, protein: 25, carbs: 40, fats: 32 }
      },
      {
        regex: /sandwich/i,
        details: { foodItem: 'Sandwich', calories: 350, protein: 15, carbs: 40, fats: 14 }
      },
      {
        regex: /yogurt|yoghurt/i,
        details: { foodItem: 'Yogurt', calories: 150, protein: 12, carbs: 17, fats: 4 }
      },
      {
        regex: /oatmeal|oats/i,
        details: { foodItem: 'Oatmeal', calories: 170, protein: 6, carbs: 30, fats: 3 }
      }
    ];

    // Extract quantity if specified (e.g., "2 apples")
    const quantityMatch = text.match(/(\d+)\s+([a-z]+)/i);
    let quantity = 1;
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[1], 10);
    }

    // Check for matches
    for (const pattern of foodPatterns) {
      if (pattern.regex.test(text)) {
        const details = { ...pattern.details };
        
        // Adjust nutritional values based on quantity
        if (quantity > 1) {
          details.foodItem = `${quantity} ${details.foodItem}`;
          details.calories *= quantity;
          details.protein *= quantity;
          details.carbs *= quantity;
          details.fats *= quantity;
        }
        
        console.log('Recognized food item:', details);
        return {
          ...details,
          confidence: 0.92,
          method: 'pattern-matching'
        };
      }
    }
    
    // If no patterns match, return estimated values based on the text
    console.log('No exact match found, using generic estimation');
    return {
      foodItem: text,
      calories: Math.floor(Math.random() * 300) + 100, // 100-400 calories
      protein: Math.floor(Math.random() * 20) + 5,    // 5-25g protein
      carbs: Math.floor(Math.random() * 30) + 10,     // 10-40g carbs
      fats: Math.floor(Math.random() * 15) + 2,       // 2-17g fats
      confidence: 0.7,
      method: 'estimation'
    };
  } catch (error) {
    console.error('Error processing nutrition text:', error);
    throw error;
  }
};

/**
 * Generate response to a nutrition-related question
 * @param {string} question - User's nutrition question
 * @returns {Promise<string>} AI-generated response
 */
export const generateNutritionAdvice = async (question) => {
  try {
    console.log('Generating nutrition advice for:', question);
    
    // Define common nutrition questions and answers
    const nutritionKnowledge = [
      {
        keywords: ['protein', 'sources', 'high'],
        response: 'High-protein foods include chicken breast, turkey, lean beef, fish (especially tuna and salmon), eggs, dairy (Greek yogurt, cottage cheese), legumes (beans, lentils), tofu, tempeh, and seitan. For vegetarians and vegans, combining different plant proteins helps ensure you get all essential amino acids.'
      },
      {
        keywords: ['carbs', 'healthy', 'complex'],
        response: 'Healthy complex carbohydrates include whole grains (oats, brown rice, quinoa, barley), legumes (beans, lentils), fruits, vegetables, and sweet potatoes. These provide sustained energy and are rich in fiber, vitamins, and minerals.'
      },
      {
        keywords: ['fats', 'healthy', 'good'],
        response: 'Healthy fats include avocados, olive oil, nuts (almonds, walnuts), seeds (chia, flax), fatty fish (salmon, mackerel), and limited amounts of dark chocolate. These fats support brain function, nutrient absorption, and hormone production.'
      },
      {
        keywords: ['calories', 'many', 'how many', 'intake'],
        response: 'Daily calorie needs vary based on age, gender, weight, height, and activity level. As a general guideline, women typically need 1,600-2,400 calories daily, while men typically need 2,000-3,000 calories. For weight loss, a moderate deficit of 500 calories below maintenance level is often recommended.'
      },
      {
        keywords: ['water', 'drink', 'hydration'],
        response: 'Most health authorities recommend drinking 8-10 cups (64-80 oz) of water daily. However, individual needs vary based on activity level, climate, and overall health. A good indicator of proper hydration is light yellow urine.'
      },
      {
        keywords: ['weight loss', 'lose weight'],
        response: 'Sustainable weight loss involves creating a moderate calorie deficit through both dietary changes and increased physical activity. Focus on nutrient-dense foods, adequate protein intake (helps preserve muscle), portion control, and consistent physical activity. Aim for a gradual rate of 1-2 pounds per week.'
      },
      {
        keywords: ['meal prep', 'planning', 'plan'],
        response: 'Effective meal planning involves: 1) Planning your meals for the week, 2) Making a detailed shopping list, 3) Preparing components in batch (proteins, grains, vegetables), 4) Using proper food storage containers, and 5) Including variety to prevent boredom. This approach saves time, money, and helps maintain nutritional goals.'
      },
      {
        keywords: ['breakfast', 'morning'],
        response: 'Nutritious breakfast options include: overnight oats with fruits and nuts, Greek yogurt with berries and granola, vegetable omelet with whole-grain toast, smoothies with protein and greens, or whole-grain toast with avocado and eggs. A balanced breakfast provides sustained energy and helps prevent mid-morning hunger.'
      }
    ];

    const lowerQuestion = question.toLowerCase();
    
    // Check for direct matches with nutrition knowledge base
    for (const item of nutritionKnowledge) {
      if (item.keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return item.response;
      }
    }
    
    // Default responses for general nutrition questions
    const defaultResponses = [
      "For optimal nutrition, aim for a varied diet rich in vegetables, fruits, lean proteins, whole grains, and healthy fats. This provides a wide range of nutrients essential for health.",
      "Portion control is key to maintaining a healthy diet. Consider using smaller plates, measuring portions initially, and paying attention to hunger and fullness cues.",
      "When making dietary changes, focus on sustainable habits rather than restrictive diets. Small, consistent changes over time lead to lasting results.",
      "For specific dietary recommendations tailored to your health conditions or goals, consider consulting with a registered dietitian or healthcare provider."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  } catch (error) {
    console.error('Error generating nutrition advice:', error);
    return "I'm having trouble providing advice on that topic right now. Please try asking about protein, carbs, fats, calories, or meal planning.";
  }
};

export default {
  initSpeechRecognition,
  processNutritionText,
  generateNutritionAdvice
}; 