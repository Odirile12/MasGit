// 52_Masanabo
import React, { useState } from "react";
import { Edit3, CheckCircle, Clock, Lock, Globe } from "lucide-react";
import CheckInModal from "./CheckInModal";

const EditProject = ({ project, onSave, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title || project.name,
    description: project.description,
    language: project.language,
    type: project.type,
    hashtags: project.hashtags?.join(', ') || '',
    isPrivate: project.isPrivate
  });

  const isCheckedOut = project.checkedOutBy && project.checkedOutBy._id;
  const isCheckedOutByCurrentUser = isCheckedOut && project.checkedOutBy._id === currentUserId;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const updateData = {
        ...formData,
        hashtags: formData.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update project');

      const updatedProject = await response.json();
      onSave(updatedProject);
      setIsEditing(false);
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleCheckInSuccess = () => {
    window.location.reload(); // Refresh to show updated status
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Edit3 size={20} />
            Project Management
          </h3>
          
          {isCheckedOutByCurrentUser && (
            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md flex items-center gap-2 transition"
            >
              <CheckCircle size={16} />
              Check In
            </button>
          )}
        </div>

        {/* Check-out Status */}
        {isCheckedOut && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-yellow-400" />
              <span className="text-yellow-300 font-medium">Checked Out</span>
              <span className="text-gray-300">by {project.checkedOutBy.name}</span>
            </div>
            {isCheckedOutByCurrentUser && (
              <p className="text-green-300 text-sm mt-1">
                You have this project checked out. Don't forget to check in when you're done!
              </p>
            )}
          </div>
        )}

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="typescript">TypeScript</option>
                  <option value="html">HTML/CSS</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="web">Web App</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop App</option>
                  <option value="api">API</option>
                  <option value="library">Library</option>
                  <option value="game">Game</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hashtags (comma-separated)
              </label>
              <input
                type="text"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleInputChange}
                placeholder="react, frontend, ui"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                {formData.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                Private Project
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isCheckedOut && !isCheckedOutByCurrentUser}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckedOut && !isCheckedOutByCurrentUser 
              ? 'Project is checked out - editing disabled'
              : 'Edit Project Details'
            }
          </button>
        )}
      </div>

      {/* Check-in Modal */}
      <CheckInModal
        project={project}
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onCheckIn={handleCheckInSuccess}
      />
    </>
  );
};

export default EditProject;