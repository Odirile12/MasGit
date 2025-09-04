import React, { useState } from 'react';
import { Link} from "react-router";
const Filter = ({ sortBy, filter, onSortChange, onFilterChange }) => {
  return (
    <div className="w-[85%] bg-gray-800 rounded-xl shadow-md border border-gray-700 px-4 py-2 flex items-center justify-between">
      <div className="relative">
        <button 
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm text-white transition"
          onClick={() => onFilterChange(filter === 'Local' ? 'Global' : 'Local')}
        >
          <span>{filter}</span>
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>SORT BY</span>
        <button 
          className="text-white hover:text-indigo-400 transition-colors"
          onClick={() => onSortChange(sortBy === 'Recent' ? 'Popular' : 'Recent')}
        >
          {sortBy}
        </button>
      </div>
    </div>
  );
};

export default Filter;