import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import CursorEffect from './components/common/CursorEffect'
import databaseService from './services/databaseService'
import supabaseService from './services/supabase.js'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext.jsx'
import { NutritionProvider } from './context/NutritionContext.jsx'
import Profile from './pages/Profile'

// Lazy load page components to improve performance
const Home = lazy(() => import('./pages/Home'))
const Recipes = lazy(() => import('./pages/Recipes'))
const Planner = lazy(() => import('./pages/Planner'))
const NutritionTracker = lazy(() => import('./pages/NutritionTracker'))
const Signup = lazy(() => import('./pages/Signup'))
const Login = lazy(() => import('./pages/Login'))
const Workout = lazy(() => import('./pages/Workout'))
const Community = lazy(() => import('./pages/Community'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PersonalCheckup = lazy(() => import('./pages/PersonalCheckup'))
const NutritionChatEmbedded = lazy(() => import('./pages/NutritionChatEmbedded'))
const NFTMint = lazy(() => import('./pages/NFTMint'))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
  </div>
)

function App() {
  const [dbInitialized, setDbInitialized] = useState(false)
  const [dbError, setDbError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [offlineMode, setOfflineMode] = useState(false)

  // Initialize the database when the app starts
  useEffect(() => {
    const initDb = async () => {
      try {
        // Check database health
        const healthStatus = await databaseService.checkDatabaseHealth()
        
        if (healthStatus.status === 'error') {
          console.error('Database health check failed:', healthStatus.message)
          setDbError('Database connection failed. Using local storage instead.')
          setOfflineMode(true)
          
          // Replace toast with console log
          console.error('Unable to connect to the database. Some features may be limited.')
          
          // Still mark as initialized, just in offline mode
          setDbInitialized(true)
          return
        }
        
        // Initialize database
        const initialized = await databaseService.initializeDatabase()
        setDbInitialized(true)
        
        if (initialized) {
          console.log('Database initialized successfully')
          // Remove toast notification
          // toast.success('Database initialized successfully!', {
          //   position: 'top-right',
          //   autoClose: 3000
          // })
        }
      } catch (error) {
        console.error('Error initializing database:', error)
        setDbError(error.message)
        setOfflineMode(true)
        
        if (retryCount < 2) {
          // Retry connection after 5 seconds
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
            initDb()
          }, 5000)
        } else {
          // After 2 retries, just proceed in offline mode
          setDbInitialized(true)
          // Replace toast with console log
          console.error('Error initializing database. Using local storage instead.')
        }
      }
    }
    
    initDb()
  }, [retryCount])

  // Periodically check connection
  useEffect(() => {
    const connectionCheck = async () => {
      if (offlineMode) {
        try {
          const isConnected = await supabaseService.testConnection()
          if (isConnected) {
            setOfflineMode(false)
            setDbError(null)
            // Replace toast with console log
            console.log('Connection restored!')
          }
        } catch (error) {
          console.warn("Connection check failed:", error);
        }
      }
    }

    // Check connection every 30 seconds if in offline mode
    let interval
    if (offlineMode) {
      interval = setInterval(connectionCheck, 30000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [offlineMode])

  return (
    <AuthProvider>
      <NutritionProvider>
        <DataProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
              <Routes>
                {/* Route without header for embedded chatbot */}
                <Route path="/nutrition-chat" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NutritionChatEmbedded />
                  </Suspense>
                } />
                
                {/* Routes with header */}
                <Route path="*" element={
                  <>
                    <div className="px-4 md:px-10">
                      <Header />
                    </div>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes> 
                        <Route path="/" element={<Home />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/signup" element={<Signup dbStatus={{ initialized: dbInitialized, error: dbError }} />} />
                        <Route path="/login" element={<Login dbStatus={{ initialized: dbInitialized, error: dbError }} />} />
                        <Route path="/meal-planner" element={<Planner />} />
                        <Route path="/nutrition-tracker" element={<NutritionTracker />} />
                        <Route path="/workout" element={<Workout />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/checkup" element={<PersonalCheckup />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/nft-mint" element={<NFTMint />} />
                      </Routes>
                    </Suspense>
                    {/* Only load cursor effect on desktop */}
                    {typeof window !== 'undefined' && window.innerWidth > 768 && <CursorEffect />}
                  </>
                } />
              </Routes>
              
              {/* Offline mode indicator */}
              {offlineMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
                  Offline Mode - Some features may be limited
                  <button 
                    className="ml-2 bg-white text-red-500 px-2 py-1 rounded text-xs"
                    onClick={async () => {
                      try {
                        const isConnected = await supabaseService.testConnection()
                        if (isConnected) {
                          setOfflineMode(false)
                          setDbError(null)
                          // Replace toast with console log
                          console.log('Connection restored!')
                        } else {
                          // Replace toast with console log
                          console.error('Still unable to connect')
                        }
                      } catch (error) {
                        console.error("Connection retry error:", error);
                        // Replace toast with console log
                        console.error('Connection error')
                      }
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* Remove the toast container */}
              {/* <ToastContainer /> */}
            </div>
          </BrowserRouter>
        </DataProvider>
      </NutritionProvider>
    </AuthProvider>
  )
}

export default App
