import { useState } from "react";
import mealContext from "./mealContext";

const MealProvider = (props) => {
    const [recipes, setrecipes] = useState([])
    const [user, setuser] = useState({})
    // TODO: Fetch recipes
    const fetchRecipes = async () => {
        try {
            // const response = await fetch(`${import.meta.env.VITE_OUTERBASE_URL}/recipes`)
            const response = await fetch(`https://encouraging-scarlet.cmd.outerbase.io/recipes`)
            const data = await response.json()
            // setAllRecipes(data.response)
            setrecipes(data.response.items)
        } catch (error) {
            console.log(error)
        }
    }

    // TODO: Add recipe
    const addRecipe = async(formData) => {
        try{ 
            const response = await fetch(`https://encouraging-scarlet.cmd.outerbase.io/newrecipe`, {
            'method': 'POST',
            'headers': {
                'content-type': 'application/json'
            },
            'body': JSON.stringify({
                recipe_name: formData.recipe_name,
                ingredients: formData.ingredients,
                rating: formData.rating,
                img_src: formData.img_src
            })
            })

            const res = await response.json()   
            setrecipes([...recipes, formData])
            console.log(res)
        }catch(error) {
            console.log("Error" + error.message)
        }
    }



    // TODO: Get meal plan
    const getMealPlan = async(formData) => {
        try {
            const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=e95d3f8d33e34b2d80c5758dd4a007b8&timeFrame=${formData.timeframe}&targetCalories=${formData.targetCal}&diet=${formData.diet}`)
            const data = await response.json()
            console.log(data)
            return data
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <mealContext.Provider value={{ 
            recipes,
            fetchRecipes,
            addRecipe,
            getMealPlan, 
            user, setuser
         }}>
        { props.children }
        </mealContext.Provider>
    );
};

export default MealProvider;