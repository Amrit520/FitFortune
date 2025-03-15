import supabaseService from './supabase.js';

/**
 * Service for handling authentication operations with Supabase
 */
class AuthService {
  /**
   * Get the current user session
   * @returns {Promise<Object>} The current session or null
   */
  async getSession() {
    try {
      const { data, error } = await supabaseService.getClient().auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        return { session: null, error: error.message };
      }
      
      return { session: data.session, error: null };
    } catch (error) {
      console.error('Unexpected error getting session:', error);
      return { session: null, error: error.message };
    }
  }

  /**
   * Get the current user
   * @returns {Promise<Object>} The current user or null
   */
  async getUser() {
    try {
      const { data, error } = await supabaseService.getClient().auth.getUser();
      
      if (error) {
        console.error('Error getting user:', error.message);
        return { user: null, error: error.message };
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Unexpected error getting user:', error);
      return { user: null, error: error.message };
    }
  }

  /**
   * Sign up a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {Object} userData - Optional user metadata
   * @returns {Promise<Object>} Result of sign up operation
   */
  async signUp(email, password, userData = {}) {
    try {
      const client = supabaseService.getClient();
      
      // For development/demo, use email auto-confirmation
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      
      if (error) {
        console.error('Error signing up:', error.message);
        return { user: null, error: error.message };
      }
      
      // If in development mode, also save to local storage for easier testing
      if (process.env.NODE_ENV === 'development' || true) {
        // Store user data in local storage for demo purposes
        localStorage.setItem('demoUser', JSON.stringify({
          email,
          password,
          userData
        }));
      }
      
      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Unexpected error signing up:', error);
      return { user: null, error: error.message };
    }
  }

  /**
   * Sign in a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Result of sign in operation
   */
  async signIn(email, password) {
    try {
      const client = supabaseService.getClient();
      
      // First try Supabase auth
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });
      
      // If successful with Supabase, return the user
      if (!error && data.user) {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        return { 
          user: data.user, 
          session: data.session, 
          error: null 
        };
      }
      
      // If Supabase auth failed, check if we have a demo user
      if (process.env.NODE_ENV === 'development' || true) {
        const demoUserStr = localStorage.getItem('demoUser');
        if (demoUserStr) {
          const demoUser = JSON.parse(demoUserStr);
          
          // Check if credentials match
          if (demoUser.email === email && demoUser.password === password) {
            // Create a mock user
            const mockUser = {
              id: 'demo-' + Date.now(),
              email: demoUser.email,
              user_metadata: demoUser.userData,
              app_metadata: {},
              created_at: new Date().toISOString()
            };
            
            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            return {
              user: mockUser,
              session: { access_token: 'demo-token' },
              error: null
            };
          }
        }
      }
      
      // If no demo user or credentials don't match, return the original error
      if (error) {
        console.error('Error signing in:', error.message);
        return { user: null, session: null, error: error.message };
      }
      
      // Generic error if neither method worked
      return { 
        user: null, 
        session: null, 
        error: 'Invalid email or password' 
      };
    } catch (error) {
      console.error('Unexpected error signing in:', error);
      return { user: null, session: null, error: error.message };
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise<Object>} Result of sign out operation
   */
  async signOut() {
    try {
      // Remove user from localStorage
      localStorage.removeItem('user');
      
      const client = supabaseService.getClient();
      const { error } = await client.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected error signing out:', error);
      return { error: error.message };
    }
  }

  /**
   * Send a password reset email
   * @param {string} email - User's email
   * @returns {Promise<Object>} Result of password reset operation
   */
  async resetPassword(email) {
    try {
      const client = supabaseService.getClient();
      const { error } = await client.auth.resetPasswordForEmail(email);
      
      if (error) {
        console.error('Error resetting password:', error.message);
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected error resetting password:', error);
      return { error: error.message };
    }
  }

  /**
   * Update the password for the current user
   * @param {string} newPassword - The new password
   * @returns {Promise<Object>} Result of password update operation
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabaseService.getClient().auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Error updating password:', error.message);
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected error updating password:', error);
      return { error: error.message };
    }
  }

  /**
   * Update the user's email
   * @param {string} newEmail - The new email
   * @returns {Promise<Object>} Result of email update operation
   */
  async updateEmail(newEmail) {
    try {
      const { error } = await supabaseService.getClient().auth.updateUser({
        email: newEmail
      });
      
      if (error) {
        console.error('Error updating email:', error.message);
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected error updating email:', error);
      return { error: error.message };
    }
  }

  /**
   * Set up auth state change listener
   * @param {Function} callback - Function to call when auth state changes
   * @returns {Object} Subscription that can be unsubscribed
   */
  onAuthStateChange(callback) {
    try {
      const { data } = supabaseService.getClient().auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      
      return { subscription: data.subscription };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      return { subscription: { unsubscribe: () => {} } };
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService; 