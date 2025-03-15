import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    height: '',
    weight: '',
    fitnessGoal: 'weightLoss'
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.fullName || '',
        email: user.email || '',
        bio: profile?.bio || '',
        height: profile?.height || '',
        weight: profile?.weight || '',
        fitnessGoal: profile?.fitnessGoal || 'weightLoss'
      });
    }
  }, [user, profile]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile
      const { success, error } = await updateProfile({
        fullName: formData.fullName,
        bio: formData.bio,
        height: formData.height,
        weight: formData.weight,
        fitnessGoal: formData.fitnessGoal
      });

      if (success) {
        console.log('Profile updated successfully!');
      } else {
        console.error(`Failed to update profile: ${error}`);
      }
    } catch (error) {
      console.error('An error occurred while updating your profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      console.info('You have been logged out');
    } catch (error) {
      console.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          {/* Profile picture/avatar */}
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mr-4">
            {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{formData.fullName || 'User'}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                placeholder="Your email address"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Height in cm"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Weight in kg"
              />
            </div>
            <div>
              <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 mb-1">
                Fitness Goal
              </label>
              <select
                id="fitnessGoal"
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
              >
                <option value="weightLoss">Weight Loss</option>
                <option value="muscleGain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="generalHealth">General Health</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
            >
              Log Out
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 