// Test script for Gemini API integration
import { processNutritionText, generateNutritionAdvice } from '../services/geminiApi.js';

// Test function to run the API tests
const runGeminiApiTests = async () => {
  console.log('=== GEMINI API TEST SCRIPT ===');
  
  try {
    // Test 1: Process simple food text
    console.log('\nTest 1: Processing simple food text');
    const simpleFood = 'apple';
    console.log(`Input: "${simpleFood}"`);
    const simpleFoodResult = await processNutritionText(simpleFood);
    console.log('Result:', simpleFoodResult);
    
    // Test 2: Process complex food text
    console.log('\nTest 2: Processing complex food text');
    const complexFood = 'grilled chicken salad with avocado';
    console.log(`Input: "${complexFood}"`);
    const complexFoodResult = await processNutritionText(complexFood);
    console.log('Result:', complexFoodResult);
    
    // Test 3: Process food with quantity
    console.log('\nTest 3: Processing food with quantity');
    const quantityFood = '2 bananas';
    console.log(`Input: "${quantityFood}"`);
    const quantityFoodResult = await processNutritionText(quantityFood);
    console.log('Result:', quantityFoodResult);
    
    // Test 4: Generate nutrition advice for simple question
    console.log('\nTest 4: Generating nutrition advice for simple question');
    const simpleQuestion = 'What are good sources of protein?';
    console.log(`Question: "${simpleQuestion}"`);
    const simpleAdvice = await generateNutritionAdvice(simpleQuestion);
    console.log('Advice:', simpleAdvice);
    
    // Test 5: Generate nutrition advice for complex question
    console.log('\nTest 5: Generating nutrition advice for complex question');
    const complexQuestion = 'How can I balance my macros for muscle gain while staying in a caloric deficit?';
    console.log(`Question: "${complexQuestion}"`);
    const complexAdvice = await generateNutritionAdvice(complexQuestion);
    console.log('Advice:', complexAdvice);
    
    console.log('\n=== TESTS COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('\n=== TEST FAILED ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
};

// Run the tests
runGeminiApiTests();

// Export the test function for potential use in other modules
export default runGeminiApiTests; 