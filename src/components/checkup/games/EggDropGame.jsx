import { useEffect, useRef } from 'react';

const EggDropGame = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create iframe to contain the game
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Add the iframe to the container
    containerRef.current.appendChild(iframe);
    
    // Get the document inside the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Write the game HTML to the iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Egg Drop Reflex Game</title>
          <style>
              body {
                  margin: 0;
                  overflow: hidden;
                  font-family: Arial, sans-serif;
                  background-color: #87CEEB;
              }
              #gameCanvas {
                  display: block;
                  background-color: #87CEEB;
              }
              #startScreen, #resultScreen {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  text-align: center;
                  background-color: rgba(255, 255, 255, 0.9);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                  max-width: 500px;
                  width: 90%;
              }
              button {
                  padding: 10px 20px;
                  font-size: 16px;
                  background-color: #4CAF50;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-top: 20px;
              }
              button:hover {
                  background-color: #45a049;
              }
              h1 {
                  color: #333;
              }
              #resultDetails {
                  margin: 20px 0;
                  font-size: 18px;
              }
              .rating {
                  font-size: 24px;
                  font-weight: bold;
                  color: #FF5722;
                  margin: 15px 0;
              }
              .tips {
                  background-color: #f0f8ff;
                  border-left: 4px solid #4682b4;
                  padding: 10px;
                  margin-top: 15px;
                  text-align: left;
                  font-size: 14px;
              }
              .performance-chart {
                  margin: 15px 0;
                  height: 30px;
                  background-color: #eee;
                  border-radius: 5px;
                  overflow: hidden;
              }
              .performance-bar {
                  height: 100%;
                  background: linear-gradient(90deg, #4CAF50, #FFC107, #F44336);
                  transition: width 1s;
              }
              .accuracy-stat {
                  font-weight: bold;
                  font-size: 20px;
                  margin: 10px 0;
              }
          </style>
      </head>
      <body>
          <canvas id="gameCanvas"></canvas>
          
          <div id="startScreen">
              <h1>Egg Drop Reflex Game</h1>
              <p>Move the basket with your mouse to catch falling eggs!</p>
              <p>The eggs will drop at unpredictable locations and speeds to test your reflexes.</p>
              <p><strong>Warning: This is a challenging test of your reflexes!</strong></p>
              <p style="color:#FF5722">Try to catch as many eggs as possible to get an accurate assessment of your reaction speed.</p>
              <button id="startButton">Start Game</button>
          </div>
          
          <div id="resultScreen" style="display: none;">
              <h1>Game Over!</h1>
              <div id="resultDetails"></div>
              <button id="restartButton">Play Again</button>
          </div>

          <script>
              // Canvas setup
              const canvas = document.getElementById('gameCanvas');
              const ctx = canvas.getContext('2d');
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;

              // Game elements
              const basket = {
                  x: canvas.width / 2,
                  y: canvas.height - 100,
                  width: 100,
                  height: 50,
                  color: '#8B4513'
              };

              // Game state
              let gameActive = false;
              let eggsCaught = 0;
              let eggsMissed = 0;
              let eggsDropped = 0;
              let totalReactionTime = 0;
              let catchTimes = [];
              let eggs = [];
              let lastEggTime = 0;
              const MAX_EGGS = 5; // Increased from 5 for better assessment
              
              // DOM elements
              const startScreen = document.getElementById('startScreen');
              const resultScreen = document.getElementById('resultScreen');
              const resultDetails = document.getElementById('resultDetails');
              const startButton = document.getElementById('startButton');
              const restartButton = document.getElementById('restartButton');

              // Event listeners
              startButton.addEventListener('click', startGame);
              restartButton.addEventListener('click', resetGame);
              
              canvas.addEventListener('mousemove', (e) => {
                  if (gameActive) {
                      basket.x = e.clientX - basket.width / 2;
                      // Keep basket within canvas bounds
                      if (basket.x < 0) basket.x = 0;
                      if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
                  }
              });

              // Egg class
              class Egg {
                  constructor() {
                      this.radius = 15;
                      this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
                      this.y = -this.radius;
                      // Increased speed range from 7-12 to 9-15
                      this.speed = Math.random() * 6 + 12; 
                      
                      // Randomly add extra speed to some eggs to make it harder
                      if (Math.random() > 0.7) {
                          this.speed += 3;
                      }
                      
                      this.color = '#FFFFFF';
                      this.dropTime = Date.now();
                      this.caught = false;
                      this.missed = false;
                  }

                  update() {
                      this.y += this.speed;
                      
                      // Check if egg is caught
                      if (!this.caught && !this.missed &&
                          this.y + this.radius >= basket.y && 
                          this.y - this.radius <= basket.y + basket.height &&
                          this.x + this.radius >= basket.x && 
                          this.x - this.radius <= basket.x + basket.width) {
                          
                          this.caught = true;
                          eggsCaught++;
                          const catchTime = Date.now() - this.dropTime;
                          totalReactionTime += catchTime;
                          catchTimes.push(catchTime);
                      }
                      
                      // Check if egg has fallen past the basket
                      if (!this.caught && !this.missed && this.y - this.radius > canvas.height) {
                          this.missed = true;
                          eggsMissed++;
                      }
                  }

                  draw() {
                      // Don't draw if caught or missed
                      if (this.caught || this.missed) return;
                      
                      // Draw egg
                      ctx.fillStyle = this.color;
                      ctx.beginPath();
                      ctx.ellipse(this.x, this.y, this.radius, this.radius * 1.3, 0, 0, Math.PI * 2);
                      ctx.fill();
                      
                      // Add some egg details
                      ctx.fillStyle = '#FFFACD';
                      ctx.beginPath();
                      ctx.ellipse(this.x - 5, this.y - 5, this.radius/3, this.radius/2, 0, 0, Math.PI * 2);
                      ctx.fill();
                  }
              }

              // Game functions
              function startGame() {
                  startScreen.style.display = 'none';
                  gameActive = true;
                  resetGameState();
                  gameLoop();
                  
                  // Drop first egg after a short delay
                  setTimeout(dropEgg, Math.random() * 500 + 200);
              }

              function resetGame() {
                  resultScreen.style.display = 'none';
                  startGame();
              }

              function resetGameState() {
                  eggsCaught = 0;
                  eggsMissed = 0;
                  eggsDropped = 0;
                  totalReactionTime = 0;
                  catchTimes = [];
                  eggs = [];
                  lastEggTime = 0;
              }

              function dropEgg() {
                  if (eggsDropped < MAX_EGGS && gameActive) {
                      eggs.push(new Egg());
                      eggsDropped++;
                      lastEggTime = Date.now();
                      
                      // Schedule next egg drop if not reached max
                      if (eggsDropped < MAX_EGGS) {
                          // Made timing more unpredictable and faster - between 250ms and 1300ms
                          const nextEggDelay = Math.random() * 1000 + 200;
                          setTimeout(dropEgg, nextEggDelay);
                      }
                  }
              }

              function update() {
                  // Update all eggs
                  for (let i = 0; i < eggs.length; i++) {
                      eggs[i].update();
                  }
                  
                  // Check if game is over (all eggs have been accounted for)
                  if (eggsDropped >= MAX_EGGS && eggs.every(egg => egg.caught || egg.missed)) {
                      endGame();
                  }
              }

              function draw() {
                  // Clear canvas
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  
                  // Draw sky background
                  ctx.fillStyle = '#87CEEB';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  
                  // Draw ground
                  ctx.fillStyle = '#8B4513';
                  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
                  
                  // Draw grass
                  ctx.fillStyle = '#228B22';
                  ctx.fillRect(0, canvas.height - 30, canvas.width, 10);
                  
                  // Draw basket
                  ctx.fillStyle = basket.color;
                  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
                  
                  // Draw basket details (handle and texture)
                  ctx.fillStyle = '#6B4226';
                  ctx.fillRect(basket.x + 10, basket.y, 5, basket.height);
                  ctx.fillRect(basket.x + basket.width - 15, basket.y, 5, basket.height);
                  ctx.fillRect(basket.x, basket.y + basket.height/2, basket.width, 5);
                  
                  // Draw all eggs
                  for (let i = 0; i < eggs.length; i++) {
                      eggs[i].draw();
                  }
                  
                  // Draw score
                  ctx.fillStyle = '#000000';
                  ctx.font = '20px Arial';
                  ctx.fillText(\`Eggs Caught: \${eggsCaught}\`, 20, 30);
                  ctx.fillText(\`Eggs Missed: \${eggsMissed}\`, 20, 60);
                  ctx.fillText(\`Eggs Dropped: \${eggsDropped}/\${MAX_EGGS}\`, 20, 90);
              }

              function gameLoop() {
                  if (gameActive) {
                      update();
                      draw();
                      requestAnimationFrame(gameLoop);
                  }
              }

              function endGame() {
                  gameActive = false;
                  
                  // Calculate average reaction time
                  const avgReactionTime = totalReactionTime / catchTimes.length || 0;
                  
                  // Calculate accuracy percentage
                  const accuracyPercentage = Math.round((eggsCaught / MAX_EGGS) * 100);
                  
                  // Calculate performance score (combination of speed and accuracy)
                  let performanceScore = 0;
                  if (eggsCaught > 0) {
                      // Score based on reaction time (faster = higher score)
                      const speedScore = Math.max(0, 100 - (avgReactionTime / 15));
                      // Score based on accuracy
                      const accuracyScore = accuracyPercentage;
                      // Combined score (weighted more toward accuracy)
                      performanceScore = Math.round((speedScore * 0.4) + (accuracyScore * 0.6));
                  }
                  
                  // Rate the player's reflexes
                  let reflexRating = "";
                  let reflexDescription = "";
                  let improvementTips = "";
                  
                  if (eggsCaught === 0) {
                      reflexRating = "Unable to Rate 😕";
                      reflexDescription = "You didn't catch any eggs! Let's try again for a proper assessment.";
                      improvementTips = "Try focusing on egg positions as they appear and anticipate where they'll fall. Move the basket to that position quickly.";
                  } else if (eggsCaught <= 2) {
                      reflexRating = "Needs Development 🔍";
                      reflexDescription = "Your reflexes need some work, but that's okay! Everyone starts somewhere.";
                      improvementTips = "Focus on one area of the screen at a time. It's easier to catch eggs when your attention isn't divided.";
                  } else if (avgReactionTime < 400) {
                      reflexRating = "Superhuman Reflexes! 🚀";
                      reflexDescription = "Your reflexes are incredibly fast! Professional athlete or gamer level!";
                      improvementTips = "You're at the top level! To maintain this, try exercises that challenge your peripheral vision and hand-eye coordination.";
                  } else if (avgReactionTime < 550) {
                      reflexRating = "Lightning Fast! ⚡";
                      reflexDescription = "Your reflexes are exceptionally quick! Top tier performance.";
                      improvementTips = "To get even better, try playing at different times of day to see when your reflexes are at their peak.";
                  } else if (avgReactionTime < 700) {
                      reflexRating = "Very Quick Reactions! 🏆";
                      reflexDescription = "Great reflexes! You're faster than most people. Your fitness journey is clearly paying off.";
                      improvementTips = "To improve further, make sure you're well-rested and hydrated, as both factors affect reaction time.";
                  } else if (avgReactionTime < 850) {
                      reflexRating = "Good Reflexes! 🥇";
                      reflexDescription = "Above average reaction time. Your fitness routine is helping your neurological responses!";
                      improvementTips = "Regular cardiovascular exercise can help improve reaction time. Adding quick footwork drills to your routine could help.";
                  } else if (avgReactionTime < 1000) {
                      reflexRating = "Lightning Fast! ⚡";
                      reflexDescription = "Your reflexes are exceptionally quick! Top tier performance.";
                      improvementTips = "To get even better, try playing at different times of day to see when your reflexes are at their peak.";;
                  } else if (avgReactionTime < 1200) {
                      reflexRating = "Average Reflexes 🥉";
                      reflexDescription = "Room for improvement, but your reflexes are functioning well. Keep at it!";
                      improvementTips = "Balance exercises can improve reaction time by enhancing your proprioception (awareness of body position).";
                  } else {
                      reflexRating = "Could Use Some Practice 🏃";
                      reflexDescription = "Your reaction time is slower than average, but improvement comes with practice!";
                      improvementTips = "Start with slower-paced reaction games and gradually increase the difficulty as you improve.";
                  }
                  
                  // Add consistency assessment
                  let consistencyFeedback = "";
                  if (catchTimes.length > 1) {
                      // Calculate standard deviation of reaction times
                      const mean = avgReactionTime;
                      const variance = catchTimes.reduce((total, time) => total + Math.pow(time - mean, 2), 0) / catchTimes.length;
                      const stdDev = Math.sqrt(variance);
                      
                      if (stdDev < 100) {
                          consistencyFeedback = "<p><strong>Excellent consistency!</strong> Your reaction times are very stable, showing great focus throughout.</p>";
                      } else if (stdDev < 200) {
                          consistencyFeedback = "<p><strong>Good consistency.</strong> Your reaction times were fairly stable.</p>";
                      } else {
                          consistencyFeedback = "<p><strong>Inconsistent reactions.</strong> Your times varied significantly, which could indicate fatigue or distraction during the test.</p>";
                      }
                  }
                  
                  // Display results
                  resultDetails.innerHTML = \`
                      <p class="accuracy-stat">Accuracy: \${accuracyPercentage}%</p>
                      <div class="performance-chart">
                          <div class="performance-bar" style="width: \${accuracyPercentage}%"></div>
                      </div>
                      <p>Eggs Caught: \${eggsCaught} out of \${MAX_EGGS}</p>
                      <p>Average Reaction Time: \${Math.round(avgReactionTime)} ms</p>
                      <div class="rating">\${reflexRating}</div>
                      <p>\${reflexDescription}</p>
                      \${consistencyFeedback}
                      <div class="tips">
                          <strong>💡 Tips for Improvement:</strong>
                          <p>\${improvementTips}</p>
                      </div>
                      \${catchTimes.length > 0 ? 
                        \`<p>Your reaction times: \${catchTimes.map(t => Math.round(t) + 'ms').join(', ')}</p>\` : ''}
                      <p>Performance Score: \${performanceScore}/100</p>
                  \`;
                  
                  resultScreen.style.display = 'block';
              }

              // Initial setup
              window.addEventListener('resize', () => {
                  canvas.width = window.innerWidth;
                  canvas.height = window.innerHeight;
                  basket.y = canvas.height - 100;
              });

              // Draw initial screen
              draw();
          </script>
      </body>
      </html>
    `);
    iframeDoc.close();
    
    // Return cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          <strong>How to play:</strong> Move your mouse to control the basket and catch falling eggs.
          The game will measure your reaction time and provide a detailed analysis of your reflexes based on how quickly you respond.
        </p>
        <p className="text-gray-700 mb-4">
          This game tests continuous reaction time and hand-eye coordination, which are important skills for sports, 
          driving, and everyday tasks that require quick physical responses to visual stimuli.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Fitness Connection:</strong> Quick reflexes are a key indicator of neurological health and can improve with
          regular exercise. Faster reaction times are associated with better overall fitness and cognitive function.
        </p>
      </div>
      
      <div className="h-[600px] rounded-lg overflow-hidden" ref={containerRef}>
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-500">Loading egg drop game...</p>
        </div>
      </div>
    </div>
  );
};

export default EggDropGame; 