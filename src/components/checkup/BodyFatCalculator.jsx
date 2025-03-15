import { useState } from 'react';

const BodyFatCalculator = () => {
  const [gender, setGender] = useState('male');
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [bodyFat, setBodyFat] = useState(null);
  const [bodyFatCategory, setBodyFatCategory] = useState('');
  const [bodyFatMass, setBodyFatMass] = useState(null);
  const [leanBodyMass, setLeanBodyMass] = useState(null);

  const calculateBodyFat = () => {
    if (!weight || !height || !neck || !waist || (gender === 'female' && !hips)) {
      alert('Please fill in all the required measurements');
      return;
    }

    let heightValue = parseFloat(height);
    let neckValue = parseFloat(neck);
    let waistValue = parseFloat(waist);
    let hipsValue = gender === 'female' ? parseFloat(hips) : 0;
    let weightValue = parseFloat(weight);

    // Convert inches to cm if using imperial
    if (units === 'imperial') {
      heightValue = heightValue * 2.54;
      neckValue = neckValue * 2.54;
      waistValue = waistValue * 2.54;
      if (gender === 'female') {
        hipsValue = hipsValue * 2.54;
      }
      weightValue = weightValue * 0.453592; // Convert lbs to kg
    }

    // Calculate body fat percentage using U.S. Navy method
    let bodyFatPercentage;
    
    if (gender === 'male') {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistValue - neckValue) + 0.15456 * Math.log10(heightValue)) - 450;
    } else {
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistValue + hipsValue - neckValue) + 0.22100 * Math.log10(heightValue)) - 450;
    }

    // Round to 1 decimal place
    bodyFatPercentage = parseFloat(bodyFatPercentage.toFixed(1));
    
    // Calculate fat mass and lean mass
    const fatMass = (bodyFatPercentage / 100) * weightValue;
    const leanMass = weightValue - fatMass;
    
    // Determine body fat category based on American Council on Exercise guidelines
    let category;
    if (gender === 'male') {
      if (bodyFatPercentage < 2) category = 'Below Essential Fat';
      else if (bodyFatPercentage < 6) category = 'Essential Fat';
      else if (bodyFatPercentage < 14) category = 'Athletic';
      else if (bodyFatPercentage < 18) category = 'Fitness';
      else if (bodyFatPercentage < 25) category = 'Average';
      else category = 'Obese';
    } else {
      if (bodyFatPercentage < 10) category = 'Below Essential Fat';
      else if (bodyFatPercentage < 14) category = 'Essential Fat';
      else if (bodyFatPercentage < 21) category = 'Athletic';
      else if (bodyFatPercentage < 25) category = 'Fitness';
      else if (bodyFatPercentage < 32) category = 'Average';
      else category = 'Obese';
    }

    setBodyFat(bodyFatPercentage);
    setBodyFatCategory(category);
    setBodyFatMass(parseFloat(fatMass.toFixed(1)));
    setLeanBodyMass(parseFloat(leanMass.toFixed(1)));
  };

  const getCategoryColor = () => {
    if (!bodyFatCategory) return 'bg-gray-200';
    
    switch(bodyFatCategory) {
      case 'Below Essential Fat':
        return 'bg-red-400';
      case 'Essential Fat':
        return 'bg-blue-400';
      case 'Athletic':
        return 'bg-green-600';
      case 'Fitness':
        return 'bg-green-400';
      case 'Average':
        return 'bg-yellow-400';
      case 'Obese':
        return 'bg-red-400';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          The U.S. Navy method estimates body fat percentage using circumference measurements at specific body sites. This method is generally more accurate than BMI for assessing body composition, as it accounts for differences in body shape. Fat mass is metabolically active tissue that serves various functions including energy storage and hormone production.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">
              {units === 'metric' ? 'Neck Circumference (cm)' : 'Neck Circumference (inches)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              placeholder={units === 'metric' ? 'e.g., 38' : 'e.g., 15'}
            />
            <p className="text-xs text-gray-500 mt-1">Measure just below Adam's apple</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              {units === 'metric' ? 'Waist Circumference (cm)' : 'Waist Circumference (inches)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder={units === 'metric' ? 'e.g., 85' : 'e.g., 33.5'}
            />
            <p className="text-xs text-gray-500 mt-1">
              {gender === 'male' 
                ? 'Measure at navel level' 
                : 'Measure at the narrowest point'}
            </p>
          </div>
        </div>

        {gender === 'female' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {units === 'metric' ? 'Hip Circumference (cm)' : 'Hip Circumference (inches)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={hips}
              onChange={(e) => setHips(e.target.value)}
              placeholder={units === 'metric' ? 'e.g., 100' : 'e.g., 39.5'}
            />
            <p className="text-xs text-gray-500 mt-1">Measure at the widest point around buttocks</p>
          </div>
        )}

        <button 
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          onClick={calculateBodyFat}
        >
          Calculate Body Fat Percentage
        </button>
      </div>

      {bodyFat !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Your Body Fat Results</h3>
          
          <div className="mb-4">
            <div className="text-3xl font-bold">{bodyFat}%</div>
            <div className={`inline-block px-3 py-1 mt-2 rounded-full text-white font-semibold ${getCategoryColor()}`}>
              {bodyFatCategory}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-gray-500 text-sm">Body Fat Mass</div>
              <div className="text-xl font-semibold">{bodyFatMass} {units === 'metric' ? 'kg' : 'lbs'}</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-gray-500 text-sm">Lean Body Mass</div>
              <div className="text-xl font-semibold">{leanBodyMass} {units === 'metric' ? 'kg' : 'lbs'}</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Body Fat Categories (American Council on Exercise)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Women</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Men</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Essential fat</td>
                    <td className="py-2 px-4 border-b border-gray-200">10-13%</td>
                    <td className="py-2 px-4 border-b border-gray-200">2-5%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Athletes</td>
                    <td className="py-2 px-4 border-b border-gray-200">14-20%</td>
                    <td className="py-2 px-4 border-b border-gray-200">6-13%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Fitness</td>
                    <td className="py-2 px-4 border-b border-gray-200">21-24%</td>
                    <td className="py-2 px-4 border-b border-gray-200">14-17%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Average</td>
                    <td className="py-2 px-4 border-b border-gray-200">25-31%</td>
                    <td className="py-2 px-4 border-b border-gray-200">18-24%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Obese</td>
                    <td className="py-2 px-4 border-b border-gray-200">32+%</td>
                    <td className="py-2 px-4 border-b border-gray-200">25+%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 text-gray-700">
            <p className="mb-2">
              <strong>Note:</strong> While the U.S. Navy method is reasonably accurate for most people, it has limitations:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>It's an estimation based on circumference measurements</li>
              <li>More precise methods include DEXA scans, hydrostatic weighing, or air displacement plethysmography</li>
              <li>For best results, take measurements in the morning before eating and consistently</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyFatCalculator; 