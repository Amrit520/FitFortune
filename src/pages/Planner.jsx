import { useContext,  useState } from "react"
import mealContext from "../context/mealContext"
import { Link } from "react-router-dom"
import Header from "../components/Header/Header"
import { MealPlanSkeleton } from './meal-plan-skeleton'

const Planner = () => {
    const { getMealPlan } = useContext(mealContext)
    const [formData, setformData] = useState({
        targetCal: 1000,
        timeframe: "day",
        diet: "vegetarian",
        exclude: ""
    })

    const [ weekPlan, setweekPlan ] = useState(null)
    const [mealPlan, setMealPlan] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    const showMealPlan = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        setHasError(false)
        try {
            const data = await getMealPlan(formData)
            if (!data) {
                throw new Error("No data returned from API")
            }
            if(formData.timeframe === 'day'){
                setMealPlan(data.meals)
                setweekPlan(null)
            } else{ 
                setMealPlan(null)
                setweekPlan(data.week)
            }
        } catch (error) {
            console.error('Error fetching meal plan:', error)
            setHasError(true)
            setMealPlan(null)
            setweekPlan(null)
        } finally {
            setIsLoading(false)
        }
    }

 
    const updateFormData = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }    

    
  return (
    <div className="px-10 py-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Meal Planner</h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 mb-10 transition-transform hover:shadow-lg">
            <form onSubmit={showMealPlan} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold text-lg">Target Calories</label>
                    <input 
                        type="number" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        value={formData.targetCal}
                        onChange={updateFormData}
                        name="targetCal"
                        placeholder="e.g. 2000"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold text-lg">Time Frame</label>
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white transition-all"
                        value={formData.timeframe}
                        onChange={updateFormData}
                        name="timeframe"
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                    </select>
                </div>
                
                <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold text-lg">Diet</label>
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white transition-all"
                        value={formData.diet}
                        onChange={updateFormData}
                        name="diet"
                    >
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="paleo">Paleo</option>
                        <option value="primal">Primal</option>
                        <option value="whole30">Whole30</option>
                    </select>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transform hover:scale-[1.02] transition-all focus:outline-none"
                >
                    Generate Meal Plan
                </button>
            </form>
        </div>

        {hasError && !isLoading && (
            <div className="text-center p-5 mt-4 bg-red-100 text-red-700 rounded-xl max-w-4xl mx-auto">
                <p className="font-semibold">Sorry, we couldn't generate your meal plan. Please try again.</p>
            </div>
        )}

        {/* Meal plan results */}
        {formData.timeframe === 'week' && weekPlan ? 
            <div className="space-y-8 max-w-6xl mx-auto">
                {
                    Object.keys(weekPlan).map(day => {
                        console.log(weekPlan[day].meals)
                        return(
                            <div className="mt-10 px-10 border-b-2 ">
                                <h3>{ day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                            <ul className='relative flex mx-auto flex-wrap justify-center p-5'>
                                {
                                    weekPlan[day].meals.map((recipe, index) => {
                                        return (
                                            <li key={index} className=" w-full max-h-[35vh] md:max-w-[25vw] rounded overflow-hidden m-5 shadow-lg">
                                                <div className="w-full h-[45%]">
                                                    <img width={"100%"} className="w-full h-full" src={`https://spoonacular.com/recipeImages/${recipe.id}-556x370.jpg`} alt={recipe?.title} />
                                                </div>
                                                <div className="px-6 py-2">
                                                    <div className="font-bold text-xl mb-2">
                                                        {recipe?.title.toString().slice(0, 23)}
                                                    </div>
                                                </div>
                                                <div className="px-6 pt-4 pb-2">
                                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Time: {recipe.readyInMinutes} min</span>
                                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Servings: {recipe.servings}</span>
                                                    <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                        <Link to={recipe.sourceUrl} target="_blank">
                                                            Visit Page
                                                        </Link>
                                                    </span>
                                                </div>
                                            </li>
                                        )
                                    }
                                    )}
                            </ul>
                        </div>
                        )
                    })
                }
            </div>
            : 
            <>
                {isLoading && <MealPlanSkeleton />}
                {mealPlan && <ul className='relative flex mx-auto flex-wrap justify-center gap-6 p-5 max-w-6xl'>
                    {
                        mealPlan && mealPlan.map((recipe, index) => {
                            return (
                                <li key={index} className="w-full md:w-[30%] rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl hover:transform hover:scale-[1.02] transition-all duration-300">
                                    <div className="w-full h-[200px] overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                                            src={`https://spoonacular.com/recipeImages/${recipe.id}-556x370.jpg`} 
                                            alt={recipe?.title} 
                                        />
                                    </div>
                                    <div className="px-6 py-4">
                                        <div className="font-bold text-xl mb-2 text-gray-800">
                                            {recipe?.title}
                                        </div>
                                    </div>
                                    <div className="px-6 pt-2 pb-4">
                                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-gray-300 transition-colors">⏱️ {recipe.readyInMinutes} min</span>
                                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-gray-300 transition-colors">🍽️ {recipe.servings} servings</span>
                                        <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-700 mr-2 mb-2 hover:bg-green-200 transition-colors">
                                            <Link to={recipe.sourceUrl} target="_blank" className="flex items-center">
                                                <span>View Recipe</span> 
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        </span>
                                    </div>
                                </li>
                            )
                        }
                    )}
                </ul>}
            </>
        }
    </div>
  )
}

export default Planner