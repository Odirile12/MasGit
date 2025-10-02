import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearchChange, searchQuery }) => {
    const [localQuery, setLocalQuery] = useState(searchQuery || '');

    // Update local state when searchQuery prop changes
    useEffect(() => {
        setLocalQuery(searchQuery || '');
    }, [searchQuery]);

    const handleChange = (e) => {
        const value = e.target.value;
        setLocalQuery(value);
        onSearchChange(value);
    };

    return (
        <div className="relative w-1/3">
            <input
                type="text"
                value={localQuery}
                onChange={handleChange}
                placeholder="Search projects..."
                className="w-full px-4 py-2 text-sm rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
            </svg>
        </div>
    );
};

export default SearchBar;