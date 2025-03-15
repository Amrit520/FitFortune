import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

class SupabaseService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.connectionStatus = 'disconnected';
    this.offlineMode = false;
    this.lastConnectionAttempt = 0;
  }

  initialize() {
    if (this.isInitialized) return;

    console.log('Initializing Supabase client...');
    const supabaseUrl = config.SUPABASE_URL;
    const supabaseKey = config.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      this.connectionStatus = 'error';
      this.offlineMode = true;
      this.isInitialized = true;
      const error = new Error('Supabase configuration missing. Check your .env file.');
      console.error(error);
      return;
    }

    // Check if we should wait before retrying
    const now = Date.now();
    if (now - this.lastConnectionAttempt < 5000) { // 5-second cooldown
      console.log('Too soon to retry connection. Waiting...');
      return;
    }
    this.lastConnectionAttempt = now;

    try {
      console.log('Creating Supabase client...');
      this.client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: { 'x-application-name': 'fitfortune' }
        }
      });
      
      this.isInitialized = true;
      this.connectionStatus = 'connected';
      console.log('Supabase client initialized successfully');
    } catch (error) {
      this.connectionStatus = 'error';
      this.offlineMode = true;
      console.error('Failed to initialize Supabase client:', error);
    }
  }

  getClient() {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.client;
  }

  // Check if a specific error is retryable
  isRetryableError(error) {
    if (!error) return false;
    
    const retryableErrors = [
      'connection',
      'timeout',
      'network',
      'PGRST116',
      'socket',
      '503',
      '504'
    ];
    
    return retryableErrors.some(type => 
      error.message?.toLowerCase().includes(type) || 
      error.code?.includes(type)
    );
  }

  async testConnection() {
    try {
      console.log('Testing database connection...');
      const client = this.getClient();
      
      if (!client) {
        this.connectionStatus = 'error';
        this.offlineMode = true;
        return false;
      }
      
      const { data, error } = await client
        .from('meals')
        .select('id')
        .limit(1);
      
      if (error) {
        // Try a different table or method
        const { error: authError } = await client.auth.getSession();
        if (authError) {
          console.error('Database connection test failed completely:', error);
          this.connectionStatus = 'error';
          this.offlineMode = true;
          return false;
        }
      }
      
      this.connectionStatus = 'connected';
      this.offlineMode = false;
      console.log('Database connection test successful');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      this.connectionStatus = 'error';
      this.offlineMode = true;
      return false;
    }
  }

  async executeQuery(operation, options = { retries: 2, fallback: null }) {
    let lastError = null;
    let attempts = 0;
    
    while (attempts < options.retries) {
      try {
        if (this.offlineMode) {
          console.log('Operating in offline mode, returning fallback');
          return options.fallback;
        }
        
        const client = this.getClient();
        if (!client) {
          console.warn('No Supabase client available. Using fallback.');
          return options.fallback;
        }
        
        const result = await operation(client);
        
        if (result.error) {
          throw result.error;
        }
        
        this.connectionStatus = 'connected';
        this.offlineMode = false;
        return result.data;
      } catch (error) {
        lastError = error;
        attempts++;
        
        console.warn(`Database operation failed (attempt ${attempts}/${options.retries}):`, error);
        
        if (!this.isRetryableError(error) || attempts >= options.retries) {
          break;
        }
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 10000))
        );
        
        // Re-test connection
        this.connectionStatus = 'retrying';
        await this.testConnection();
      }
    }
    
    if (options.fallback !== undefined) {
      console.warn('Using fallback after all retries failed');
      this.offlineMode = true;
      return options.fallback;
    }
    
    throw lastError;
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }

  isOffline() {
    return this.offlineMode;
  }
}

// Create singleton instance
const supabaseService = new SupabaseService();

// Initialize immediately
supabaseService.initialize();

export default supabaseService; 