// import React, { useState } from "react";

// const Project = ({ project }) => {

//  const sendFriendRequest=async()=> {
//   console.log(project.owner)
//           const TOKEN = localStorage.getItem("token") || sessionStorage.getItem("token");
//   const response = await fetch(`http://localhost:5000/api/users/friend-request/${project.owner._id}`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${TOKEN}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   // return response.json();
// }
//     return(
//   <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
//     <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
//     <p className="text-gray-400 mb-4">{project.description}</p>
//     <div className="flex items-center justify-between text-sm text-gray-300">
//       <span>Owner: {project.owner?.name}</span>
//       <button onClick={sendFriendRequest} className="hover:bg-blue-700  rounded-lg p-1  active:bg-green-700">Add Friend</button>
//       <span>
//         Status: {project.status}
//       </span>
//     </div>
//   </div>)
//   };

//   export default Project;

import React, { useState } from "react";
import { CheckCircle, Clock, Users, Lock, Unlock } from "lucide-react";

const Project = ({ project }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

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
      window.location.reload(); // Refresh to show updated status
    } catch (error) {
      console.error('Error checking out project:', error);
      alert('Failed to check out project: ' + error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isCheckedOut = project.checkedOutBy && project.checkedOutBy._id;
  const isCheckedOutByCurrentUser = false; // You'll need to get current user ID from context/props

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

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={16} />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
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
      {!isCheckedOut && (
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
      {isCheckedOutByCurrentUser && (
        <div className="mt-3 p-3 bg-yellow-600/20 border border-yellow-600 rounded-lg">
          <p className="text-yellow-300 text-sm">
            You have this project checked out. Ready to check in your changes?
          </p>
        </div>
      )}
    </div>
  );
};

export default Project;

