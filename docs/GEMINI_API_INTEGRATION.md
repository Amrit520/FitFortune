# Gemini API Integration

This document explains how the Gemini API is integrated into the Nutrition Tracker application.

## Overview

The Gemini API is used to power several AI features in the application:

1. **Natural Language Processing** for food recognition and nutritional data extraction
2. **AI-powered Nutrition Advice** for answering user questions about nutrition
3. **Speech Recognition** for hands-free meal logging (placeholder implementation)

## Setup

### 1. Get a Gemini API Key

1. Visit the [Google AI Studio](https://ai.google.dev/) and sign up for an account
2. Create a new API key in the Google AI Studio dashboard
3. Copy your API key for use in the application

### 2. Configure Environment Variables

Add your Gemini API key to the `.env` file:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Implementation Details

### API Service

The Gemini API integration is implemented in `src/services/geminiApi.js`. This service provides three main functions:

1. `initSpeechRecognition()` - A placeholder for speech recognition functionality
2. `processNutritionText(text)` - Processes text input to extract nutrition information
3. `generateNutritionAdvice(question)` - Generates responses to nutrition-related questions

### Nutrition Text Processing

The `processNutritionText` function uses a hybrid approach:

1. **Pattern Matching** - For common foods, it uses regex patterns to quickly identify and return nutritional data
2. **Gemini API** - For more complex food descriptions, it uses the Gemini API to extract nutritional information
3. **Fallback Estimation** - If both methods fail, it provides a generic estimation

### Nutrition Advice Generation

The `generateNutritionAdvice` function also uses a hybrid approach:

1. **Knowledge Base** - For common nutrition questions, it uses a predefined knowledge base for instant responses
2. **Gemini API** - For more complex questions, it uses the Gemini API to generate personalized advice
3. **Default Responses** - If both methods fail, it provides generic nutrition advice

## Testing

You can test the Gemini API integration using the provided test script:

```bash
npm run test:gemini
```

This script tests various aspects of the API integration:
- Processing simple food text
- Processing complex food descriptions
- Processing food with quantity
- Generating nutrition advice for simple questions
- Generating nutrition advice for complex questions

## Fallback Mechanisms

The implementation includes several fallback mechanisms to ensure the application works even if:

1. The Gemini API is unavailable
2. The API key is invalid
3. The API response format changes
4. The user's request is unclear or ambiguous

## Performance Considerations

To optimize performance and reduce API costs:

1. Common foods are recognized using pattern matching without API calls
2. Common nutrition questions are answered from a knowledge base without API calls
3. API responses are logged for debugging purposes
4. Error handling is implemented to prevent application crashes

## Future Improvements

Potential improvements for the Gemini API integration:

1. Implement actual speech recognition using the Web Speech API
2. Cache API responses for frequently asked questions
3. Expand the pattern matching database for more foods
4. Add more sophisticated error handling and retry mechanisms
5. Implement user feedback for improving AI responses over time 