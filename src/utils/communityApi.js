// Mock data store using localStorage for persistence
let commentsData = [
    {
        id: 'comment-1',
        title: 'Just completed my first 5K run!',
        content: 'After following the 8-week running program, I finally completed my first 5K run in under 30 minutes! The training plan really helped build my endurance gradually.',
        challenge: 'challenge-1',
        challengeName: 'Running Challenge',
        timestamp: '2023-03-01T14:35:00Z',
        author: 'Jane Smith',
        likes: 15
    },
    {
        id: 'comment-2',
        title: 'High-protein meal prep ideas?',
        content: 'I\'m looking for some new high-protein meal prep ideas that are vegetarian-friendly. Any suggestions from the community? My goal is to hit 100g of protein daily.',
        challenge: null,
        challengeName: null,
        timestamp: '2023-03-02T09:22:00Z',
        author: 'John Doe',
        likes: 8
    },
    {
        id: 'comment-3',
        title: 'Reached a new deadlift PR!',
        content: 'After months of consistent training, I finally hit a 225lb deadlift today! So happy with my progress. The strength program in the app has been amazing.',
        challenge: 'challenge-2',
        challengeName: 'Strength Challenge',
        timestamp: '2023-03-03T18:45:00Z',
        author: 'Michael Brown',
        likes: 22
    }
];

// Save comments to localStorage for persistence
const saveToLocalStorage = (data) => {
    try {
        localStorage.setItem('commentsData', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Load comments from localStorage if available
const loadFromLocalStorage = () => {
    try {
        const data = localStorage.getItem('commentsData');
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
        commentsData = localData;
    } else {
        saveToLocalStorage(commentsData);
    }
};

// Call initialize on module load
initializeData();

// API functions
export const getComments = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return a copy to prevent direct mutations
    return [...commentsData];
};

export const addComment = async (commentData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create new comment with generated ID and default values
    const newComment = {
        id: `comment-${Date.now()}`,
        title: commentData.title,
        content: commentData.content,
        challenge: commentData.challenge,
        challengeName: commentData.challengeName || null,
        timestamp: commentData.timestamp || new Date().toISOString(),
        author: 'Current User', // In a real app, this would come from auth
        likes: 0
    };
    
    // Update data store
    commentsData = [newComment, ...commentsData];
    
    // Persist to localStorage
    saveToLocalStorage(commentsData);
    
    return newComment;
};

export const likeComment = async (commentId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find and update the comment
    const updatedComments = commentsData.map(comment => 
        comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
    );
    
    // Update data store
    commentsData = updatedComments;
    
    // Persist to localStorage
    saveToLocalStorage(commentsData);
    
    return { success: true };
}; 