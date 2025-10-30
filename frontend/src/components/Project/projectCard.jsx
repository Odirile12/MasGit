import React, { useState } from 'react';
import { Link} from "react-router";


const ProjectCard = ({ project }) => {
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-400',
      Python: 'bg-blue-500',
      TypeScript: 'bg-blue-600',
      CSS: 'bg-purple-500',
      HTML: 'bg-orange-500'
    };
    return colors[language] || 'bg-gray-400';
  };

  return (
    
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
          {project.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">
              <Link to={`../Project/${project.id}`} className="px-3 py-2 rounded-md hover:bg-gray-700 transition">
                {project.name}
              </Link>
            </h3>
            {project.isPrivate && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                Private
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-3">
            {project.description}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
              <span>{project.language}</span>
            </div>
            <span>Updated {project.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;