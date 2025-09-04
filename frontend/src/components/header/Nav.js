import SearchBar from './searchBar';
import Filter from './Filter';
import { Link} from "react-router";
import { User} from 'lucide-react';
import React from 'react';

const Nav=({name,lik})=>{
    return(
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 w-[85%] rounded-2xl shadow-md border border-gray-700">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold tracking-wide text-white">{name} |</h1>
          {lik||""}
        </div>
        
        <SearchBar />
        
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:ring-2 hover:ring-indigo-500 transition">
          <Link to="../profile">
            <User size={18} className="text-white" />
          </Link>
        </div>
      </div>
    )
    
}

export default Nav