import { useState } from 'react';

const CalorieCalculator = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [formula, setFormula] = useState('mifflin');
  const [calories, setCalories] = useState(null);
  const [bmr, setBmr] = useState(null);

  const activityLevels = {
    sedentary: { label: 'Sedentary (little or no exercise)', factor: 1.2 },
    light: { label: 'Lightly active (light exercise 1-3 days/week)', factor: 1.375 },
    moderate: { label: 'Moderately active (moderate exercise 3-5 days/week)', factor: 1.55 },
    active: { label: 'Very active (hard exercise 6-7 days/week)', factor: 1.725 },
    extreme: { label: 'Extremely active (very hard exercise, physical job or training twice a day)', factor: 1.9 }
  };

  const calculateCalories = () => {
    if (!age || !weight || !height) {
      alert('Please fill in all the required fields');
      return;
    }

    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);
    let ageValue = parseFloat(age);

    // Convert to metric if using imperial
    if (units === 'imperial') {
      weightKg = weightKg * 0.453592; // lbs to kg
      heightCm = heightCm * 2.54; // inches to cm
    }

    let basalMetabolicRate;

    // Calculate BMR based on selected formula
    if (formula === 'mifflin') {
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        basalMetabolicRate = (10 * weightKg) + (6.25 * heightCm) - (5 * ageValue) + 5;
      } else {
        basalMetabolicRate = (10 * weightKg) + (6.25 * heightCm) - (5 * ageValue) - 161;
      }
    } else if (formula === 'harris') {
      // Revised Harris-Benedict Equation
      if (gender === 'male') {
        basalMetabolicRate = (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageValue) + 88.362;
      } else {
        basalMetabolicRate = (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageValue) + 447.593;
      }
    }

    // Apply activity factor to get maintenance calories
    const maintenanceCalories = basalMetabolicRate * activityLevels[activityLevel].factor;

    // Round values to nearest whole number
    setBmr(Math.round(basalMetabolicRate));
    setCalories(Math.round(maintenanceCalories));
  };

  const getWeightChange = (deficit) => {
    return Math.round(calories + deficit);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          A maintenance calorie calculator estimates how many calories your body needs to maintain your current weight. This is based on your basal metabolic rate (BMR) and activity level. Your BMR is the number of calories your body needs at rest to maintain basic functions like breathing and circulation.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex mb-4">
          <button 
            className={`py-2 px-4 ${gender === 'male' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded-l-lg`}
            onClick={() => setGender('male')}
          >
            Male
          </button>
          <button 
            className={`py-2 px-4 ${gender === 'female' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded-r-lg`}
            onClick={() => setGender('female')}
          >
            Female
          </button>
        </div>

        <div className="flex mb-4">
          <button 
            className={`py-2 px-4 ${units === 'metric' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded-l-lg`}
            onClick={() => setUnits('metric')}
          >
            Metric (cm, kg)
          </button>
          <button 
            className={`py-2 px-4 ${units === 'imperial' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded-r-lg`}
            onClick={() => setUnits('imperial')}
          >
            Imperial (in, lbs)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Age</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 30"
              min="15"
              max="100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              {units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={units === 'metric' ? 'e.g., 70' : 'e.g., 154'}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              {units === 'metric' ? 'Height (cm)' : 'Height (inches)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={units === 'metric' ? 'e.g., 175' : 'e.g., 69'}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Activity Level</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            {Object.entries(activityLevels).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Formula</label>
          <div className="flex">
            <button 
              className={`py-2 px-4 ${formula === 'mifflin' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded-l-lg`}
              onClick={() => setFormula('mifflin')}
            >
              Mifflin-St Jeor
            </button>
            <button 
              className={`py-2 px-4 ${formula === 'harris' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded-r-lg`}
              onClick={() => setFormula('harris')}
            >
              Harris-Benedict
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            The Mifflin-St Jeor Equation is generally considered more accurate for most people.
          </p>
        </div>

        <button 
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          onClick={calculateCalories}
        >
          Calculate Calories
        </button>
      </div>

      {calories !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Your Calorie Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-gray-500 text-sm">Basal Metabolic Rate (BMR)</div>
              <div className="text-xl font-semibold">{bmr} calories/day</div>
              <div className="text-xs text-gray-500 mt-1">Calories needed at complete rest</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-gray-500 text-sm">Maintenance Calories</div>
              <div className="text-2xl font-bold text-green-600">{calories} calories/day</div>
              <div className="text-xs text-gray-500 mt-1">Calories to maintain your current weight</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Caloric Targets for Weight Management</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Goal</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Daily Calories</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Weekly Weight Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Mild Weight Loss</td>
                    <td className="py-2 px-4 border-b border-gray-200">{getWeightChange(-250)} calories/day</td>
                    <td className="py-2 px-4 border-b border-gray-200">~0.25 kg/0.5 lb</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Weight Loss</td>
                    <td className="py-2 px-4 border-b border-gray-200">{getWeightChange(-500)} calories/day</td>
                    <td className="py-2 px-4 border-b border-gray-200">~0.5 kg/1 lb</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Weight Maintenance</td>
                    <td className="py-2 px-4 border-b border-gray-200">{calories} calories/day</td>
                    <td className="py-2 px-4 border-b border-gray-200">No change</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Weight Gain</td>
                    <td className="py-2 px-4 border-b border-gray-200">{getWeightChange(500)} calories/day</td>
                    <td className="py-2 px-4 border-b border-gray-200">~0.5 kg/1 lb</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 text-gray-700">
            <p className="mb-2">
              <strong>How this is calculated:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>First, we calculate your Basal Metabolic Rate (BMR) using the {formula === 'mifflin' ? 'Mifflin-St Jeor' : 'Harris-Benedict'} Equation</li>
              <li>Then, we multiply your BMR by an activity factor ({activityLevels[activityLevel].factor}) based on your selected activity level</li>
              <li>The result is your Total Daily Energy Expenditure (TDEE) - the calories you need to maintain your weight</li>
              <li>To lose or gain weight, you need to create a calorie deficit or surplus</li>
            </ul>
            <p className="mt-2 text-xs">
              <strong>Note:</strong> These are estimates. Individual metabolism varies. Adjust your intake based on your results over 2-3 weeks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieCalculator; 