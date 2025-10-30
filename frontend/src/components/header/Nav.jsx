import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Home, User, LogOut, Settings, Shield } from "lucide-react";

const Nevigat = ({ name, lik }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/");
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

          {/* Admin Link - Only show for admin users */}
          {userRole === 'admin' && (
            <Link
              to="/Admin"
              className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
            >
              <Shield size={18} />
              <span>Admin</span>
            </Link>
          )}

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
