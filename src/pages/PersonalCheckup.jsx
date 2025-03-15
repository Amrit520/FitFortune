import { useState } from 'react';
import BMICalculator from '../components/checkup/BMICalculator';
import BodyFatCalculator from '../components/checkup/BodyFatCalculator';
import CalorieCalculator from '../components/checkup/CalorieCalculator';
import ReflexChecker from '../components/checkup/ReflexChecker';

const PersonalCheckup = () => {
  const [activeTab, setActiveTab] = useState('bmi');

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Personal Checkup</h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
        Monitor your health metrics and check your physical condition with these assessment tools. 
        Track your progress over time for better health outcomes.
      </p>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mb-8 flex-wrap">
        {['bmi', 'bodyfat', 'calories', 'reflex'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg transition-all duration-300 mb-2 ${
              activeTab === tab
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab === 'bmi' && 'BMI Calculator'}
            {tab === 'bodyfat' && 'Body Fat Calculator'}
            {tab === 'calories' && 'Calorie Counter'}
            {tab === 'reflex' && 'Reflex Checker'}
          </button>
        ))}
      </div>

      {/* BMI Calculator Tab */}
      {activeTab === 'bmi' && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Body Mass Index (BMI) Calculator</h2>
          <BMICalculator />
        </div>
      )}

      {/* Body Fat Calculator Tab */}
      {activeTab === 'bodyfat' && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Body Fat Percentage Calculator</h2>
          <BodyFatCalculator />
        </div>
      )}

      {/* Calorie Calculator Tab */}
      {activeTab === 'calories' && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Maintenance Calorie Calculator</h2>
          <CalorieCalculator />
        </div>
      )}

      {/* Reflex Checker Tab */}
      {activeTab === 'reflex' && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Reflex Checker Game</h2>
          <ReflexChecker />
        </div>
      )}
    </div>
  );
};

export default PersonalCheckup; 