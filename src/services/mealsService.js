import supabaseService from './supabase.js';

class MealsService {
  async getMeals() {
    try {
      return await supabaseService.executeQuery(client => 
        client
          .from('meals')
          .select('*')
          .order('created_at', { ascending: false })
      );
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  }

  async addMeal(mealData) {
    try {
      return await supabaseService.executeQuery(client => 
        client
          .from('meals')
          .insert([mealData])
          .select()
          .single()
      );
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  }

  async updateMeal(id, mealData) {
    try {
      return await supabaseService.executeQuery(client => 
        client
          .from('meals')
          .update(mealData)
          .eq('id', id)
          .select()
          .single()
      );
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  }

  async deleteMeal(id) {
    try {
      await supabaseService.executeQuery(client => 
        client
          .from('meals')
          .delete()
          .eq('id', id)
      );
      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }

  // Test database connection
  async testConnection() {
    return await supabaseService.testConnection();
  }
}

const mealsService = new MealsService();
export default mealsService; 