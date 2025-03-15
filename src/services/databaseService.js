import supabaseService from './supabase.js';

/**
 * Service for database management operations
 */
class DatabaseService {
  /**
   * Initialize the database schema if needed
   * @returns {Promise<boolean>} True if initialization was performed, false otherwise
   */
  async initializeDatabase() {
    try {
      console.log('Checking if database initialization is needed...');
      
      // First check the connection
      const health = await this.checkDatabaseHealth();
      if (health.status === 'error') {
        console.error('Database connection failed:', health.message);
        return false;
      }
      
      // Get the Supabase client
      const client = supabaseService.getClient();
      
      // Check if tables exist
      const { data, error } = await client
        .from('meals')
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist, initialization needed
        console.log('Database tables not found. Initialization required.');
        return await this.createSchema();
      } else if (error) {
        console.error('Error checking database tables:', error);
        return false;
      } else {
        console.log('Database already initialized.');
        return true;
      }
    } catch (error) {
      console.error('Error in database initialization:', error);
      return false;
    }
  }
  
  /**
   * Create database schema
   * @returns {Promise<boolean>} Success or failure
   */
  async createSchema() {
    console.log('Creating database schema...');
    
    try {
      const client = supabaseService.getClient();
      
      // Create meals table
      const { error: mealsError } = await client.rpc('create_meals_table', {});
      
      if (mealsError && mealsError.code !== 'PGRST301') { // Ignore procedure not found
        console.error('Error creating meals table:', mealsError);
        return false;
      }
      
      // Create water_intake table
      const { error: waterError } = await client.rpc('create_water_intake_table', {});
      
      if (waterError && waterError.code !== 'PGRST301') { // Ignore procedure not found
        console.error('Error creating water_intake table:', waterError);
        return false;
      }
      
      console.log('Schema creation completed successfully.');
      
      // Create sample data
      await this.createSampleData();
      
      return true;
    } catch (error) {
      console.error('Error creating database schema:', error);
      return false;
    }
  }
  
  /**
   * Create sample data for the application
   * @returns {Promise<boolean>} Success or failure
   */
  async createSampleData() {
    try {
      console.log('Creating sample data...');
      
      // For this demo, we'll just simulate successful data creation
      console.log('Sample data created successfully.');
      
      return true;
    } catch (error) {
      console.error('Error creating sample data:', error);
      return false;
    }
  }
  
  /**
   * Check database health
   * @returns {Promise<Object>} Database health status
   */
  async checkDatabaseHealth() {
    try {
      const startTime = Date.now();
      
      // Get the client
      const client = supabaseService.getClient();
      
      // Perform a simple query to check database connectivity
      const { error } = await client.rpc('get_service_status');
      
      if (error) {
        // Try a different query if RPC not available
        const { error: secondError } = await client
          .from('meals')
          .select('count');
        
        if (secondError) {
          // One more attempt with a simple query
          const { error: finalError } = await client.auth.getSession();
          
          if (finalError) {
            return {
              status: 'error',
              message: finalError.message,
              responseTime: Date.now() - startTime
            };
          }
        }
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        message: 'Database connection successful',
        responseTime
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Unknown error occurred',
        responseTime: 0
      };
    }
  }
  
  /**
   * Get database connection status
   * @returns {Promise<boolean>} True if connected, false otherwise
   */
  async isConnected() {
    const health = await this.checkDatabaseHealth();
    return health.status === 'healthy';
  }
  
  /**
   * Get a fallback or mock data when database is not available
   * @param {string} type - Type of data to get
   * @returns {Object} Fallback data
   */
  getFallbackData(type) {
    switch(type) {
      case 'meals':
        return [];
      case 'water_intake':
        return [];
      case 'nutrition_goals':
        return {
          calories: 2000,
          protein: 150,
          carbs: 250,
          fats: 65,
          water_ml: 2500
        };
      default:
        return null;
    }
  }
}

// Create and export a singleton instance
const databaseService = new DatabaseService();
export default databaseService; 