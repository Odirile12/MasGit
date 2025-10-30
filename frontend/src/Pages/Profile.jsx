// 52_Masanabo
import React, { useState, useEffect } from "react";
import { User, Edit3, Plus, Users, AlertCircle } from "lucide-react";

import Friends from "../components/Profile/Friends";
import EditProfile from "../components/Profile/EditProfile";
import CreateProject from "../components/Profile/CreateProject";
import ProjectsList from "../components/Profile/ProjectsList";
import Profile from "../components/Profile/Profile";
import Nevigat from "../components/header/Nav";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
    friends: [],
    friendRequests: { received: [], sent: [] },
    projects: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendRequestsDetails, setFriendRequestsDetails] = useState({ received: [] });

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getAuthUserId = () => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const userInfo = getAuthUserId();
      if (!userInfo?.id) {
        throw new Error('User ID not found. Please login again.');
      }

      const userResponse = await fetch(`http://localhost:5000/api/users/${userInfo.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser(userData);

      if (userData.friendRequests?.received?.length > 0) {
        const requestDetails = await Promise.all(
          userData.friendRequests.received.map(async (userId) => {
            try {
              const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              return res.ok ? await res.json() : null;
            } catch (err) {
              console.error('Error fetching friend request user:', err);
              return null;
            }
          })
        );
        setFriendRequestsDetails({ 
          received: requestDetails.filter(r => r !== null) 
        });
      } else {
        setFriendRequestsDetails({ received: [] });
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleProjectCreate = (newProject) => {
    console.log('New project created:', newProject);
    
    setUser(prevUser => ({
      ...prevUser,
      projects: [...(prevUser.projects || []), newProject]
    }));
  };

  const handleProjectDelete = (deletedProjectId) => {
    console.log('Project deleted:', deletedProjectId);
    
    setUser(prevUser => ({
      ...prevUser,
      projects: prevUser.projects.filter(project => project._id !== deletedProjectId)
    }));
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/accept-friend/${userId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Refresh user data to update friends list and requests
      await fetchUserData();
      
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept friend request: ' + error.message);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/reject-friend/${userId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject friend request');
      }

      // Refresh user data to update requests
      await fetchUserData();
      
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject friend request: ' + error.message);
    }
  };

  const handleRemoveFriend = async (userId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/friend/${userId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove friend');
      }

      // Refresh user data to update friends list
      await fetchUserData();
      
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend: ' + error.message);
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedUser) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUser
    }));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Loading state
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
            <Nevigat name="Profile" />
          </header>
          <br></br>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Profile user={user} />
            <EditProfile user={user} onSave={handleProfileUpdate} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProjectsList 
              projects={user?.projects || []} 
              onProjectDelete={handleProjectDelete}
            />

            <Friends 
              friends={user?.friends || []} 
              friendRequests={friendRequestsDetails}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onRemoveFriend={handleRemoveFriend}
            />
            
            <CreateProject onCreate={handleProjectCreate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;