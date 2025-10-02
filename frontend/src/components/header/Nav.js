import React from "react";
import { Link, useNavigate } from "react-router";
import { Home, User, LogOut, Settings } from "lucide-react";

const Nevigat = ({ name, lik }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  return (
    <nav className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        {/* Left side - Brand/Name */}
        <div className="flex items-center gap-4">
          <Link 
            to="/Feed" 
            className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
          >
            {name || "CodeCollab"}
          </Link>
          {lik && <div className="text-gray-300">{lik}</div>}
        </div>

        {/* Right side - Navigation Links */}
        <div className="flex items-center gap-4">
          {/* Home/Feed Link */}
          <Link
            to="/Feed"
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            <Home size={18} />
            <span>Feed</span>
          </Link>

          {/* Profile Link */}
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            <User size={18} />
            <span>Profile</span>
          </Link>


          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nevigat;