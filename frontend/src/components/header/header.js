import SearchBar from './searchBar';
import Filter from './Filter';
import { Link} from "react-router";
import { User} from 'lucide-react';
import Navigate from './Nav'
import React, { useState } from 'react';
const Header = ({name, sortBy, filter, onSortChange, onFilterChange }) => {
  return (
    <header className="px-6 py-4 flex flex-col items-center gap-3">
        <Navigate name={name}></Navigate>

      <Filter 
        sortBy={sortBy}
        filter={filter}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
      />
    </header>
  );
};

export default Header;