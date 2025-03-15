// Gemini API Integration
import { config } from '../config.js';

if (!config.GEMINI_API_KEY) {
  throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
}

/**
 * Make a request to the Gemini API with retry logic
 */
const callGeminiAPI = async (content, options = { retries: 2, timeout: 10000 }) => {
  let lastError = null;

  for (let i = 0; i < options.retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout);

      const response = await fetch(`${config.GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: content }] }],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 1000,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      if (error.name === 'AbortError') {
        console.warn('Gemini API request timed out, retrying...');
      } else {
        console.error('Error calling Gemini API:', error);
      }
      if (i < options.retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError;
};

/**
 * Initialize speech recognition using Gemini API
 * @returns {Object} Speech recognition controller
 */
export const initSpeechRecognition = () => {
  // This is a placeholder for speech recognition
  // In a real implementation, we would use the Web Speech API or a similar service
  
  return {
    start: () => console.log('Starting speech recognition...'),
    stop: () => console.log('Stopping speech recognition...'),
    onResult: (callback) => console.log('Setting up result callback'),
    onError: (callback) => console.log('Setting up error callback')
  };
};

/**
 * Process text input to extract nutrition information using Gemini
 * @param {string} text - User input text about food consumption
 * @returns {Promise<Object>} Extracted nutrition data
 */
export const processNutritionText = async (text) => {
  try {
    console.log('Processing nutrition text with Gemini API:', text);
    
    // First, check if we can use pattern matching for common foods
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
      }
    ];

    // Extract quantity if specified (e.g., "2 apples")
    const quantityMatch = text.match(/(\d+)\s+([a-z]+)/i);
    let quantity = 1;
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[1], 10);
    }

    // Check for pattern matches first for instant results
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
        
        console.log('Pattern matched food item:', details);
        return {
          ...details,
          confidence: 0.92,
          method: 'pattern-matching'
        };
      }
    }
    
    // If no pattern match, try using Gemini API for more complex foods
    try {
      const prompt = `
        You are a professional nutritionist with expertise in food composition and nutrition data.
        Analyze this food description and provide precise nutritional information: "${text}"
        
        Requirements:
        1. Use standard USDA database values when available
        2. Consider all ingredients and preparation methods
        3. Use standard serving sizes
        4. Round to 1 decimal place
        5. Provide confidence level based on data reliability
        
        Respond ONLY with a JSON object in this exact format:
        {
          "foodItem": "Detailed name of the food",
          "calories": number (total calories),
          "protein": number (grams of protein),
          "carbs": number (grams of carbohydrates),
          "fats": number (grams of fat),
          "confidence": number (between 0 and 1),
          "servingSize": "standard serving size used",
          "notes": "any important notes about the calculation"
        }
      `;
      
      const response = await callGeminiAPI(prompt);
      const jsonMatch = response.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const nutritionData = JSON.parse(jsonMatch[0]);
        console.log('Gemini API nutrition data:', nutritionData);
        return {
          ...nutritionData,
          method: 'gemini-api'
        };
      }
      throw new Error('Invalid response format from Gemini API');
    } catch (apiError) {
      throw apiError;
    }
  } catch (error) {
    console.error('Error processing nutrition text:', error);
    throw error;
  }
};

/**
 * Generate nutrition advice using Gemini API
 * @param {string} question - User's nutrition question
 * @returns {Promise<string>} AI-generated response
 */
export const generateNutritionAdvice = async (question) => {
  try {
    console.log('Generating nutrition advice with Gemini API for:', question);
    
    // Check for specific measurement questions
    const measurementMatch = question.match(/how much (\w+) in (\d+)(?:g|gm|gram|grams)? ?(\w+)/i);
    if (measurementMatch) {
      const [_, nutrient, amount, food] = measurementMatch;
      const prompt = `
        You are a nutrition database expert. Provide the exact ${nutrient} content in ${amount}g of ${food}.
        
        Requirements:
        1. Use official USDA database values
        2. Provide the answer in a clear, specific format
        3. Include the exact measurement
        4. Specify if it's raw/cooked if relevant
        5. Add any relevant context about the nutrient
        
        Format: "${amount}g of [food] contains [X]g of ${nutrient}. [Additional context if relevant]"
      `;
      
      const response = await callGeminiAPI(prompt);
      return response.candidates[0].content.parts[0].text.trim();
    }
    
    // For general nutrition questions, use the knowledge base first
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
      }
    ];

    const lowerQuestion = question.toLowerCase();
    
    // Check knowledge base
    for (const item of nutritionKnowledge) {
      if (item.keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return item.response;
      }
    }
    
    // For other questions, use Gemini API
    const prompt = `
      You are a certified nutritionist with expertise in diet and nutrition science.
      Provide a detailed, evidence-based answer to this nutrition question: "${question}"

      Requirements:
      1. Be specific and directly address the question
      2. Include numerical values where relevant
      3. Base answers on scientific research
      4. Keep the response clear and actionable
      5. Maximum length: 150 words
      6. Format in clear paragraphs
      7. Include references to scientific sources if applicable
      8. Acknowledge any limitations or uncertainties

      If the question asks for specific measurements, provide exact values.
      If the question is unclear, ask for clarification.
    `;
    
    const response = await callGeminiAPI(prompt);
    const adviceText = response.candidates[0].content.parts[0].text.trim();
    
    // Verify response relevance
    if (!adviceText.toLowerCase().includes(question.toLowerCase().split(' ')[0])) {
      throw new Error('Response not relevant to question');
    }
    
    return adviceText;
  } catch (error) {
    console.error('Error generating nutrition advice:', error);
    throw error;
  }
};

export default {
  initSpeechRecognition,
  processNutritionText,
  generateNutritionAdvice
}; 