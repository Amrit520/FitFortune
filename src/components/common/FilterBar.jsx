const FilterBar = ({ filters, activeFilters, onFilterChange }) => {
    return (
        <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
            {Object.entries(filters).map(([category, options]) => (
                <div key={category} className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 capitalize">
                        {category}
                    </label>
                    <select
                        value={activeFilters[category] || ''}
                        onChange={(e) => onFilterChange(category, e.target.value)}
                        className="px-3 py-1 border rounded-md focus:outline-none focus:border-green-500"
                    >
                        <option value="">All</option>
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default FilterBar; 