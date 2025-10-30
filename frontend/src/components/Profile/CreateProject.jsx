// 52_Masanabo
import React, { useState } from "react";
import { FolderPlus, Globe, Tag, Lock, Unlock } from "lucide-react";

const CreateProject = ({ onCreate }) => {
  const [loading, setLoading] = useState(false);
  
  const [projectData, setProjectData] = useState({
    name: '',
    title: '',
    description: '',
    language: 'javascript',
    type: 'web',
    hashtags: '',
    isPrivate: false,
    image: null
  });

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await createProject();
  };

  async function createProject() {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const formData = new FormData();
      
      formData.append('action', 'create_project');
      formData.append('name', projectData.name);
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      formData.append('language', projectData.language);
      formData.append('type', projectData.type);
      formData.append('hashtags', projectData.hashtags);
      formData.append('isPrivate', projectData.isPrivate.toString());
      
      if (projectData.image) {
        formData.append('image', projectData.image);
      }

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      const result = await response.json();
      console.log('Project created successfully:', result);
      
      setProjectData({
        name: '',
        title: '',
        description: '',
        language: 'javascript',
        type: 'web',
        hashtags: '',
        isPrivate: false,
        image: null
      });

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      if (onCreate) {
        onCreate(result.project);
      }
      
      alert('Project created successfully!');
      setLoading(false);
    } catch (err) {
      console.error('Error creating project:', err);
      alert(`Error: ${err.message}`);
      setLoading(false);
    }
  }

  const handleProjectImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProjectData({ ...projectData, image: e.target.files[0] });
    }
  };

  const programmingLanguages = [
    'javascript', 'python', 'java', 'typescript', 'cpp', 'csharp', 'php', 'ruby',
    'go', 'rust', 'swift', 'kotlin', 'html', 'css', 'sql', 'bash'
  ];

  const projectTypes = [
    'web', 'mobile', 'desktop', 'api', 'library', 'cli', 'game', 'ai-ml',
    'data-science', 'iot', 'blockchain', 'other'
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FolderPlus size={20} /> Create New Project
        </h3>
      </div>

      <form onSubmit={handleCreateProject} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. my-awesome-project"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. My Awesome Project"
              value={projectData.title}
              onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Description
          </label>
          <textarea
            placeholder="Describe your project..."
            value={projectData.description}
            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              <Globe size={14} className="inline mr-1" />
              Primary Language
            </label>
            <select
              value={projectData.language}
              onChange={(e) => setProjectData({ ...projectData, language: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
            >
              {programmingLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Project Type
            </label>
            <select
              value={projectData.type}
              onChange={(e) => setProjectData({ ...projectData, type: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
            >
              {projectTypes.map(type => (
                <option key={type} value={type}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            <Tag size={14} className="inline mr-1" />
            Hashtags
          </label>
          <input
            type="text"
            placeholder="e.g. react, nodejs, mongodb (comma separated)"
            value={projectData.hashtags}
            onChange={(e) => setProjectData({ ...projectData, hashtags: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Project Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProjectImageSelect}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={projectData.isPrivate}
                onChange={(e) => setProjectData({ ...projectData, isPrivate: e.target.checked })}
                className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-white flex items-center gap-1">
                {projectData.isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
                Private Project
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!projectData.name.trim() || !projectData.title.trim() || loading}
          className="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded-md text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <FolderPlus size={16} />
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;