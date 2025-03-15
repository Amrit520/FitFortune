import supabase from './supabase';

/**
 * Service for handling nutrition operations with Supabase
 */
class NutritionService {
  /**
   * Get all meals for a user
   * @param {string} userId - User ID
   * @param {Object} options - Options for filtering and sorting
   * @returns {Promise<Object>} List of meals or error
   */
  async getMeals(userId, options = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        sortBy = 'created_at',
        sortDesc = true,
        dateFrom,
        dateTo
      } = options;

      let query = supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .order(sortBy, { ascending: !sortDesc })
        .range(offset, offset + limit - 1);

      // Add date filters if provided
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching meals:', error.message);
        return { meals: [], error: error.message };
      }
      
      return { meals: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error fetching meals:', error);
      return { meals: [], error: error.message };
    }
  }

  /**
   * Add a new meal
   * @param {Object} mealData - Meal data to add
   * @returns {Promise<Object>} Added meal or error
   */
  async addMeal(mealData) {
    try {
      if (!mealData.user_id) {
        return { meal: null, error: 'User ID is required' };
      }
      
      // Ensure nutritional values are numbers
      const meal = {
        ...mealData,
        calories: Number(mealData.calories) || 0,
        protein: Number(mealData.protein) || 0,
        carbs: Number(mealData.carbs) || 0,
        fats: Number(mealData.fats) || 0,
        consumed_at: mealData.consumed_at || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('meals')
        .insert([meal])
        .select();
      
      if (error) {
        console.error('Error adding meal:', error.message);
        return { meal: null, error: error.message };
      }
      
      return { meal: data[0] || null, error: null };
    } catch (error) {
      console.error('Unexpected error adding meal:', error);
      return { meal: null, error: error.message };
    }
  }

  /**
   * Update an existing meal
   * @param {string} mealId - ID of the meal to update
   * @param {Object} mealData - Updated meal data
   * @returns {Promise<Object>} Updated meal or error
   */
  async updateMeal(mealId, mealData) {
    try {
      // Convert nutritional values to numbers
      const updatedMeal = {
        ...mealData,
        calories: Number(mealData.calories) || 0,
        protein: Number(mealData.protein) || 0,
        carbs: Number(mealData.carbs) || 0,
        fats: Number(mealData.fats) || 0
      };
      
      // Remove fields that should not be updated
      delete updatedMeal.id;
      delete updatedMeal.user_id;
      delete updatedMeal.created_at;
      
      const { data, error } = await supabase
        .from('meals')
        .update(updatedMeal)
        .eq('id', mealId)
        .select();
      
      if (error) {
        console.error('Error updating meal:', error.message);
        return { meal: null, error: error.message };
      }
      
      return { meal: data[0] || null, error: null };
    } catch (error) {
      console.error('Unexpected error updating meal:', error);
      return { meal: null, error: error.message };
    }
  }

  /**
   * Delete a meal
   * @param {string} mealId - ID of the meal to delete
   * @returns {Promise<Object>} Success or error
   */
  async deleteMeal(mealId) {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);
      
      if (error) {
        console.error('Error deleting meal:', error.message);
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected error deleting meal:', error);
      return { error: error.message };
    }
  }

  /**
   * Get all water logs for a user
   * @param {string} userId - User ID
   * @param {Object} options - Options for filtering and sorting
   * @returns {Promise<Object>} List of water logs or error
   */
  async getWaterLogs(userId, options = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        sortBy = 'created_at',
        sortDesc = true,
        dateFrom,
        dateTo
      } = options;

      let query = supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', userId)
        .order(sortBy, { ascending: !sortDesc })
        .range(offset, offset + limit - 1);

      // Add date filters if provided
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching water logs:', error.message);
        return { logs: [], error: error.message };
      }
      
      return { logs: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error fetching water logs:', error);
      return { logs: [], error: error.message };
    }
  }

  /**
   * Add a new water log
   * @param {Object} logData - Water log data to add
   * @returns {Promise<Object>} Added water log or error
   */
  async addWaterLog(logData) {
    try {
      if (!logData.user_id) {
        return { log: null, error: 'User ID is required' };
      }
      
      // Ensure amount is a number
      const log = {
        ...logData,
        amount_ml: Number(logData.amount_ml) || 0,
        consumed_at: logData.consumed_at || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('water_logs')
        .insert([log])
        .select();
      
      if (error) {
        console.error('Error adding water log:', error.message);
        return { log: null, error: error.message };
      }
      
      return { log: data[0] || null, error: null };
    } catch (error) {
      console.error('Unexpected error adding water log:', error);
      return { log: null, error: error.message };
    }
  }

  /**
   * Get nutrition goals for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Nutrition goals or error
   */
  async getNutritionGoals(userId) {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "No rows returned" which is expected if no goals are set
        console.error('Error fetching nutrition goals:', error.message);
        return { goals: null, error: error.message };
      }
      
      return { goals: data || null, error: null };
    } catch (error) {
      console.error('Unexpected error fetching nutrition goals:', error);
      return { goals: null, error: error.message };
    }
  }

  /**
   * Update or create nutrition goals for a user
   * @param {Object} goalsData - Nutrition goals data
   * @returns {Promise<Object>} Updated goals or error
   */
  async updateNutritionGoals(goalsData) {
    try {
      if (!goalsData.user_id) {
        return { goals: null, error: 'User ID is required' };
      }
      
      // Ensure nutritional values are numbers
      const goals = {
        ...goalsData,
        calories: Number(goalsData.calories) || 0,
        protein: Number(goalsData.protein) || 0,
        carbs: Number(goalsData.carbs) || 0,
        fats: Number(goalsData.fats) || 0,
        water_ml: Number(goalsData.water_ml) || 0
      };
      
      const { data, error } = await supabase
        .from('nutrition_goals')
        .upsert(goals)
        .select();
      
      if (error) {
        console.error('Error updating nutrition goals:', error.message);
        return { goals: null, error: error.message };
      }
      
      return { goals: data[0] || null, error: null };
    } catch (error) {
      console.error('Unexpected error updating nutrition goals:', error);
      return { goals: null, error: error.message };
    }
  }

  /**
   * Get user preferences
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User preferences or error
   */
  async getUserPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user preferences:', error.message);
        return { preferences: null, error: error.message };
      }
      
      return { preferences: data || null, error: null };
    } catch (error) {
      console.error('Unexpected error fetching user preferences:', error);
      return { preferences: null, error: error.message };
    }
  }

  /**
   * Update user preferences
   * @param {Object} preferencesData - User preferences data
   * @returns {Promise<Object>} Updated preferences or error
   */
  async updateUserPreferences(preferencesData) {
    try {
      if (!preferencesData.user_id) {
        return { preferences: null, error: 'User ID is required' };
      }
      
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(preferencesData)
        .select();
      
      if (error) {
        console.error('Error updating user preferences:', error.message);
        return { preferences: null, error: error.message };
      }
      
      return { preferences: data[0] || null, error: null };
    } catch (error) {
      console.error('Unexpected error updating user preferences:', error);
      return { preferences: null, error: error.message };
    }
  }

  /**
   * Get daily nutrition summary
   * @param {string} userId - User ID
   * @param {string} date - Date to get summary for (YYYY-MM-DD)
   * @returns {Promise<Object>} Nutrition summary or error
   */
  async getDailyNutritionSummary(userId, date) {
    try {
      // Get meals for the specified date
      const startDate = `${date}T00:00:00.000Z`;
      const endDate = `${date}T23:59:59.999Z`;
      
      const [mealsResult, waterResult] = await Promise.all([
        this.getMeals(userId, { dateFrom: startDate, dateTo: endDate }),
        this.getWaterLogs(userId, { dateFrom: startDate, dateTo: endDate })
      ]);
      
      if (mealsResult.error) {
        return { summary: null, error: mealsResult.error };
      }
      
      if (waterResult.error) {
        return { summary: null, error: waterResult.error };
      }
      
      // Calculate totals
      const summary = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        waterMl: 0,
        meals: mealsResult.meals.length,
        date
      };
      
      mealsResult.meals.forEach(meal => {
        summary.calories += Number(meal.calories) || 0;
        summary.protein += Number(meal.protein) || 0;
        summary.carbs += Number(meal.carbs) || 0;
        summary.fats += Number(meal.fats) || 0;
      });
      
      waterResult.logs.forEach(log => {
        summary.waterMl += Number(log.amount_ml) || 0;
      });
      
      return { summary, error: null };
    } catch (error) {
      console.error('Unexpected error getting daily nutrition summary:', error);
      return { summary: null, error: error.message };
    }
  }
}

// Create and export a singleton instance
const nutritionService = new NutritionService();
export default nutritionService; 