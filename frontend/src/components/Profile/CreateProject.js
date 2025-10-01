import React, { useState } from "react";
import { Link} from "react-router";
import { User, Edit3, Plus, Users } from "lucide-react";


const CreateProject = ({ onCreate }) => {
  const [newProject,setNewProject]=useState({
    name:'',
    title:'',
    description:'',
    language:'',
    type:'',
    hashtags:'',
    isPrivate:'',
    image:''
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newProject);
    setNewProject({    name:'',
    title:'',
    description:'',
    language:'',
    type:'',
    hashtags:'',
    isPrivate:'',
    image:''});
    createProject(newProject);
  };

  async function createProject(projectData) {
  try {
    const token=localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // assuming Bearer token auth
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create project');
    }

    const createdProject = await response.json();
    console.log('Project created:', createdProject);
    window.location.reload(); 
    return createdProject;
  } catch (err) {
    console.error('Error creating project:', err.message);
  }
}

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus size={16} /> Create Project
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
  {/* Project Name */}
  <div>
    <label className="block text-sm font-medium text-white mb-1">Project Name</label>
    <input
      type="text"
      placeholder="Enter project name"
      value={newProject.name}
      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Title */}
  <div>
    <label className="block text-sm font-medium text-white mb-1">Title</label>
    <input
      type="text"
      placeholder="Project title"
      value={newProject.title}
      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Description */}
  <div>
    <label className="block text-sm font-medium text-white mb-1">Description</label>
    <textarea
      placeholder="Brief description of the project"
      value={newProject.description}
      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Language */}
  <div>
    <label className="block text-sm font-medium text-white mb-1">Language</label>
    <input
      type="text"
      placeholder="e.g. JavaScript, Python"
      value={newProject.language}
      onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Type */}
  <div>
    <label className="block text-sm font-medium text-white mb-1">Type</label>
    <input
      type="text"
      placeholder="e.g. web, mobile, game"
      value={newProject.type}
      onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Hashtags */}
  <div>
    <label className="block text-sm font-medium text-white mb-1">Hashtags</label>
    <input
      type="text"
      placeholder="#react #express"
      value={newProject.hashtags}
      onChange={(e) => setNewProject({ ...newProject, hashtags: e.target.value })}
      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Privacy */}
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={newProject.isPrivate}
      onChange={(e) => setNewProject({ ...newProject, isPrivate: e.target.checked })}
      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
    />
    <label className="text-sm text-white">Private Project</label>
  </div>

  {/* Image URL */}
  <div>
    <label className="block text-sm font-medium text-white mb-1">Image URL</label>
    <input
      type="text"
      placeholder="https://example.com/image.png"
      value={newProject.image}
      onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white font-medium"
  >
    Add Project
  </button>
</form>
    </div>
  );
};

export default CreateProject