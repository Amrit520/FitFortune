import React, { useState, useEffect } from 'react';
import { getUserData } from '../../utils/dashboardApi';

const ProgressTimeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await getUserData();
        
        // Combine workout, nutrition, and achievement data
        const combinedData = [
          ...userData.completedWorkouts.map(workout => ({
            ...workout,
            type: 'workout',
            date: new Date(workout.completedAt),
            title: `Completed ${workout.name}`,
            icon: '💪'
          })),
          ...userData.nutritionLogs.map(log => ({
            ...log,
            type: 'nutrition',
            date: new Date(log.timestamp),
            title: `Logged ${log.name}`,
            icon: '🍎'
          })),
          ...userData.achievements.filter(a => a.achieved).map(achievement => ({
            ...achievement,
            type: 'achievement',
            date: new Date(achievement.dateAchieved),
            title: `Earned ${achievement.name}`,
            icon: '🏆'
          }))
        ];
        
        // Sort by date (newest first)
        const sortedData = combinedData.sort((a, b) => b.date - a.date);
        setTimelineData(sortedData);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getTimelineItemClass = (type) => {
    switch(type) {
      case 'workout':
        return 'border-blue-500 bg-blue-50';
      case 'nutrition':
        return 'border-green-500 bg-green-50';
      case 'achievement':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };
  
  const loadMore = () => {
    setDisplayCount(prev => prev + 5);
  };
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Your Progress Timeline</h3>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Your Progress Timeline</h3>
      
      {timelineData.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No progress data available yet. Start logging workouts and meals to see your timeline!
        </div>
      ) : (
        <>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
            
            {/* Timeline items */}
            <div className="space-y-4">
              {timelineData.slice(0, displayCount).map((item, index) => (
                <div key={index} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-2 w-5 h-5 rounded-full bg-white border-2 border-gray-300 z-10 transform -translate-x-1/2 flex items-center justify-center">
                    <span className="text-xs">{item.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className={`p-3 rounded-lg border-l-4 ${getTimelineItemClass(item.type)} transition-all duration-300 hover:shadow-md`}>
                    <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
                    <div className="font-medium">{item.title}</div>
                    
                    {item.type === 'workout' && (
                      <div className="text-sm mt-1">
                        Duration: {item.duration} min | Calories: {item.calories} kcal
                      </div>
                    )}
                    
                    {item.type === 'nutrition' && (
                      <div className="text-sm mt-1">
                        Calories: {item.calories} kcal | Protein: {item.protein}g
                      </div>
                    )}
                    
                    {item.type === 'achievement' && (
                      <div className="text-sm mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {timelineData.length > displayCount && (
            <div className="text-center mt-4">
              <button 
                className="text-blue-500 hover:text-blue-700 font-medium text-sm clickable-element"
                onClick={loadMore}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressTimeline; 