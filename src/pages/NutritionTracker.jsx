import { useState, useEffect } from 'react';
import { useNutrition } from '../context/NutritionContext';
import MealLogger from '../components/nutrition/MealLogger';
import WaterTracker from '../components/nutrition/WaterTracker';
import NutritionChatbot from '../components/nutrition/NutritionChatbot';
import Chart from 'chart.js/auto';
import { useRef } from 'react';

const NutritionTracker = () => {
    const { nutritionGoals, getDailyNutritionSummary } = useNutrition();
    const [activeTab, setActiveTab] = useState('diary');
    const [nutritionSummary, setNutritionSummary] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        waterMl: 0
    });
    
    const calorieChartRef = useRef(null);
    const macroChartRef = useRef(null);
    const calorieChartInstance = useRef(null);
    const macroChartInstance = useRef(null);

    // Get today's nutrition summary
    useEffect(() => {
        const summary = getDailyNutritionSummary();
        setNutritionSummary(summary);
    }, [getDailyNutritionSummary]);

    // Initialize and update charts
    useEffect(() => {
        // Clean up existing charts
        if (calorieChartInstance.current) {
            calorieChartInstance.current.destroy();
        }
        
        if (macroChartInstance.current) {
            macroChartInstance.current.destroy();
        }
        
        // Calorie Chart
        if (calorieChartRef.current) {
            const ctx = calorieChartRef.current.getContext('2d');
            
            calorieChartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Consumed', 'Remaining'],
                    datasets: [{
                        data: [
                            nutritionSummary.calories,
                            Math.max(0, nutritionGoals.calories - nutritionSummary.calories)
                        ],
                        backgroundColor: ['#22c55e', '#e5e7eb'],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '75%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value} calories`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Macros Chart
        if (macroChartRef.current) {
            const ctx = macroChartRef.current.getContext('2d');
            
            macroChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Protein', 'Carbs', 'Fats'],
                    datasets: [{
                        label: 'Consumed',
                        data: [
                            nutritionSummary.protein,
                            nutritionSummary.carbs,
                            nutritionSummary.fats
                        ],
                        backgroundColor: ['#3b82f6', '#f97316', '#eab308']
                    }, {
                        label: 'Goal',
                        data: [
                            nutritionGoals.protein,
                            nutritionGoals.carbs,
                            nutritionGoals.fats
                        ],
                        backgroundColor: ['rgba(59, 130, 246, 0.3)', 'rgba(249, 115, 22, 0.3)', 'rgba(234, 179, 8, 0.3)']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Grams'
                            }
                        }
                    }
                }
            });
        }
        
        // Cleanup on component unmount
        return () => {
            if (calorieChartInstance.current) {
                calorieChartInstance.current.destroy();
            }
            
            if (macroChartInstance.current) {
                macroChartInstance.current.destroy();
            }
        };
    }, [nutritionSummary, nutritionGoals]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Nutrition Tracker</h1>
            
            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button 
                    onClick={() => setActiveTab('diary')}
                    className={`py-2 px-4 font-medium ${
                        activeTab === 'diary' 
                        ? 'text-green-500 border-b-2 border-green-500' 
                        : 'text-gray-500 hover:text-green-500'
                    }`}
                >
                    Food Diary
                </button>
                <button 
                    onClick={() => setActiveTab('water')}
                    className={`py-2 px-4 font-medium ${
                        activeTab === 'water' 
                        ? 'text-green-500 border-b-2 border-green-500' 
                        : 'text-gray-500 hover:text-green-500'
                    }`}
                >
                    Water Tracker
                </button>
                <button 
                    onClick={() => setActiveTab('analysis')}
                    className={`py-2 px-4 font-medium ${
                        activeTab === 'analysis' 
                        ? 'text-green-500 border-b-2 border-green-500' 
                        : 'text-gray-500 hover:text-green-500'
                    }`}
                >
                    Analysis
                </button>
                <button 
                    onClick={() => setActiveTab('aibot')}
                    className={`py-2 px-4 font-medium ${
                        activeTab === 'aibot' 
                        ? 'text-green-500 border-b-2 border-green-500' 
                        : 'text-gray-500 hover:text-green-500'
                    }`}
                >
                    AI Assistant
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Always visible */}
                <div className="lg:col-span-2">
                    {/* Daily Nutrition Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Today's Nutrition</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <h3 className="text-sm font-medium text-gray-500">Calories</h3>
                                <p className="text-2xl font-bold text-green-600">{nutritionSummary.calories}</p>
                                <p className="text-xs text-gray-500">of {nutritionGoals.calories}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <h3 className="text-sm font-medium text-gray-500">Protein</h3>
                                <p className="text-2xl font-bold text-blue-600">{nutritionSummary.protein}g</p>
                                <p className="text-xs text-gray-500">of {nutritionGoals.protein}g</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                                <h3 className="text-sm font-medium text-gray-500">Carbs</h3>
                                <p className="text-2xl font-bold text-orange-600">{nutritionSummary.carbs}g</p>
                                <p className="text-xs text-gray-500">of {nutritionGoals.carbs}g</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                <h3 className="text-sm font-medium text-gray-500">Fats</h3>
                                <p className="text-2xl font-bold text-yellow-600">{nutritionSummary.fats}g</p>
                                <p className="text-xs text-gray-500">of {nutritionGoals.fats}g</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tab Content */}
                    {activeTab === 'diary' && (
                        <MealLogger />
                    )}
                    
                    {activeTab === 'water' && (
                        <WaterTracker />
                    )}
                    
                    {activeTab === 'analysis' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Nutrition Analysis</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Calories Chart */}
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Calorie Goal Progress</h3>
                                    <div className="relative h-64">
                                        <canvas ref={calorieChartRef}></canvas>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-3xl font-bold text-gray-800">
                                                {nutritionSummary.calories}
                                            </span>
                                            <span className="text-sm text-gray-500">of {nutritionGoals.calories}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Macros Chart */}
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Macronutrients</h3>
                                    <div className="h-64">
                                        <canvas ref={macroChartRef}></canvas>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Nutritional Insights */}
                            <div className="mt-6 border-t pt-4">
                                <h3 className="font-medium text-gray-700 mb-2">Insights</h3>
                                <ul className="space-y-2 text-sm">
                                    {nutritionSummary.protein < nutritionGoals.protein * 0.8 && (
                                        <li className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            Your protein intake is below target. Consider adding more lean protein sources to your meals.
                                        </li>
                                    )}
                                    
                                    {nutritionSummary.calories < nutritionGoals.calories * 0.5 && (
                                        <li className="flex items-start">
                                            <span className="text-red-500 mr-2">•</span>
                                            You've consumed less than half your daily calorie goal. Make sure you're eating enough to fuel your body.
                                        </li>
                                    )}
                                    
                                    {nutritionSummary.calories > nutritionGoals.calories && (
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            You've exceeded your calorie goal for today. Consider balancing with more activity.
                                        </li>
                                    )}
                                    
                                    {nutritionSummary.waterMl < nutritionGoals.waterMl * 0.7 && (
                                        <li className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            Your water intake is below target. Staying hydrated is crucial for overall health.
                                        </li>
                                    )}
                                    
                                    {(nutritionSummary.calories === 0 && nutritionSummary.protein === 0) && (
                                        <li className="flex items-start">
                                            <span className="text-gray-500 mr-2">•</span>
                                            No meals logged yet today. Use the Food Diary tab to log your meals.
                                        </li>
                                    )}
                                </ul>
                            </div>
                            
                            {/* Weekly Trends Section */}
                            <div className="mt-6 border-t pt-4">
                                <h3 className="font-medium text-gray-700 mb-3">Weekly Trends</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-600">This Week's Calorie Intake</span>
                                        <span className="text-xs text-gray-500">Goal: {nutritionGoals.calories} cal/day</span>
                                    </div>
                                    
                                    {/* Weekly Calorie Visualization */}
                                    <div className="grid grid-cols-7 gap-2 mb-3">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                                            // Generate some sample data for demonstration
                                            // In a real app, this would come from actual meal data
                                            const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
                                            const dayIndex = index === 6 ? 0 : index + 1; // Convert to 0-based with Sunday as 0
                                            
                                            // Only show data for past days and today
                                            const isPastDay = dayIndex < today || (dayIndex === today);
                                            const isFutureDay = !isPastDay;
                                            const isToday = dayIndex === today;
                                            
                                            // Sample calorie data - would be replaced with real data in production
                                            // Get a random value between 70-110% of goal for past days
                                            let calories = 0;
                                            if (isPastDay && !isToday) {
                                                calories = Math.round(nutritionGoals.calories * (0.7 + Math.random() * 0.4));
                                            } else if (isToday) {
                                                calories = nutritionSummary.calories;
                                            }
                                            
                                            // Calculate height percentage based on calorie target (max 100%)
                                            const heightPercent = Math.min(100, Math.round((calories / nutritionGoals.calories) * 100));
                                            
                                            return (
                                                <div key={day} className="flex flex-col items-center">
                                                    <div className="relative w-full h-24 bg-gray-200 rounded flex items-end">
                                                        <div 
                                                            className={`w-full rounded-t ${
                                                                calories > nutritionGoals.calories * 1.05 ? 'bg-red-400' :
                                                                calories >= nutritionGoals.calories * 0.85 ? 'bg-green-400' :
                                                                calories > 0 ? 'bg-yellow-400' : 'bg-gray-300'
                                                            }`} 
                                                            style={{ 
                                                                height: `${heightPercent}%`,
                                                                opacity: isFutureDay ? 0.3 : 1 
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs font-medium mt-1">{day}</div>
                                                    {isPastDay && calories > 0 ? (
                                                        <div className="text-xs text-gray-600">{calories}</div>
                                                    ) : (
                                                        <div className="text-xs text-gray-400">-</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Weekly Summary */}
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Summary</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-xs text-gray-500">Consistency Score</div>
                                                <div className="text-lg font-semibold text-gray-800">
                                                    {nutritionSummary.calories > 0 ? '85%' : '0%'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {nutritionSummary.calories > 0 ? 
                                                        'Good consistency in hitting your goals!' : 
                                                        'Start logging meals to track consistency'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Weekly Average</div>
                                                <div className="text-lg font-semibold text-gray-800">
                                                    {nutritionSummary.calories > 0 ? 
                                                        `${Math.round(nutritionGoals.calories * 0.92)} cal` : 
                                                        '0 cal'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {nutritionSummary.calories > 0 ? 
                                                        `${Math.round(92)}% of your daily goal` : 
                                                        'No data available yet'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'aibot' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">AI Nutrition Assistant</h2>
                            <p className="text-gray-600 mb-4">
                                Chat with our AI assistant to get personalized nutrition advice, meal suggestions, 
                                and help with tracking your meals. You can ask questions about nutrition, log your meals, 
                                or get recommendations based on your goals.
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Try asking:</h3>
                                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                    <li>What foods are high in protein?</li>
                                    <li>I had a chicken salad for lunch</li>
                                    <li>Suggest a healthy breakfast</li>
                                    <li>How many calories should I eat?</li>
                                </ul>
                            </div>
                            <div className="border border-gray-200 rounded-lg h-96">
                                {/* Embedded chatbot interface for the tab view */}
                                <iframe 
                                    src="/nutrition-chat" 
                                    title="Nutrition Chatbot"
                                    className="w-full h-full border-none"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Right Column - Always visible for desktop */}
                <div className="lg:col-span-1">
                    <WaterTracker />
                </div>
            </div>
            
            {/* Floating chatbot button */}
            <NutritionChatbot />
        </div>
    );
};

export default NutritionTracker; 