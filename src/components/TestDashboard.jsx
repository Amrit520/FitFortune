import { useState } from 'react';
import { useData } from '../context/DataContext';
import SearchBar from './common/SearchBar';
import FilterBar from './common/FilterBar';
import ProgressBar from './common/ProgressBar';
import Badge from './common/Badge';
import LoadingSpinner from './common/LoadingSpinner';

const TestDashboard = () => {
    const {
        isLoading,
        recipes,
        exercises,
        workoutPlans,
        foods,
        challenges,
        achievements,
        searchRecipes,
        searchExercises,
    } = useData();

    const [activeTab, setActiveTab] = useState('recipes');
    const [searchResults, setSearchResults] = useState([]);

    const tabs = [
        { id: 'recipes', label: 'Recipes' },
        { id: 'exercises', label: 'Exercises' },
        { id: 'workoutPlans', label: 'Workout Plans' },
        { id: 'foods', label: 'Foods' },
        { id: 'challenges', label: 'Challenges' },
        { id: 'achievements', label: 'Achievements' }
    ];

    const handleSearch = (query) => {
        if (activeTab === 'recipes') {
            setSearchResults(searchRecipes(query));
        } else if (activeTab === 'exercises') {
            setSearchResults(searchExercises(query));
        }
    };

    const renderDataCard = (item, type) => {
        switch (type) {
            case 'recipes':
                return (
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="mt-2">
                            <Badge label={item.difficulty} variant={item.difficulty} />
                            {item.dietaryInfo?.map(diet => (
                                <Badge key={diet} label={diet} variant="default" className="ml-2" />
                            ))}
                        </div>
                        <div className="mt-3 text-sm">
                            <p>⏱️ {item.prepTime} minutes</p>
                            <p>🍽️ {item.servings} servings</p>
                        </div>
                    </div>
                );

            case 'exercises':
                return (
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="mt-2">
                            <Badge label={item.difficulty} variant={item.difficulty} />
                            {item.muscleGroups?.map(muscle => (
                                <Badge key={muscle} label={muscle} variant="default" className="ml-2" />
                            ))}
                        </div>
                        <div className="mt-3 text-sm">
                            <p>🔥 {item.estimatedCaloriesBurn} calories</p>
                            <p>⚡ Equipment: {item.equipment?.join(', ')}</p>
                        </div>
                    </div>
                );

            case 'challenges':
                return (
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="mt-2">
                            <Badge label={item.difficulty} variant={item.difficulty} />
                            <Badge label={item.category} variant="default" className="ml-2" />
                        </div>
                        <div className="mt-3 text-sm">
                            <p>⏱️ {item.duration} days</p>
                            <p>🏆 Points: {item.dailyTasks?.[0]?.points} per task</p>
                        </div>
                    </div>
                );

            case 'foods':
                return (
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                        <div className="mt-2">
                            <p>Calories: {item.calories}</p>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                <div>
                                    <p className="text-xs">Protein</p>
                                    <p className="font-semibold">{item.macros?.protein}g</p>
                                </div>
                                <div>
                                    <p className="text-xs">Carbs</p>
                                    <p className="font-semibold">{item.macros?.carbs}g</p>
                                </div>
                                <div>
                                    <p className="text-xs">Fats</p>
                                    <p className="font-semibold">{item.macros?.fats}g</p>
                                </div>
                                <div>
                                    <p className="text-xs">Fiber</p>
                                    <p className="font-semibold">{item.macros?.fiber}g</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getDataForActiveTab = () => {
        switch (activeTab) {
            case 'recipes':
                return recipes;
            case 'exercises':
                return exercises;
            case 'workoutPlans':
                return workoutPlans;
            case 'foods':
                return foods;
            case 'challenges':
                return challenges;
            case 'achievements':
                return achievements;
            default:
                return [];
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Data Explorer</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === tab.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            {(activeTab === 'recipes' || activeTab === 'exercises') && (
                <div className="mb-6">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder={`Search ${activeTab}...`}
                    />
                </div>
            )}

            {/* Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(searchResults.length > 0 ? searchResults : getDataForActiveTab()).map((item) => (
                    <div key={item.id}>
                        {renderDataCard(item, activeTab)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestDashboard; 