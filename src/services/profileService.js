import supabaseService from './supabase.js';

/**
 * Service for handling user profile operations with Supabase
 */
class ProfileService {
  /**
   * Get a user's profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile or error
   */
  async getProfile(userId) {
    try {
      const client = supabaseService.getClient();
      
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  /**
   * Update a user's profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile or error
   */
  async updateProfile(userId, profileData) {
    try {
      const client = supabaseService.getClient();
      
      const { data, error } = await client
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Create a new user profile
   * @param {Object} profileData - Profile data to create
   * @returns {Promise<Object>} Created profile or error
   */
  async createProfile(profileData) {
    try {
      const client = supabaseService.getClient();
      
      const { data, error } = await client
        .from('profiles')
        .insert([profileData])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }

  /**
   * Upload a profile avatar
   * @param {string} userId - User ID
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} Uploaded avatar URL or error
   */
  async uploadAvatar(userId, file) {
    try {
      const client = supabaseService.getClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await client
        .storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = client
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      await this.updateProfile(userId, {
        avatar_url: urlData.publicUrl
      });
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  /**
   * Get user stats
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User stats or error
   */
  async getUserStats(userId) {
    try {
      // This would typically involve multiple queries to different tables
      // For now, we'll return mock data
      
      return {
        stats: {
          totalMeals: 0,
          totalWorkouts: 0,
          streakDays: 0,
          achievements: 0,
          points: 0
        },
        error: null
      };
    } catch (error) {
      console.error('Unexpected error getting user stats:', error);
      return { stats: null, error: error.message };
    }
  }
}

// Create and export a singleton instance
const profileService = new ProfileService();
export default profileService; 