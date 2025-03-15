const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-3 text-lg text-gray-700">Loading...</span>
        </div>
    );
};

export default LoadingSpinner; 