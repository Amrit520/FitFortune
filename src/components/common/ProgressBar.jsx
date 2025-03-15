const ProgressBar = ({ value, max, label, color = "green" }) => {
    const percentage = (value / max) * 100;
    
    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm text-gray-600">{value}/{max}</span>
                </div>
            )}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-${color}-500 transition-all duration-300 ease-in-out`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar; 