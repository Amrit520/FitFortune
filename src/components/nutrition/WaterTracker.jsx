import { useState, useEffect } from 'react';
import { useNutrition } from '../../context/NutritionContext';

const WaterTracker = () => {
  const { 
    waterIntake, 
    nutritionGoals, 
    logWaterIntake
  } = useNutrition();
  
  const [todayWater, setTodayWater] = useState(0);
  const [reminderInterval, setReminderInterval] = useState(60);
  const [reminderOptions] = useState([
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' }
  ]);

  // Calculate total water for today
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (!waterIntake || !Array.isArray(waterIntake)) {
      setTodayWater(0);
      return;
    }
    
    const todayEntries = waterIntake.filter(entry => {
      if (!entry || !entry.consumed_at) return false;
      return new Date(entry.consumed_at).toISOString().split('T')[0] === today;
    });
    
    const total = todayEntries.reduce((sum, entry) => sum + (Number(entry.amount_ml) || 0), 0);
    setTodayWater(total);
  }, [waterIntake]);

  // Handle adding water
  const handleAddWater = async (amount) => {
    try {
      await logWaterIntake(amount);
    } catch (error) {
      console.error('Error logging water intake:', error);
    }
  };

  // Handle reminder interval change
  const handleReminderChange = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    setReminderInterval(newInterval);
    
    // Store setting in local storage
    localStorage.setItem('waterReminderInterval', newInterval.toString());
  };

  // Load reminder setting from local storage
  useEffect(() => {
    const savedInterval = localStorage.getItem('waterReminderInterval');
    if (savedInterval) {
      setReminderInterval(parseInt(savedInterval, 10));
    }
  }, []);

  // Calculate percentage of daily goal
  const percentComplete = nutritionGoals && nutritionGoals.waterMl > 0
    ? Math.min(Math.round((todayWater / nutritionGoals.waterMl) * 100), 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Water Tracker</h2>
        <div className="text-sm text-gray-600">Goal: {nutritionGoals?.waterMl || 2500}ml</div>
      </div>
      
      {/* Water Progress Visualization */}
      <div className="relative h-48 w-48 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-8 border-blue-100"></div>
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-b-full transition-all duration-500"
          style={{ height: `${percentComplete}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-blue-600">{todayWater}ml</span>
          <span className="text-sm font-medium text-gray-500">{percentComplete}%</span>
        </div>
      </div>
      
      {/* Quick Add Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button 
          onClick={() => handleAddWater(100)}
          className="bg-blue-100 text-blue-600 rounded-lg py-2 hover:bg-blue-200 transition"
        >
          +100ml
        </button>
        <button 
          onClick={() => handleAddWater(250)}
          className="bg-blue-100 text-blue-600 rounded-lg py-2 hover:bg-blue-200 transition"
        >
          +250ml
        </button>
        <button 
          onClick={() => handleAddWater(500)}
          className="bg-blue-100 text-blue-600 rounded-lg py-2 hover:bg-blue-200 transition"
        >
          +500ml
        </button>
        <button 
          onClick={() => handleAddWater(1000)}
          className="bg-blue-100 text-blue-600 rounded-lg py-2 hover:bg-blue-200 transition"
        >
          +1L
        </button>
      </div>
      
      {/* Water Reminder Settings */}
      <div className="border-t pt-4">
        <h3 className="text-md font-medium mb-2">Hydration Reminders</h3>
        <div className="flex items-center">
          <select 
            value={reminderInterval}
            onChange={handleReminderChange}
            className="p-2 border rounded mr-2"
          >
            {reminderOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="text-sm text-gray-500 ml-2">
            We'll remind you to drink water regularly
          </div>
        </div>
        
        {/* Water intake tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="font-medium mb-1">💧 Hydration Tip:</p>
          <p>Drinking adequate water helps maintain energy levels and supports overall health. Aim to drink at least 2-3 liters daily.</p>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker; 