// Configuration file for environment variables
import dotenv from 'dotenv';

// Load environment variables in Node.js environment
if (typeof process !== 'undefined') {
  dotenv.config();
}

// Get environment variables from the appropriate source
const getEnvVar = (name) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name];
  }
  return process.env[name];
};

// Export configuration
export const config = {
  SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY'),
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
}; 