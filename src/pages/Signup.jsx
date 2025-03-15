import { useState, useEffect } from "react"
import { Link, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Signup = ({ dbStatus }) => {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        
        // Validation
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        
        try {
            // Use the authentication service to sign up
            const userData = {
                fullName: formData.fullName
            }
            
            const { success, error, user } = await signUp(formData.email, formData.password, userData)
            
            if (success) {
                console.log('Account created successfully! Please check your email to confirm your account.')
                navigate('/login')
            } else {
                setError(error || 'Failed to create account')
                console.error(error || 'Account creation failed. Please try again.')
            }
        } catch (err) {
            setError(err.message || 'An error occurred during signup')
            console.error(err.message || 'Account creation failed. Please try again later.')
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
                    Create Your FitFortune Account
                </h1>
                
                {showDbMessage}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Full Name</label>
                        <input 
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Enter your full name"
                            disabled={loading}
                        />
                    </div>

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
                            placeholder="Create a password"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Confirm Password</label>
                        <input 
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Confirm your password"
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
                        {loading ? 'Creating Account...' : 'Create Account'}
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
                        Already have an account?
                        <NavLink to="/login" className="text-blue-500 ml-1 hover:underline">
                            Log in here
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup