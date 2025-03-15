// Node.js script to run the Gemini API test
// Run with: node test-gemini-api.js

import('./src/tests/geminiApiTest.js')
  .then(() => {
    console.log('Test script loaded and executed');
  })
  .catch(error => {
    console.error('Error running test script:', error);
    process.exit(1);
  }); 