import { useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = ({ dbStatus }) => {
    const navigate = useNavigate()
    const { signIn } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('') // Clear error when user types
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)
        
        try {
            // Use the authentication service to sign in
            const { success, error, user } = await signIn(formData.email, formData.password)
            
            if (success) {
                console.log('Login successful!')
                navigate('/dashboard')
            } else {
                setError(error || 'Invalid email or password')
                console.error('Login failed')
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login')
            console.error('Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGetStarted = () => {
        // For demo purposes, we'll use local storage for guest mode
        localStorage.setItem('guestMode', 'true')
        console.info('Continuing as guest. Some features may be limited.')
        navigate('/dashboard')
    }

    // Show database status message if there's an error
    const showDbMessage = dbStatus?.error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        {dbStatus.error}
                    </p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="w-full min-h-[85vh] overflow-hidden grid place-content-center">
            <div className="login flex flex-col gap-5 bg-white rounded-2xl p-8 min-w-[400px] shadow-xl">
                <h1 className="text-center text-2xl lg:text-3xl font-semibold">
                    Welcome Back to FitFortune
                </h1>
                
                {showDbMessage}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Email</label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Password</label>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="text-center text-gray-500">
                    or
                </div>

                <button 
                    onClick={handleGetStarted}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                    disabled={loading}
                >
                    Continue as Guest
                </button>

                <div className="border-t pt-4 mt-2">
                    <div className="text-center text-gray-500">
                        Don't have an account?
                        <NavLink to="/signup" className="text-blue-500 ml-1 hover:underline">
                            Sign up here
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;