import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { getComments, addComment, likeComment } from '../utils/communityApi'
import Badge from '../components/common/Badge'

const Community = () => {
    const { challenges } = useData()
    const [activeTab, setActiveTab] = useState('discussions')
    const [discussions, setDiscussions] = useState([])
    const [loading, setLoading] = useState(true)
    const [newPost, setNewPost] = useState({ title: '', content: '' })
    const [selectedChallenge, setSelectedChallenge] = useState(null)

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true)
            try {
                const comments = await getComments()
                setDiscussions(comments)
            } catch (error) {
                console.error('Failed to fetch comments:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchComments()
    }, [])

    const handlePostSubmit = async (e) => {
        e.preventDefault()
        
        if (!newPost.title.trim() || !newPost.content.trim()) {
            return
        }
        
        try {
            const post = {
                title: newPost.title,
                content: newPost.content,
                challenge: selectedChallenge,
                timestamp: new Date().toISOString()
            }
            
            const addedPost = await addComment(post)
            
            setDiscussions([addedPost, ...discussions])
            setNewPost({ title: '', content: '' })
            setSelectedChallenge(null)
        } catch (error) {
            console.error('Failed to add post:', error)
        }
    }

    const handleLike = async (id) => {
        try {
            await likeComment(id)
            
            setDiscussions(discussions.map(discussion => 
                discussion.id === id 
                    ? { ...discussion, likes: discussion.likes + 1 } 
                    : discussion
            ))
        } catch (error) {
            console.error('Failed to like post:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Community</h1>

            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-4 mb-8">
                {['discussions', 'challenges', 'leaderboard'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                            activeTab === tab
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Discussions Tab */}
            {activeTab === 'discussions' && (
                <div className="max-w-4xl mx-auto">
                    {/* New Post Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
                        <form onSubmit={handlePostSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter a title for your post"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Content</label>
                                <textarea
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                                    placeholder="What's on your mind?"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Related Challenge (Optional)</label>
                                <select
                                    value={selectedChallenge || ''}
                                    onChange={(e) => setSelectedChallenge(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select a challenge</option>
                                    {challenges.map(challenge => (
                                        <option key={challenge.id} value={challenge.id}>
                                            {challenge.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Post
                            </button>
                        </form>
                    </div>

                    {/* Discussion Posts */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="loader mx-auto"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {discussions.length > 0 ? (
                                discussions.map(discussion => (
                                    <div key={discussion.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-semibold">{discussion.title}</h3>
                                            {discussion.challenge && (
                                                <Badge 
                                                    label={discussion.challengeName || 'Challenge'} 
                                                    variant="success" 
                                                />
                                            )}
                                        </div>
                                        <p className="text-gray-700 mt-3">{discussion.content}</p>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                            <div className="text-sm text-gray-500">
                                                {new Date(discussion.timestamp).toLocaleString()}
                                            </div>
                                            <button 
                                                onClick={() => handleLike(discussion.id)}
                                                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                                <span>{discussion.likes}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                    <p className="text-gray-500">No discussions yet. Be the first to post!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {challenges.map(challenge => (
                            <div key={challenge.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:transform hover:scale-[1.02]">
                                <h3 className="text-xl font-bold text-gray-800">{challenge.name}</h3>
                                <p className="text-gray-600 mt-2">{challenge.description}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge label={challenge.difficulty} variant={challenge.difficulty} />
                                    <Badge label={`${challenge.duration} days`} className="hover:bg-gray-200 transition-colors" />
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-700">Daily Tasks:</h4>
                                    <ul className="list-disc list-inside mt-2">
                                        {challenge.dailyTasks?.slice(0, 3).map(task => (
                                            <li key={task.day} className="text-sm p-1 hover:bg-gray-50 rounded">
                                                Day {task.day}: <span className="text-gray-700">{task.task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                                    Join Challenge
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievements</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                    { id: 1, name: 'Jane Smith', points: 1250, achievements: 8 },
                                    { id: 2, name: 'John Doe', points: 980, achievements: 6 },
                                    { id: 3, name: 'Emily Johnson', points: 840, achievements: 5 },
                                    { id: 4, name: 'Michael Brown', points: 720, achievements: 4 },
                                    { id: 5, name: 'Sarah Davis', points: 650, achievements: 3 }
                                ].map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className={`flex items-center justify-center h-8 w-8 rounded-full ${
                                                    index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                                    index === 1 ? 'bg-gray-100 text-gray-800' : 
                                                    index === 2 ? 'bg-yellow-700 text-yellow-100' : 
                                                    'bg-gray-50 text-gray-600'
                                                }`}>
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.points}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-900">{user.achievements}</span>
                                                <span className="ml-2 text-yellow-500">🏆</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Community 