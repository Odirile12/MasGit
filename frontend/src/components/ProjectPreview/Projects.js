import React, { useState } from "react";

const Project = ({ project }) => {

 const sendFriendRequest=async()=> {
  console.log(project.owner)
          const TOKEN = localStorage.getItem("token") || sessionStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/users/friend-request/${project.owner._id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  // return response.json();
}
    return(
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
    <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
    <p className="text-gray-400 mb-4">{project.description}</p>
    <div className="flex items-center justify-between text-sm text-gray-300">
      <span>Owner: {project.owner?.name}</span>
      <button onClick={sendFriendRequest} className="hover:bg-blue-700  rounded-lg p-1  active:bg-green-700">Add Friend</button>
      <span>
        Status: {project.status}
      </span>
    </div>
  </div>)
  };

  export default Project;

