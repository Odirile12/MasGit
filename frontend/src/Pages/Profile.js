import React, { useState, useEffect } from "react";
import { User, Edit3, Plus, Users } from "lucide-react";

import Friends from "../components/Profile/Friends";
import EditProfile from "../components/Profile/EditProfile";
import CreateProject from "../components/Profile/CreateProject";
import ProjectsList from "../components/Profile/ProjectsList";
import Profile from "../components/Profile/Profile";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
    project: []
  });

  const [projects, setProjects] = useState([
    { id: 1, name: "Student Portal", description: "React + Node.js app" },
    { id: 2, name: "ML Tool", description: "Machine learning toolkit" },
  ]);

  const [projects2, setProjects2] = useState([]);

  const handleProjectDelete = (deletedProjectId) => {
  setProjects2(prevProjects => 
    prevProjects.filter(project => project._id !== deletedProjectId)
  );
};

  const [data, setData] = useState(null);
  const [details, setDetails] = useState(null);
  const [friendRequestsDetails, setFriendRequestsDetails] = useState({ received: [] });

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getAuthUserId = () => {
    let UserId = localStorage.getItem('user') || sessionStorage.getItem('user');
    console.log(UserId);
    return JSON.parse(UserId);
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('Authentication required');
        return;
      }
      const userId = getAuthUserId().id;
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // Fetch user profile
      const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser(userData);
      setDetails(userData);

      // Fetch friend request details
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

      // Fetch user activities
      const activitiesResponse = await fetch(`http://localhost:5000/api/activities/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        return activitiesData;
      } else {
        throw new Error('Failed to fetch user activities');
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
    }
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
      alert('Failed to accept friend request');
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
      alert('Failed to reject friend request');
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
      alert('Failed to remove friend');
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const result = await fetchUserData();
      console.log("User Activities: ", result);
      setData(result);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (details) {
      console.log("Updated User Details: ", details);
      setUser(details);
    }
  }, [details]);

  console.log("Profile User: ", user?.friends?.[0]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {console.log("project details" + JSON.stringify(details?.projects[0]))}
        <div className="flex-1 space-y-6">
          <Profile user={user} />
          <EditProfile user={user} onSave={setUser} />
        </div>

        <div className="flex-1 space-y-6">
          <ProjectsList projects={details?.projects} onProjectDelete={handleProjectDelete}/>

          <Friends 
            friends={user?.friends} 
            friendRequests={friendRequestsDetails}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onRemoveFriend={handleRemoveFriend}
          />
          
          <CreateProject
            onCreate={(newProject) =>
              setProjects([...projects, { ...newProject, id: Date.now() }])
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;