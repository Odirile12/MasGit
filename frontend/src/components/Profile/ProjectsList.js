import React, { useState } from "react";
import { Link } from "react-router";
import { User, Edit3, Plus, Users, Trash2, Folder } from "lucide-react";

const ProjectsList = ({ projects, onProjectDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const deleteProject = async (projectId) => {
    const TOKEN = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    try {
      setDeletingId(projectId);
      
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        if (onProjectDelete) {
          onProjectDelete(projectId);
        }
      } else {
        console.error('Failed to delete project:', result.message);
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Folder size={20} />
        Projects
      </h3>
      <ul className="space-y-3">
        {projects?.map((p, i) => (
          <li key={i} className="bg-gray-700 p-3 rounded-md flex justify-between items-start">
            <div className="flex-1">
              <Link 
                to={`/project/${p?._id}`}
                className="font-semibold text-blue-400 hover:text-blue-300 block mb-1"
              >
                {p?.name || ''}
              </Link>
              <p className="text-gray-400 text-sm">{p?.description || ''}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span>Language: {p?.language}</span>
                <span>Files: {p?.files?.length || 0}</span>
              </div>
            </div>
            <button
              onClick={() => handleDeleteClick(p?._id, p?.name)}
              disabled={deletingId === p?._id}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${deletingId === p?._id 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
                }
              `}
            >
              <Trash2 size={16} />
              {deletingId === p?._id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      
      {(!projects || projects.length === 0) && (
        <div className="text-center text-gray-400 py-8">
          <Folder size={48} className="mx-auto mb-2 opacity-50" />
          <p>No projects yet</p>
          <p className="text-sm mt-1">Create your first project to get started</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;