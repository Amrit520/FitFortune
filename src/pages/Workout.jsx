import { useData } from '../context/DataContext';
import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import Badge from '../components/common/Badge';

const Workout = () => {
    const {
        exercises,
        workoutPlans,
        challenges,
        achievements,
        searchExercises,
    } = useData();

    const [activeTab, setActiveTab] = useState('workoutPlans');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        if (activeTab === 'exercises') {
            setSearchResults(searchExercises(query));
        }
    };

    const renderWorkoutPlan = (plan) => (
        <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            <div className="mt-4">
                <h4 className="font-medium text-gray-700">Weekly Schedule:</h4>
                {Object.entries(plan.schedule).map(([day, workout]) => (
                    <div key={day} className="mt-2 p-2 hover:bg-gray-50 rounded">
                        <span className="font-medium text-green-600">{day}: </span>
                        <span>{workout.focus}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExercise = (exercise) => (
        <div key={exercise.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
            <p className="text-gray-600 mt-2">{exercise.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <Badge label={exercise.difficulty} variant={exercise.difficulty} />
                {exercise.muscleGroups?.map(muscle => (
                    <Badge key={muscle} label={muscle} className="hover:bg-gray-200 transition-colors" />
                ))}
            </div>
            <div className="mt-4 text-sm">
                <p className="flex items-center p-1 hover:bg-gray-50 rounded">
                    <span className="mr-2">🔥</span> 
                    <span>Calories: <span className="font-semibold">{exercise.estimatedCaloriesBurn}</span></span>
                </p>
                <p className="flex items-center p-1 hover:bg-gray-50 rounded">
                    <span className="mr-2">⚡</span> 
                    <span>Equipment: <span className="font-semibold">{exercise.equipment?.join(', ')}</span></span>
                </p>
            </div>
        </div>
    );

    const renderChallenge = (challenge) => (
        <div key={challenge.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
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
        </div>
    );

    const renderAchievement = (achievement) => (
        <div key={achievement.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-gray-800">{achievement.name}</h3>
            <p className="text-gray-600 mt-2">{achievement.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <Badge label={achievement.rarity} variant={achievement.rarity} />
                <Badge label={`${achievement.points} points`} className="hover:bg-gray-200 transition-colors" />
            </div>
            <p className="mt-4 text-sm p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="mr-2">🎯</span> 
                <span className="font-medium">Requirement:</span> {achievement.requirement}
            </p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Workout Center</h1>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center space-x-2 mb-8">
                {['workoutPlans', 'exercises', 'challenges', 'achievements'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                            activeTab === tab
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                    </button>
                ))}
            </div>

            {/* Search Bar for Exercises */}
            {activeTab === 'exercises' && (
                <div className="max-w-2xl mx-auto mb-8">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search exercises..."
                    />
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {activeTab === 'workoutPlans' && workoutPlans.map(renderWorkoutPlan)}
                {activeTab === 'exercises' && 
                    (searchResults.length > 0 ? searchResults : exercises).map(renderExercise)}
                {activeTab === 'challenges' && challenges.map(renderChallenge)}
                {activeTab === 'achievements' && achievements.map(renderAchievement)}
            </div>
        </div>
    );
};

export default Workout; 