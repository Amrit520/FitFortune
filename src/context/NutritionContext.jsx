import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import mealsService from '../services/mealsService.js';
import databaseService from '../services/databaseService.js';
import supabaseService from '../services/supabase.js';

const NutritionContext = createContext();

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};

export const NutritionProvider = ({ children }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [waterIntake, setWaterIntake] = useState([]);
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
    waterMl: 2500
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      const status = supabaseService.getConnectionStatus();
      setOfflineMode(status !== 'connected');
    };
    
    checkConnection();
    
    // Check connection status periodically
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load user data, meals, and nutrition goals
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load nutrition goals
        try {
          const userGoals = await supabaseService.executeQuery(
            async (client) => {
              return await client
                .from('nutrition_goals')
                .select('*')
                .eq('user_id', user.id)
                .single();
            },
            {
              fallback: databaseService.getFallbackData('nutrition_goals')
            }
          );
          
          if (userGoals) {
            setNutritionGoals(userGoals);
          }
        } catch (error) {
          console.error('Error loading nutrition goals:', error);
          // Use default goals
        }
        
        // Load meals
        await loadMeals();
        
        // Load water intake
        try {
          const waterData = await supabaseService.executeQuery(
            async (client) => {
              return await client
                .from('water_intake')
                .select('*')
                .eq('user_id', user.id)
                .order('consumed_at', { ascending: false });
            },
            {
              fallback: databaseService.getFallbackData('water_intake')
            }
          );
          
          if (waterData) {
            setWaterIntake(waterData);
          }
        } catch (error) {
          console.error('Error loading water intake:', error);
          // Use empty array
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Load meals
  const loadMeals = async () => {
    try {
      const data = await mealsService.getMeals();
      setMeals(data || []);
    } catch (error) {
      console.error('Error loading meals:', error);
      setError('Failed to load meals');
      // Use local storage if available
      const storedMeals = localStorage.getItem('meals');
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    }
  };

  // Add a meal
  const addMeal = async (mealData) => {
    try {
      setError(null);
      const newMeal = {
        ...mealData,
        user_id: user?.id,
        created_at: new Date().toISOString()
      };

      const savedMeal = await mealsService.addMeal(newMeal);
      setMeals(prev => [savedMeal, ...prev]);
      
      // Store in local storage
      const updatedMeals = [savedMeal, ...meals];
      localStorage.setItem('meals', JSON.stringify(updatedMeals));
      
      return savedMeal;
    } catch (error) {
      console.error('Error adding meal:', error);
      setError('Failed to add meal');
      
      // Store locally if offline
      if (offlineMode) {
        const tempMeal = {
          ...mealData,
          id: `temp-${Date.now()}`,
          user_id: user?.id,
          created_at: new Date().toISOString()
        };
        setMeals(prev => [tempMeal, ...prev]);
        
        // Store in local storage
        const updatedMeals = [tempMeal, ...meals];
        localStorage.setItem('meals', JSON.stringify(updatedMeals));
        
        return tempMeal;
      }
      
      throw error;
    }
  };

  // Update a meal
  const updateMeal = async (id, mealData) => {
    try {
      setError(null);
      const updatedMeal = await mealsService.updateMeal(id, mealData);
      setMeals(prev => prev.map(meal => 
        meal.id === id ? updatedMeal : meal
      ));
      
      // Update local storage
      const updatedMeals = meals.map(meal => meal.id === id ? updatedMeal : meal);
      localStorage.setItem('meals', JSON.stringify(updatedMeals));
      
      return updatedMeal;
    } catch (error) {
      console.error('Error updating meal:', error);
      setError('Failed to update meal');
      throw error;
    }
  };

  // Delete a meal
  const deleteMeal = async (id) => {
    try {
      setError(null);
      await mealsService.deleteMeal(id);
      setMeals(prev => prev.filter(meal => meal.id !== id));
      
      // Update local storage
      const updatedMeals = meals.filter(meal => meal.id !== id);
      localStorage.setItem('meals', JSON.stringify(updatedMeals));
      
      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      setError('Failed to delete meal');
      throw error;
    }
  };

  // Log water intake
  const logWaterIntake = async (amountMl) => {
    try {
      setError(null);
      const waterLog = {
        user_id: user?.id,
        amount_ml: Number(amountMl),
        consumed_at: new Date().toISOString()
      };
      
      const savedLog = await supabaseService.executeQuery(
        async (client) => {
          return await client
            .from('water_intake')
            .insert([waterLog])
            .select()
            .single();
        },
        {
          fallback: { ...waterLog, id: `temp-${Date.now()}` }
        }
      );
      
      setWaterIntake(prev => [savedLog, ...prev]);
      
      // Store in local storage
      const updatedWaterIntake = [savedLog, ...waterIntake];
      localStorage.setItem('waterIntake', JSON.stringify(updatedWaterIntake));
      
      return savedLog;
    } catch (error) {
      console.error('Error logging water intake:', error);
      setError('Failed to log water intake');
      
      // Store locally if offline
      if (offlineMode) {
        const tempLog = {
          id: `temp-${Date.now()}`,
          user_id: user?.id,
          amount_ml: Number(amountMl),
          consumed_at: new Date().toISOString()
        };
        setWaterIntake(prev => [tempLog, ...prev]);
        
        // Store in local storage
        const updatedWaterIntake = [tempLog, ...waterIntake];
        localStorage.setItem('waterIntake', JSON.stringify(updatedWaterIntake));
        
        return tempLog;
      }
      
      throw error;
    }
  };

  // Update nutrition goals
  const updateNutritionGoals = async (goals) => {
    try {
      setError(null);
      const updatedGoals = {
        ...nutritionGoals,
        ...goals,
        user_id: user?.id,
        updated_at: new Date().toISOString()
      };
      
      const savedGoals = await supabaseService.executeQuery(
        async (client) => {
          return await client
            .from('nutrition_goals')
            .upsert(updatedGoals)
            .select()
            .single();
        },
        {
          fallback: updatedGoals
        }
      );
      
      setNutritionGoals(savedGoals);
      
      // Store in local storage
      localStorage.setItem('nutritionGoals', JSON.stringify(savedGoals));
      
      return savedGoals;
    } catch (error) {
      console.error('Error updating nutrition goals:', error);
      setError('Failed to update nutrition goals');
      
      // Update locally
      setNutritionGoals(prev => ({
        ...prev,
        ...goals
      }));
      
      // Store in local storage
      localStorage.setItem('nutritionGoals', JSON.stringify({
        ...nutritionGoals,
        ...goals
      }));
      
      throw error;
    }
  };

  // Calculate daily nutrition summary
  const getDailyNutritionSummary = (date = new Date()) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      // Filter meals for the specified date
      const todayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.created_at);
        return mealDate.toISOString().split('T')[0] === dateStr;
      });
      
      // Filter water intake for the specified date
      const todayWater = waterIntake.filter(log => {
        const logDate = new Date(log.consumed_at);
        return logDate.toISOString().split('T')[0] === dateStr;
      });
      
      // Calculate water intake
      const totalWaterMl = todayWater.reduce((sum, log) => sum + (Number(log.amount_ml) || 0), 0);
      
      // Calculate totals
      return todayMeals.reduce((summary, meal) => ({
        calories: summary.calories + (Number(meal.calories) || 0),
        protein: summary.protein + (Number(meal.protein) || 0),
        carbs: summary.carbs + (Number(meal.carbs) || 0),
        fats: summary.fats + (Number(meal.fats) || 0),
        waterMl: totalWaterMl,
        date: dateStr
      }), {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        waterMl: totalWaterMl,
        date: dateStr
      });
    } catch (error) {
      console.error('Error calculating nutrition summary:', error);
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        waterMl: 0,
        date: date.toISOString().split('T')[0]
      };
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    meals,
    waterIntake,
    nutritionGoals,
    loading,
    error,
    offlineMode,
    addMeal,
    updateMeal,
    deleteMeal,
    logWaterIntake,
    updateNutritionGoals,
    getDailyNutritionSummary,
    clearError,
    refreshMeals: loadMeals
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};

export default NutritionContext; 