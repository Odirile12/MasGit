import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Users, Lock, Unlock, UserPlus, UserCheck, UserX } from "lucide-react";

const Project = ({ project, currentUserId }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [friendStatus, setFriendStatus] = useState('none'); 
  const [isLoadingFriendStatus, setIsLoadingFriendStatus] = useState(false);

  useEffect(() => {
    if (currentUserId && project.owner && project.owner._id !== currentUserId) {
      checkFriendStatus();
    }
  }, [currentUserId, project.owner]);

  const checkFriendStatus = async () => {
    try {
      setIsLoadingFriendStatus(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        if (userData.friends && userData.friends.some(friend => friend._id === project.owner._id)) {
          setFriendStatus('friends');
        }
        else if (userData.friendRequests?.sent && userData.friendRequests.sent.includes(project.owner._id)) {
          setFriendStatus('pending');
        }
        else if (userData.friendRequests?.received && userData.friendRequests.received.includes(project.owner._id)) {
          setFriendStatus('requested');
        }
        else {
          setFriendStatus('none');
        }
      }
    } catch (error) {
      console.error('Error checking friend status:', error);
    } finally {
      setIsLoadingFriendStatus(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/projects/${project._id}/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to check out project');
      
      alert('Project checked out successfully! You can now make changes.');
      window.location.reload();
    } catch (error) {
      console.error('Error checking out project:', error);
      alert('Failed to check out project: ' + error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/users/friend-request/${project.owner._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send friend request');
      }

      setFriendStatus('pending');
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request: ' + error.message);
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/users/reject-friend/${project.owner._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel friend request');
      }

      setFriendStatus('none');
      alert('Friend request cancelled!');
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      alert('Failed to cancel friend request: ' + error.message);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/users/friend/${project.owner._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove friend');
      }

      setFriendStatus('none');
      alert('Friend removed successfully!');
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend: ' + error.message);
    }
  };

  const isCheckedOut = project.checkedOutBy && project.checkedOutBy._id;
  const isOwner = currentUserId && project.owner && project.owner._id === currentUserId;
  const isMember = currentUserId && project.members && project.members.some(member => member._id === currentUserId);

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{project.title || project.name}</h2>
        
        {/* Check-out Status Badge */}
        {isCheckedOut ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-sm">
            <Lock size={16} />
            <span>Checked Out</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-600 rounded-full text-sm">
            <Unlock size={16} />
            <span>Available</span>
          </div>
        )}
      </div>

      <p className="text-gray-300 mb-4">{project.description}</p>

      {/* Project Owner Info */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={project.owner.avatar || "/default-avatar.png"} 
              alt={project.owner.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">{project.owner.name}</p>
              <p className="text-gray-400 text-sm">@{project.owner.username}</p>
              <p className="text-gray-500 text-xs">Project Owner</p>
            </div>
          </div>
          
          {/* Friend Request Button */}
          {!isOwner && currentUserId && (
            <div>
              {isLoadingFriendStatus ? (
                <div className="px-3 py-2 bg-gray-600 rounded-md">
                  <span className="text-gray-300">Loading...</span>
                </div>
              ) : (
                <>
                  {friendStatus === 'none' && (
                    <button
                      onClick={handleFriendRequest}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition"
                    >
                      <UserPlus size={16} />
                      <span>Add Friend</span>
                    </button>
                  )}
                  {friendStatus === 'pending' && (
                    <button
                      onClick={handleCancelFriendRequest}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-md transition"
                    >
                      <UserX size={16} />
                      <span>Cancel Request</span>
                    </button>
                  )}
                  {friendStatus === 'friends' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded-md">
                        <UserCheck size={16} />
                        <span>Friends</span>
                      </div>
                      <button
                        onClick={handleRemoveFriend}
                        className="text-xs text-red-400 hover:text-red-300 transition"
                      >
                        Remove Friend
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Members */}
      {project.members && project.members.length > 0 && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-gray-300 font-medium">Project Members</span>
            <span className="text-gray-500 text-sm">({project.members.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.members.map((member, index) => (
              <div key={index} className="flex items-center gap-2 px-2 py-1 bg-gray-600 rounded-md">
                <img 
                  src={member.avatar || "/default-avatar.png"} 
                  alt={member.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-white text-sm">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Check-out Information */}
      {isCheckedOut && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-300 mb-1">
            <Clock size={16} />
            <span className="font-medium">Currently checked out by:</span>
          </div>
          <div className="flex items-center gap-2">
            <img 
              src={project.checkedOutBy.avatar} 
              alt={project.checkedOutBy.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-white">{project.checkedOutBy.name}</span>
            <span className="text-gray-400 text-sm">
              since {new Date(project.checkedOutAt).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Check-out Button */}
      {!isCheckedOut && !isOwner && (isMember || !project.isPrivate) && (
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <Lock size={16} />
          {isCheckingOut ? 'Checking Out...' : 'Check Out Project'}
        </button>
      )}

      {/* Check-in Prompt */}
      {isCheckedOut && currentUserId && project.checkedOutBy._id === currentUserId && (
        <div className="mt-3 p-3 bg-yellow-600/20 border border-yellow-600 rounded-lg">
          <p className="text-yellow-300 text-sm">
            You have this project checked out. Ready to check in your changes?
          </p>
        </div>
      )}

      {/* Owner Notice */}
      {isOwner && (
        <div className="mt-3 p-3 bg-blue-600/20 border border-blue-600 rounded-lg">
          <p className="text-blue-300 text-sm">
            You are the owner of this project. You can edit project details and manage members.
          </p>
        </div>
      )}
    </div>
  );
};

export default Project;