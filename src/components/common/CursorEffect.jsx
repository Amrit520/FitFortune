import React, { useEffect, useState, useRef } from 'react';

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const lastPosition = useRef({ x: 0, y: 0 });
  const trailElements = useRef([]);

  useEffect(() => {
    // Add clickable class to all interactive elements
    const addClickableClass = () => {
      const clickableElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
      clickableElements.forEach(el => {
        el.classList.add('clickable-element');
      });
    };

    // Create a trail plus sign
    const createTrailPlus = (x, y) => {
      const trailPlus = document.createElement('div');
      trailPlus.className = 'trail-plus';
      trailPlus.style.left = `${x}px`;
      trailPlus.style.top = `${y}px`;
      
      // Random slight rotation for variety
      const rotation = Math.random() * 45 - 22.5;
      trailPlus.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      
      document.body.appendChild(trailPlus);
      
      // Add to our ref array to track elements
      trailElements.current.push(trailPlus);
      
      // Remove the element after animation completes
      setTimeout(() => {
        if (document.body.contains(trailPlus)) {
          document.body.removeChild(trailPlus);
          trailElements.current = trailElements.current.filter(el => el !== trailPlus);
        }
      }, 1000);
    };

    const createSparkles = (x, y) => {
      // Create 3-5 sparkles
      const sparkleCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random position around cursor
        const sparkleX = x + (Math.random() * 20 - 10);
        const sparkleY = y + (Math.random() * 20 - 10);
        
        sparkle.style.left = `${sparkleX}px`;
        sparkle.style.top = `${sparkleY}px`;
        
        // Random direction for animation
        const directionX = Math.random() * 2 - 1;
        const directionY = Math.random() * 2 - 1;
        sparkle.style.setProperty('--x', directionX);
        sparkle.style.setProperty('--y', directionY);
        
        document.body.appendChild(sparkle);
        
        // Add to our ref array to track elements
        trailElements.current.push(sparkle);
        
        // Remove the sparkle after animation completes
        setTimeout(() => {
          if (document.body.contains(sparkle)) {
            document.body.removeChild(sparkle);
            trailElements.current = trailElements.current.filter(el => el !== sparkle);
          }
        }, 800);
      }
    };

    // Update cursor position
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
      
      // Create trail only if cursor has moved a minimum distance
      const distance = Math.hypot(e.clientX - lastPosition.current.x, e.clientY - lastPosition.current.y);
      
      if (distance > 10) {
        createTrailPlus(e.clientX, e.clientY);
        createSparkles(e.clientX, e.clientY);
        lastPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    // Add event listeners
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial setup for clickable elements
    addClickableClass();
    
    // Setup mutation observer to add class to new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          addClickableClass();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      
      // Clean up any remaining trail elements
      trailElements.current.forEach(element => {
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      });
      trailElements.current = [];
    };
  }, [hidden]);

  return (
    <>
      <div 
        className="cursor-dot" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: hidden ? 0 : 1
        }}
      />
      <div 
        className="cursor-plus" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: hidden ? 0 : 1
        }}
      />
    </>
  );
};

export default CursorEffect;