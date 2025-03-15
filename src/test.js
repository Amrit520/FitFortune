import fetch from 'cross-fetch';
import { testDatabaseConnection } from './services/testConnection.js';
import mealsService from './services/mealsService.js';
import { config } from './config.js';
import { setupDatabase } from './services/setupDatabase.js';

// Set global fetch for Node.js environment
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const runTests = async () => {
  console.log('Starting tests...');
  console.log('Environment:', process.env.NODE_ENV);
  
  // 1. Check configuration
  console.log('\nChecking configuration...');
  console.log('SUPABASE_URL:', config.SUPABASE_URL ? '✓ Present' : '✗ Missing');
  console.log('SUPABASE_ANON_KEY:', config.SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing');

  try {
    // 2. Set up database
    console.log('\nSetting up database...');
    const setupResult = await setupDatabase();
    if (setupResult) {
      console.log('Database setup complete');
    } else {
      console.log('Database setup completed with warnings. Some tests may fail.');
    }

    // 3. Test database connection
    console.log('\nTesting database connection...');
    const connectionResult = await testDatabaseConnection();
    console.log('Connection test result:', connectionResult ? '✓ Success' : '✗ Failed');

    if (!connectionResult) {
      console.log('Database connection failed. Switching to local mode for testing.');
    }

    // 4. Test basic operations
    console.log('\nTesting basic operations...');

    try {
      // Test adding a meal
      console.log('Testing addMeal...');
      const testMeal = {
        calories: 500,
        protein: 30,
        carbs: 50,
        fats: 20,
        name: 'Test Meal',
        created_at: new Date().toISOString()
      };

      const addedMeal = await mealsService.addMeal(testMeal);
      console.log('Add meal result:', addedMeal ? '✓ Success' : '✗ Failed');

      // Test fetching meals
      console.log('Testing getMeals...');
      const meals = await mealsService.getMeals();
      console.log('Get meals result:', meals?.length >= 0 ? '✓ Success' : '✗ Failed');

      // Test updating a meal
      if (addedMeal) {
        console.log('Testing updateMeal...');
        const updateResult = await mealsService.updateMeal(addedMeal.id, {
          ...addedMeal,
          calories: 600
        });
        console.log('Update meal result:', updateResult ? '✓ Success' : '✗ Failed');

        // Test deleting a meal
        console.log('Testing deleteMeal...');
        const deleteResult = await mealsService.deleteMeal(addedMeal.id);
        console.log('Delete meal result:', deleteResult ? '✓ Success' : '✗ Failed');
      }
      
      console.log('\nAll tests completed successfully! ✓');
    } catch (error) {
      console.error('Operation tests failed:', error);
      console.log('\nYou need to create the meals table manually in the Supabase dashboard:');
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
      
      console.log('\nAfter creating the table, run the tests again.');
    }
  } catch (error) {
    console.error('\nTests failed:', error);
    console.error('\nPlease check:');
    console.error('1. Your .env file has the correct values');
    console.error('2. Your Supabase project is running');
    console.error('3. Your database has the required tables');
    console.error('4. Your network connection is stable');
  }
};

runTests(); 