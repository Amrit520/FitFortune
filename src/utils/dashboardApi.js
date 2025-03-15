// Mock data store, in a real app this would be replaced with actual API calls
let userDashboardData = {
    completedWorkouts: [
        {
            id: 'workout-1',
            name: 'Morning Cardio',
            completedAt: '2023-03-01T08:30:00Z',
            duration: 45,
            calories: 320
        },
        {
            id: 'workout-2',
            name: 'Upper Body Strength',
            completedAt: '2023-03-02T17:15:00Z',
            duration: 60,
            calories: 450
        },
        {
            id: 'workout-3',
            name: 'Yoga Flow',
            completedAt: '2023-03-04T07:00:00Z',
            duration: 30,
            calories: 180
        }
    ],
    nutritionLogs: [
        {
            id: 'meal-1',
            mealType: 'Breakfast',
            loggedAt: '2023-03-01T07:30:00Z',
            calories: 420,
            protein: 25,
            carbs: 45,
            fats: 15
        },
        {
            id: 'meal-2',
            mealType: 'Lunch',
            loggedAt: '2023-03-01T12:30:00Z',
            calories: 650,
            protein: 40,
            carbs: 60,
            fats: 22
        },
        {
            id: 'meal-3',
            mealType: 'Dinner',
            loggedAt: '2023-03-01T19:00:00Z',
            calories: 580,
            protein: 35,
            carbs: 50,
            fats: 20
        },
        {
            id: 'meal-4',
            mealType: 'Breakfast',
            loggedAt: '2023-03-02T08:00:00Z',
            calories: 400,
            protein: 22,
            carbs: 40,
            fats: 18
        }
    ],
    achievements: [
        {
            id: 'achievement-1',
            name: 'Early Bird',
            description: 'Complete 5 workouts before 8 AM',
            unlockedAt: '2023-02-28T12:00:00Z',
            icon: '🌅'
        },
        {
            id: 'achievement-2',
            name: 'Protein Power',
            description: 'Log 100g of protein for 7 consecutive days',
            unlockedAt: '2023-03-01T20:00:00Z',
            icon: '🥩'
        }
    ],
    totalAchievements: 10,
    activityFeed: [
        {
            type: 'workout',
            description: 'Completed a Yoga Flow workout',
            timestamp: '2023-03-04T07:30:00Z'
        },
        {
            type: 'nutrition',
            description: 'Logged breakfast - Protein oatmeal',
            timestamp: '2023-03-04T08:15:00Z'
        },
        {
            type: 'achievement',
            description: 'Unlocked the "Protein Power" achievement',
            timestamp: '2023-03-01T20:00:00Z'
        },
        {
            type: 'nutrition',
            description: 'Logged lunch - Grilled chicken salad',
            timestamp: '2023-03-03T13:00:00Z'
        },
        {
            type: 'workout',
            description: 'Completed an Upper Body Strength workout',
            timestamp: '2023-03-02T18:15:00Z'
        }
    ],
    workoutStats: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        durations: [45, 60, 0, 30, 0, 0, 0],
        calories: [320, 450, 0, 180, 0, 0, 0]
    },
    nutritionStats: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        calories: [1650, 1550, 1700, 1600, 1500, 1400, 1600],
        protein: [100, 95, 105, 90, 85, 80, 95],
        carbs: [155, 145, 160, 150, 140, 130, 150],
        fats: [57, 55, 60, 58, 52, 50, 55]
    }
};

// Save user data to localStorage for persistence
const saveToLocalStorage = (data) => {
    try {
        localStorage.setItem('dashboardData', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Load user data from localStorage if available
const loadFromLocalStorage = () => {
    try {
        const data = localStorage.getItem('dashboardData');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
};

// Initialize data from localStorage or use default mock data
const initializeData = () => {
    const localData = loadFromLocalStorage();
    if (localData) {
        userDashboardData = localData;
    } else {
        saveToLocalStorage(userDashboardData);
    }
};

// Call initialize on module load
initializeData();

// API functions
export const getUserData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return a copy to prevent direct mutations
    return { ...userDashboardData };
};

export const saveUserData = async (data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update local store
    userDashboardData = { ...data };
    
    // Persist to localStorage
    saveToLocalStorage(userDashboardData);
    
    return { success: true };
};

export const logWorkoutCompletion = async (workoutData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newWorkout = {
        id: `workout-${Date.now()}`,
        completedAt: new Date().toISOString(),
        ...workoutData
    };
    
    // Update local store
    userDashboardData.completedWorkouts.unshift(newWorkout);
    
    // Add to activity feed
    const activity = {
        type: 'workout',
        description: `Completed a ${workoutData.name} workout`,
        timestamp: new Date().toISOString()
    };
    
    userDashboardData.activityFeed.unshift(activity);
    
    // Update workout stats
    // This would require more complex logic in a real app
    
    // Persist to localStorage
    saveToLocalStorage(userDashboardData);
    
    return { success: true, workout: newWorkout };
};

export const logNutrition = async (nutritionData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMeal = {
        id: `meal-${Date.now()}`,
        loggedAt: new Date().toISOString(),
        ...nutritionData
    };
    
    // Update local store
    userDashboardData.nutritionLogs.unshift(newMeal);
    
    // Add to activity feed
    const activity = {
        type: 'nutrition',
        description: `Logged ${nutritionData.mealType?.toLowerCase() || 'meal'}`,
        timestamp: new Date().toISOString()
    };
    
    userDashboardData.activityFeed.unshift(activity);
    
    // Persist to localStorage
    saveToLocalStorage(userDashboardData);
    
    return { success: true, meal: newMeal };
}; 