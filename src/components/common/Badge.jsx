const Badge = ({ icon, label, count, variant = "default" }) => {
    const variants = {
        common: "bg-gray-100 text-gray-800",
        rare: "bg-blue-100 text-blue-800",
        epic: "bg-purple-100 text-purple-800",
        legendary: "bg-yellow-100 text-yellow-800",
        default: "bg-gray-100 text-gray-800"
    };

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full ${variants[variant] || variants.default}`}>
            {icon && <span className="mr-1">{icon}</span>}
            <span className="text-sm font-medium">{label}</span>
            {count !== undefined && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-white/30">
                    {count}
                </span>
            )}
        </div>
    );
};

export default Badge; 