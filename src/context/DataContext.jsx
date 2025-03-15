import { createContext, useState, useContext, useEffect } from 'react';
import recipes from '../data/recipes.json';
import exercises from '../data/exercises.json';
import workoutPlans from '../data/workoutPlans.json';
import foods from '../data/foods.json';
import challenges from '../data/challenges.json';
import achievements from '../data/achievements.json';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    
    // Initialize with direct data instead of empty arrays
    const [recipesData, setRecipesData] = useState(recipes);
    const [exercisesData, setExercisesData] = useState(exercises);
    const [workoutPlansData, setWorkoutPlansData] = useState(workoutPlans);
    const [foodsData, setFoodsData] = useState(foods);
    const [challengesData, setChallengesData] = useState(challenges);
    const [achievementsData, setAchievementsData] = useState(achievements);

    // User progress and achievements
    const [userProgress, setUserProgress] = useState({
        completedWorkouts: [],
        completedChallenges: [],
        earnedAchievements: [],
        nutritionLogs: [],
        points: 0
    });

    // Remove the simulated loading delay
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // Filtering functions
    const filterRecipes = (filters) => {
        return recipesData.filter(recipe => {
            if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;
            if (filters.dietary && !recipe.dietaryInfo?.includes(filters.dietary)) return false;
            return true;
        });
    };

    const filterExercises = (filters) => {
        return exercisesData.filter(exercise => {
            if (filters.category && exercise.category !== filters.category) return false;
            if (filters.difficulty && exercise.difficulty !== filters.difficulty) return false;
            if (filters.equipment && !exercise.equipment?.includes(filters.equipment)) return false;
            return true;
        });
    };

    // Search functions
    const searchRecipes = (query) => {
        const searchTerm = query.toLowerCase();
        return recipesData.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.description?.toLowerCase().includes(searchTerm) ||
            recipe.ingredients?.some(ing => ing.toLowerCase().includes(searchTerm))
        );
    };

    const searchExercises = (query) => {
        const searchTerm = query.toLowerCase();
        return exercisesData.filter(exercise => 
            exercise.name.toLowerCase().includes(searchTerm) ||
            exercise.description?.toLowerCase().includes(searchTerm) ||
            exercise.muscleGroups?.some(muscle => muscle.toLowerCase().includes(searchTerm))
        );
    };

    // Progress tracking functions
    const logWorkoutCompletion = (workoutId) => {
        setUserProgress(prev => ({
            ...prev,
            completedWorkouts: [...prev.completedWorkouts, {
                workoutId,
                completedAt: new Date().toISOString()
            }]
        }));
    };

    const logNutrition = (nutritionData) => {
        setUserProgress(prev => ({
            ...prev,
            nutritionLogs: [...prev.nutritionLogs, {
                ...nutritionData,
                loggedAt: new Date().toISOString()
            }]
        }));
    };

    // Achievement functions
    const checkAndAwardAchievements = () => {
        // Implementation for checking and awarding achievements based on user progress
    };

    const value = {
        isLoading,
        recipes: recipesData,
        exercises: exercisesData,
        workoutPlans: workoutPlansData,
        foods: foodsData,
        challenges: challengesData,
        achievements: achievementsData,
        userProgress,
        filterRecipes,
        filterExercises,
        searchRecipes,
        searchExercises,
        logWorkoutCompletion,
        logNutrition,
        checkAndAwardAchievements
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}; 