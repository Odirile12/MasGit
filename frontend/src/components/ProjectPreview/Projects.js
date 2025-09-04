import React, { useState } from "react";

const Project = ({ project }) => {
    return(
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
    <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
    <p className="text-gray-400 mb-4">{project.description}</p>
    <div className="flex items-center justify-between text-sm text-gray-300">
      <span>Owner: {project.owner}</span>
      <span>
        Status: <span className="text-green-400">{project.status}</span>
      </span>
    </div>
  </div>)
  };

  export default Project;

