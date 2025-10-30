// 52_Masanabo
import React from 'react';
import SearchBar from './searchBar';

const Header = ({
    name,
    sortBy,
    filter,
    onSortChange,
    onFilterChange,
    onSearchChange,
    searchQuery
}) => {
    return (
        <header className="dark:bg-gray-800 bg-gray-100 border-b dark:border-gray-700 border-gray-300 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold dark:text-white text-gray-900">{name}</h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    <SearchBar
                        onSearchChange={onSearchChange}
                        searchQuery={searchQuery}
                    />

                    {/* Filter Dropdown */}
                    <select
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="px-3 py-2 dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-900 rounded-lg border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Local">Local</option>
                        <option value="Global">Global</option>
                    </select>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-3 py-2 dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-900 rounded-lg border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Recent">Recent</option>
                        <option value="Popular">Popular</option>
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;
