import supabaseService from './supabase.js';
import { config } from '../config.js';

export const testDatabaseConnection = async () => {
  console.log('Testing database connection...');
  
  // 1. Check environment variables
  console.log('Checking configuration...');
  console.log('SUPABASE_URL exists:', !!config.SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY exists:', !!config.SUPABASE_ANON_KEY);
  
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration. Please check your .env file');
  }

  // 2. Try to initialize the client
  try {
    console.log('Initializing Supabase client...');
    const client = supabaseService.getClient();
    console.log('Client initialized successfully');

    // 3. Test a simple query
    console.log('Testing database query...');
    
    // First try to query the meals table
    const { data, error } = await client.from('meals').select('count');
    
    if (error) {
      if (error.code === '42P01') {
        console.log('Meals table does not exist. You need to create it manually in the Supabase dashboard.');
        console.log(`
          CREATE TABLE IF NOT EXISTS public.meals (
            id SERIAL PRIMARY KEY,
            user_id TEXT,
            name TEXT,
            calories NUMERIC,
            protein NUMERIC,
            carbs NUMERIC,
            fats NUMERIC,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
        `);
        
        // Try to query any table to verify connection
        const { error: authError } = await client.from('_auth').select('count');
        if (!authError) {
          console.log('Database connection is working, but meals table is missing.');
          return true;
        }
        
        // Try to query the public schema
        const { error: schemaError } = await client.rpc('get_schema_version');
        if (!schemaError) {
          console.log('Database connection is working, but meals table is missing.');
          return true;
        }
        
        console.log('Database connection appears to be working, but no tables are accessible.');
        return true;
      }
      
      console.error('Database query failed:', error);
      return false;
    }

    console.log('Database connection successful!');
    console.log('Query result:', data);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}; 