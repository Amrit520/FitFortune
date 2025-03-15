import { useState } from 'react';
import EggDropGame from './games/EggDropGame';
import TrafficLightGame from './TrafficLightGame';

const ReflexChecker = () => {
  const [activeGame, setActiveGame] = useState('traffic');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          Reflexes are your body's automatic response to stimuli, which is an important factor in athletic performance, 
          coordination, and overall reaction speed. These games measure your reaction time by challenging you with different 
          stimuli. Faster reaction times indicate better reflexes.
        </p>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Choose a Reflex Game:</h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveGame('traffic')}
              className={`px-4 py-2 rounded-md ${
                activeGame === 'traffic' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Traffic Light Reaction
            </button>
            <button
              onClick={() => setActiveGame('egg')}
              className={`px-4 py-2 rounded-md ${
                activeGame === 'egg' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Egg Drop Challenge
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Game Descriptions:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Traffic Light Reaction:</strong> Tests simple reaction time by having you release a button when a light turns green. 
                Great for measuring pure reaction speed.
              </li>
              <li>
                <strong>Egg Drop Challenge:</strong> Tests hand-eye coordination and continuous reaction by having you catch falling eggs. 
                More complex than the traffic light test as it involves tracking moving objects.
              </li>
            </ul>
          </div>
          
          <p className="text-gray-700 mb-2">
            <strong>Scientific background:</strong> Average human reaction time to visual stimuli is around 250ms, but can be 
            affected by factors like age, fatigue, and practice. These games simulate different reflex scenarios to give you 
            a more complete picture of your reaction capabilities.
          </p>
        </div>
      </div>
      
      {activeGame === 'traffic' ? (
        <TrafficLightGame />
      ) : (
        <div className="mt-6">
          <EggDropGame />
        </div>
      )}
      
      <div className="mt-4 text-gray-700">
        <p className="text-sm">
          <strong>Note:</strong> Results from these games are only an approximation of your reflex speed. For medical 
          concerns or professional assessment, please consult a healthcare provider.
        </p>
      </div>
    </div>
  );
};

export default ReflexChecker; 