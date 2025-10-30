// 52_Masanabo
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { User, Users, AlertCircle } from "lucide-react";

import Friends from "../components/Profile/Friends";
import ProjectsList from "../components/Profile/ProjectsList";
import Profile from "../components/Profile/Profile";
import Nevigat from "../components/header/Nav";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
    friends: [],
    projects: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fetch user data by ID
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          throw new Error('Session expired. Please login again.');
        } else if (userResponse.status === 404) {
          throw new Error('User not found.');
        }
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser(userData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold text-red-400">Error Loading Profile</h2>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchUserData}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="px-6 py-4 border-b border-gray-700">
        <Nevigat name={`${user.name || user.username}'s Profile`} />
      </header>
      <br />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Profile user={user} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProjectsList
              projects={user?.projects || []}
              onProjectDelete={() => {}}
            />

            <Friends
              friends={user?.friends || []}
              friendRequests={{ received: [] }} 
              onAcceptRequest={() => {}}
              onRejectRequest={() => {}}
              onRemoveFriend={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
