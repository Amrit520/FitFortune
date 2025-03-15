import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import MealProvider from './context/MealProvider.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NutritionProvider } from './context/NutritionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NutritionProvider>
        <MealProvider>
          <App />
        </MealProvider>
      </NutritionProvider>
    </AuthProvider>
  </React.StrictMode>,
)
