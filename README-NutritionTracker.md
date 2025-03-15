# Enhanced Nutrition Tracker

This document outlines the new features and setup instructions for the enhanced Nutrition Tracker system.

## Features

### 1. Supabase Backend Integration
- Authentication with email/password
- Secure data storage for nutrition logs
- Real-time updates and sync across devices
- Row-level security for user data

### 2. Nutrition Tracking
- Advanced meal logging with macronutrient tracking
- Voice input for easy food logging using Gemini API
- Historical data visualization with charts
- Nutrition insights and recommendations

### 3. Water Tracker with Reminders
- Visual representation of water intake
- Customizable reminder system
- Browser notifications for hydration reminders
- Daily water intake goals

### 4. AI-Powered Nutrition Chatbot
- Answers nutrition-related questions using Gemini AI
- Provides meal suggestions based on goals
- Helps log meals through natural language processing
- Offers nutrition guidance and tips

## Setup Instructions

### Prerequisites
1. Node.js (v14 or later)
2.  npm run devnpm or yarn
3. Supabase account (for backend)
4. Gemini API key (for AI features)

### Supabase Setup
1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Run the SQL schema provided in `supabase_schema.sql` in the SQL editor
3. Configure authentication providers in the Auth settings
4. Get your Supabase URL and anon key from the API settings

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Installation
1. Install dependencies:
   ```
   npm install
   ```
   
2. Update the Supabase configuration in `src/services/supabase.js`:
   ```javascript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```

3. Update the Gemini API configuration in `src/services/geminiApi.js`:
   ```javascript
   const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Dependencies Added

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "chart.js": "^4.4.0"
  }
}
```

## Component Structure

- `src/services/` - API and service integrations
  - `supabase.js` - Supabase client setup
  - `geminiApi.js` - Gemini API integration
  - `notificationService.js` - Reminder system

- `src/context/` - Context providers
  - `AuthContext.jsx` - Authentication state management
  - `NutritionContext.jsx` - Nutrition data state management

- `src/components/nutrition/` - Specialized nutrition components
  - `NutritionChatbot.jsx` - Chatbot implementation
  - `WaterTracker.jsx` - Enhanced water tracking
  - `MealLogger.jsx` - Improved meal logging interface

- `src/pages/` - Main pages
  - `NutritionTracker.jsx` - The main nutrition tracking page

## Authentication Flow

1. Users sign up/log in via Supabase Auth
2. Authentication state is managed by the AuthContext
3. Protected routes and data are secured with Supabase RLS policies
4. User-specific data is fetched and displayed based on the authenticated user

## API Integration

### Supabase
- User authentication and profile management
- Storing and retrieving nutrition data
- Real-time updates and synchronization

### Gemini API
- Voice recognition for hands-free meal logging
- Natural language processing for food description
- Nutritional data extraction from text
- AI-powered nutrition advice and recommendations

## Troubleshooting

- **Authentication Issues**: Verify your Supabase configuration and check browser console for auth errors
- **Data Not Syncing**: Check network connectivity and Supabase permissions
- **Voice Recognition Not Working**: Ensure Gemini API key is valid and browser has microphone permissions
- **Notifications Not Working**: Check browser notification permissions and verify compatibility 