import React from 'react';

const ActivityFeed = ({ activities = [] }) => {
    // Define icons for different activity types
    const getActivityIcon = (type) => {
        switch (type) {
            case 'workout':
                return '💪';
            case 'nutrition':
                return '🍎';
            case 'achievement':
                return '🏆';
            case 'challenge':
                return '🎯';
            default:
                return '📋';
        }
    };

    // Format the timestamp to a readable format
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        
        // If today, show time
        if (date.toDateString() === now.toDateString()) {
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // If yesterday, show "Yesterday"
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // Otherwise show date
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No recent activity</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div 
                    key={index} 
                    className="flex p-3 border-l-4 border-green-500 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors"
                >
                    <div className="mr-3 text-xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                        <p className="text-gray-800">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                </div>
            ))}
            
            {activities.length > 0 && (
                <div className="text-center pt-2">
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        View all activity →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityFeed; 