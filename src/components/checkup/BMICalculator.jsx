import { useState } from 'react';

const BMICalculator = () => {
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiPrime, setBmiPrime] = useState(null);

  const calculateBMI = () => {
    if (!height || !weight) {
      alert('Please enter both height and weight');
      return;
    }

    let bmiValue;
    
    if (units === 'metric') {
      // Metric calculation: weight (kg) / height^2 (m)
      const heightInMeters = height / 100; // Convert cm to meters
      bmiValue = weight / (heightInMeters * heightInMeters);
    } else {
      // Imperial calculation: (weight (lbs) * 703) / height^2 (inches)
      bmiValue = (weight * 703) / (height * height);
    }

    // Round to 1 decimal place
    bmiValue = parseFloat(bmiValue.toFixed(1));
    
    // Calculate BMI Prime (ratio to upper limit of normal BMI which is 25)
    const bmiPrimeValue = parseFloat((bmiValue / 25).toFixed(2));
    setBmiPrime(bmiPrimeValue);
    
    // Determine BMI category
    let category;
    if (bmiValue < 16) category = 'Severe Thinness';
    else if (bmiValue < 17) category = 'Moderate Thinness';
    else if (bmiValue < 18.5) category = 'Mild Thinness';
    else if (bmiValue < 25) category = 'Normal';
    else if (bmiValue < 30) category = 'Overweight';
    else if (bmiValue < 35) category = 'Obese Class I';
    else if (bmiValue < 40) category = 'Obese Class II';
    else category = 'Obese Class III';

    setBmi(bmiValue);
    setBmiCategory(category);
  };

  const getCategoryColor = () => {
    if (!bmiCategory) return 'bg-gray-200';
    
    switch(bmiCategory) {
      case 'Severe Thinness':
      case 'Moderate Thinness':
      case 'Mild Thinness':
        return 'bg-blue-400';
      case 'Normal':
        return 'bg-green-400';
      case 'Overweight':
        return 'bg-yellow-400';
      case 'Obese Class I':
        return 'bg-orange-400';
      case 'Obese Class II':
      case 'Obese Class III':
        return 'bg-red-400';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          BMI (Body Mass Index) is a measurement that uses your height and weight to estimate how much body fat you have. It's calculated using the formula: weight / (height²). While BMI is a useful screening tool, it has limitations and doesn't directly measure body fat or account for factors like muscle mass, bone density, and ethnic differences.
        </p>
      </div>
      
      <div className="mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">
              {units === 'metric' ? 'Height (cm)' : 'Height (inches)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={units === 'metric' ? 'e.g., 170' : 'e.g., 67'}
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
              placeholder={units === 'metric' ? 'e.g., 70' : 'e.g., 160'}
            />
          </div>
        </div>

        <button 
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          onClick={calculateBMI}
        >
          Calculate BMI
        </button>
      </div>

      {bmi !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Your BMI Results</h3>
          
          <div className="mb-4">
            <div className="text-3xl font-bold">{bmi}</div>
            <div className={`inline-block px-3 py-1 mt-2 rounded-full text-white font-semibold ${getCategoryColor()}`}>
              {bmiCategory}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600">BMI Prime: {bmiPrime}</p>
            <p className="text-xs text-gray-500 mt-1">
              (BMI Prime is the ratio of your BMI to the upper limit of normal BMI (25). A value less than 1 is considered normal.)
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="h-2.5 rounded-full" 
              style={{ 
                width: `${Math.min(bmi * 2, 100)}%`, 
                backgroundColor: 
                  bmi < 18.5 ? '#3B82F6' : 
                  bmi < 25 ? '#10B981' : 
                  bmi < 30 ? '#FBBF24' : 
                  bmi < 35 ? '#F97316' : '#EF4444' 
              }}
            ></div>
          </div>

          <div className="flex text-xs justify-between">
            <span>16</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>40</span>
          </div>
          
          <div className="mt-4 text-gray-700">
            <p className="mb-2">
              <strong>Note:</strong> BMI is a screening tool, not a diagnostic tool. It has limitations:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>It may overestimate body fat in athletes with high muscle mass</li>
              <li>It may underestimate body fat in older persons or those who have lost muscle</li>
              <li>It doesn't consider factors like bone density, muscle mass, or ethnic differences</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator; 