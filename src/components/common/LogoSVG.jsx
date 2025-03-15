import React from 'react';

/**
 * LogoSVG Component
 * 
 * This component contains the inline SVG for the app logo.
 * By using this component instead of referencing SVG files, we bypass browser caching issues.
 * 
 * @param {Object} props Component props
 * @param {number} props.width Width of the SVG
 * @param {number} props.height Height of the SVG
 * @returns {JSX.Element} SVG Logo
 */
const LogoSVG = ({ width = 50, height = 50 }) => {
  // Using a unique ID to ensure the gradients don't conflict with other SVGs on the page
  const uniqueId = React.useId().replace(/:/g, '');
  
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 500 300"
    >
      {/* Definitions for gradients */}
      <defs>
        {/* Gradient for left loop */}
        <linearGradient id={`leftLoopGradient-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#819F8F" />
          <stop offset="100%" stopColor="#6E8C7D" />
        </linearGradient>

        {/* Gradient for right loop */}
        <linearGradient id={`rightLoopGradient-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2F3B35" />
          <stop offset="100%" stopColor="#46554D" />
        </linearGradient>
      </defs>

      {/* Loops */}
      {/* Left loop (ellipse) */}
      <ellipse
        cx="190"
        cy="130"
        rx="70"
        ry="70"
        fill={`url(#leftLoopGradient-${uniqueId})`}
      />

      {/* Right loop (ellipse) */}
      <ellipse
        cx="310"
        cy="130"
        rx="70"
        ry="70"
        fill={`url(#rightLoopGradient-${uniqueId})`}
      />

      {/* Center Bar */}
      <rect
        x="160"
        y="115"
        width="180"
        height="30"
        fill="#2F3B35"
        rx="5"
        ry="5"
      />

      {/* Text */}
      {/* "FITFORTUNE" */}
      <text
        x="250"
        y="220"
        textAnchor="middle"
        fill="#2F3B35"
        fontFamily="Montserrat, sans-serif"
        fontSize="36"
        fontWeight="600"
        letterSpacing="2"
      >
        FITFORTUNE
      </text>

      {/* "HEALTH & FITNESS" */}
      <text
        x="250"
        y="255"
        textAnchor="middle"
        fill="#2F3B35"
        fontFamily="Montserrat, sans-serif"
        fontSize="16"
        fontWeight="400"
        letterSpacing="2"
      >
        HEALTH & FITNESS
      </text>
    </svg>
  );
};

export default LogoSVG; 