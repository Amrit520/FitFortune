import React from 'react';

const ErrorDisplay = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 to-red-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg border border-red-200">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        
        <div className="mb-4 p-3 bg-red-50 rounded border border-red-100">
          <p className="text-red-800 font-medium">Error message:</p>
          <p className="text-red-700 mt-1 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[200px]">
            {error?.message || "Unknown error"}
          </p>
        </div>
        
        {error?.stack && (
          <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-gray-800 font-medium">Stack trace:</p>
            <pre className="text-gray-700 mt-1 text-xs whitespace-pre-wrap overflow-auto max-h-[200px]">
              {error.stack}
            </pre>
          </div>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
          
          {resetErrorBoundary && (
            <button 
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          )}
          
          <a 
            href="/?fallback=true" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
          >
            Fallback Mode
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay; 