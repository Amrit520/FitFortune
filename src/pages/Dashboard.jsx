import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import WorkoutChart from '../components/dashboard/WorkoutChart';
import NutritionChart from '../components/dashboard/NutritionChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ProgressTimeline from '../components/dashboard/ProgressTimeline';
import { getUserData, saveUserData } from '../utils/dashboardApi';

const Dashboard = () => {
    const { userProgress } = useData();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const data = await getUserData();
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const logActivity = async (activity) => {
        try {
            const newActivity = {
                type: activity.type,
                description: activity.description,
                timestamp: new Date().toISOString()
            };

            // Update local state
            setDashboardData(prev => ({
                ...prev,
                activityFeed: [newActivity, ...(prev.activityFeed || [])]
            }));

            // Save to backend
            await saveUserData({
                ...dashboardData,
                activityFeed: [newActivity, ...(dashboardData.activityFeed || [])]
            });
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Dashboard</h1>

            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-4 mb-8 flex-wrap">
                {['overview', 'workouts', 'nutrition', 'timeline', 'achievements'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-lg transition-all duration-300 mb-2 ${
                            activeTab === tab
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
                        <div className="space-y-4">
                            <div>
                                <ProgressBar 
                                    value={dashboardData.completedWorkouts.length} 
                                    max={10} 
                                    label="Workouts Completed" 
                                />
                            </div>
                            <div>
                                <ProgressBar 
                                    value={dashboardData.nutritionLogs.length} 
                                    max={10} 
                                    label="Nutrition Logs" 
                                    color="blue" 
                                />
                            </div>
                            <div>
                                <ProgressBar 
                                    value={dashboardData.achievements.length} 
                                    max={dashboardData.totalAchievements} 
                                    label="Achievements" 
                                    color="purple" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
                        <ActivityFeed 
                            activities={dashboardData.activityFeed.slice(0, 5)} 
                        />
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4">This Week's Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <WorkoutChart data={dashboardData.workoutStats} />
                            <NutritionChart data={dashboardData.nutritionStats} />
                        </div>
                    </div>
                </div>
            )}

            {/* Workouts Tab */}
            {activeTab === 'workouts' && (
                <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Your Workout History</h2>
                    <WorkoutChart data={dashboardData.workoutStats} height={300} />
                    
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-3">Recent Workouts</h3>
                        <ul className="space-y-3">
                            {dashboardData.completedWorkouts.slice(0, 5).map((workout, idx) => (
                                <li key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold">{workout.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {new Date(workout.completedAt).toLocaleDateString()} • 
                                                {workout.duration} minutes
                                            </p>
                                        </div>
                                        <Badge label={`${workout.calories} cal`} variant="success" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
                <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Your Nutrition History</h2>
                    <NutritionChart data={dashboardData.nutritionStats} height={300} />
                    
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-3">Recent Nutrition Logs</h3>
                        <ul className="space-y-3">
                            {dashboardData.nutritionLogs.slice(0, 5).map((log, idx) => (
                                <li key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold">{log.mealType || 'Meal'}</h4>
                                            <p className="text-sm text-gray-600">
                                                {new Date(log.loggedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Badge label={`${log.calories} cal`} variant="default" />
                                            <Badge label={`${log.protein}g protein`} variant="info" />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Your Progress Timeline</h2>
                    <ProgressTimeline />
                </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
                        <ProgressBar 
                            value={dashboardData.achievements.length} 
                            max={dashboardData.totalAchievements} 
                            label={`${dashboardData.achievements.length}/${dashboardData.totalAchievements} Unlocked`} 
                            color="purple" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dashboardData.achievements.map((achievement, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <span className="text-2xl">{achievement.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{achievement.name}</h3>
                                        <p className="text-sm text-gray-600">Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">{achievement.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard; 