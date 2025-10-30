// 52_Masanabo
import React, { useState } from "react";
import { Link } from "react-router";
import { User, Edit3, Plus, Users, Trash2, Folder, Grid, List } from "lucide-react";

const ProjectsList = ({ projects, onProjectDelete }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

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

  const ProjectCard = ({ project }) => (
    <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <Link
          to={`/project/${project?._id}`}
          className="font-semibold text-blue-400 hover:text-blue-300 block flex-1"
        >
          {project?.name || ''}
        </Link>
        <button
          onClick={() => handleDeleteClick(project?._id, project?.name)}
          disabled={deletingId === project?._id}
          className={`
            flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ml-2
            ${deletingId === project?._id
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
            }
          `}
        >
          <Trash2 size={12} />
          {deletingId === project?._id ? '...' : ''}
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {project?.description || 'No description available'}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {project?.hashtags?.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
        {project?.hashtags?.length > 3 && (
          <span className="text-xs text-gray-500">+{project.hashtags.length - 3} more</span>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{project?.language || 'Unknown'}</span>
        <span>{project?.files?.length || 0} files</span>
        <span>{project?.members?.length || 1} members</span>
      </div>
    </div>
  );

  const ProjectListItem = ({ project }) => (
    <li className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={`/project/${project?._id}`}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              {project?.name || ''}
            </Link>
            <div className="flex gap-1">
              {project?.hashtags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-2 line-clamp-1">
            {project?.description || 'No description available'}
          </p>

          <div className="flex gap-4 text-xs text-gray-500">
            <span>Language: {project?.language || 'Unknown'}</span>
            <span>Files: {project?.files?.length || 0}</span>
            <span>Members: {project?.members?.length || 1}</span>
          </div>
        </div>

        <button
          onClick={() => handleDeleteClick(project?._id, project?.name)}
          disabled={deletingId === project?._id}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ml-4
            ${deletingId === project?._id
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
            }
          `}
        >
          <Trash2 size={16} />
          {deletingId === project?._id ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Folder size={20} />
          Projects ({projects?.length || 0})
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {projects && projects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {projects.map((project, i) => (
              <ProjectListItem key={i} project={project} />
            ))}
          </ul>
        )
      ) : (
        <div className="text-center text-gray-400 py-12">
          <Folder size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No projects yet</p>
          <p className="text-sm">Create your first project to get started</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
