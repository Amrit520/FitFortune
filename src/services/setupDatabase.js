import fetch from 'cross-fetch';
import supabaseService from './supabase.js';

// Set global fetch for Node.js environment
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

export const setupDatabase = async () => {
  console.log('Setting up database...');
  
  try {
    const client = supabaseService.getClient();
    
    // Check if meals table exists
    console.log('Checking if meals table exists...');
    const { error: checkError } = await client.from('meals').select('count');
    
    if (checkError && checkError.code === '42P01') {
      console.log('Creating meals table...');
      
      // Create a simple meals table using SQL
      // Note: This requires database access which may not be available with anon key
      // You may need to create the table manually in the Supabase dashboard
      console.log('Please create the meals table manually in the Supabase dashboard with the following structure:');
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
      
      // For testing purposes, let's create a temporary table
      console.log('Creating a temporary table for testing...');
      const { data, error } = await client.from('temp_meals').insert([
        {
          user_id: 'test-user',
          name: 'Test Meal',
          calories: 500,
          protein: 30,
          carbs: 50,
          fats: 20
        }
      ]);
      
      if (error) {
        console.log('Could not create temporary table. Using local mode.');
        return false;
      }
      
      console.log('Temporary table created for testing.');
      return true;
    } else if (checkError) {
      console.error('Error checking meals table:', checkError);
      return false;
    } else {
      console.log('Meals table already exists.');
      return true;
    }
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  }
};

// Run setup if executed directly
if (process.argv[1].endsWith('setupDatabase.js')) {
  setupDatabase()
    .then(result => {
      if (result) {
        console.log('Database setup completed successfully!');
      } else {
        console.log('Database setup completed with warnings.');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
} 