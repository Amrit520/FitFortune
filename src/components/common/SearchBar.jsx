import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 pr-12"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500"
                >
                    🔍
                </button>
            </div>
        </form>
    );
};

export default SearchBar; 