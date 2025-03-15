import { useData } from '../context/DataContext';
import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import Badge from '../components/common/Badge';

const Recipes = () => {
    const { recipes, foods, searchRecipes } = useData();
    const [activeTab, setActiveTab] = useState('recipes');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        if (activeTab === 'recipes') {
            setSearchResults(searchRecipes(query));
        }
    };

    const renderRecipe = (recipe) => (
        <div key={recipe.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
            <p className="text-gray-600 mt-2">{recipe.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <Badge label={recipe.difficulty} variant={recipe.difficulty} />
                {recipe.dietaryInfo?.map(diet => (
                    <Badge key={diet} label={diet} className="hover:bg-gray-200 transition-colors" />
                ))}
            </div>
            <div className="mt-4">
                <h4 className="font-medium text-gray-700">Ingredients:</h4>
                <ul className="list-disc list-inside mt-2">
                    {recipe.ingredients?.slice(0, 5).map((ingredient, index) => (
                        <li key={index} className="text-sm p-1 hover:bg-gray-50 rounded transition-colors">
                            {ingredient}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                <span className="flex items-center p-1 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <span className="mr-2">⏱️</span> 
                    <span className="text-sm"><span className="font-semibold">{recipe.prepTime}</span> minutes</span>
                </span>
                <span className="flex items-center p-1 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <span className="mr-2">🍽️</span> 
                    <span className="text-sm"><span className="font-semibold">{recipe.servings}</span> servings</span>
                </span>
            </div>
        </div>
    );

    const renderFood = (food) => (
        <div key={food.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
            <p className="text-gray-600 mt-2">Category: {food.category}</p>
            <div className="mt-4">
                <h4 className="font-medium text-gray-700">Nutritional Info:</h4>
                <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="text-sm flex items-center">
                            <span className="mr-2">🔥</span>
                            <span>Calories: <span className="font-semibold">{food.calories}</span></span>
                        </p>
                        <p className="text-sm mt-1 flex items-center">
                            <span className="mr-2">📏</span>
                            <span>Serving: <span className="font-semibold">{food.servingSize}</span></span>
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                            <p className="text-xs text-blue-700">Protein</p>
                            <p className="font-semibold text-blue-900">{food.macros?.protein}g</p>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded hover:bg-yellow-100 transition-colors">
                            <p className="text-xs text-yellow-700">Carbs</p>
                            <p className="font-semibold text-yellow-900">{food.macros?.carbs}g</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded hover:bg-red-100 transition-colors">
                            <p className="text-xs text-red-700">Fats</p>
                            <p className="font-semibold text-red-900">{food.macros?.fats}g</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded hover:bg-green-100 transition-colors">
                            <p className="text-xs text-green-700">Fiber</p>
                            <p className="font-semibold text-green-900">{food.macros?.fiber}g</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Nutrition Center</h1>

            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-4 mb-8">
                {['recipes', 'foods'].map(tab => (
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

            {/* Search Bar for Recipes */}
            {activeTab === 'recipes' && (
                <div className="max-w-2xl mx-auto mb-8">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search recipes..."
                    />
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {activeTab === 'recipes' && 
                    (searchResults.length > 0 ? searchResults : recipes).map(renderRecipe)}
                {activeTab === 'foods' && foods.map(renderFood)}
            </div>
        </div>
    );
};

export default Recipes;