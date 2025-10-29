import React, { useState } from "react";
import { Link} from "react-router";
import { User, Edit3, Plus, Users, Camera, Upload } from "lucide-react";


const EditProfile = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    avatar: user.avatar || null
  });
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('bio', formData.bio);

      if (formData.avatar && typeof formData.avatar !== 'string') {
        formDataToSend.append('avatar', formData.avatar);
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();

      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      if (onSave) {
        onSave(updatedUser);
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Generate random placeholder avatar
  const getRandomAvatar = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const initials = formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    const colorIndex = formData.name ? formData.name.length % colors.length : Math.floor(Math.random() * colors.length);
    return { initials, color: colors[colorIndex] };
  };

  const avatarData = getRandomAvatar();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Edit3 size={20} />
        Edit Profile
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload Section */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            {/* Current Avatar Display */}
            <div className="relative">
              {formData.avatar && typeof formData.avatar === 'string' ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                />
              ) : formData.avatar && typeof formData.avatar !== 'string' ? (
                <img
                  src={URL.createObjectURL(formData.avatar)}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2 border-gray-600"
                  style={{ backgroundColor: avatarData.color }}
                >
                  {avatarData.initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => document.getElementById('avatar-input').click()}
                className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer
                ${dragOver ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600 hover:border-gray-500'}`}
              onClick={() => document.getElementById('avatar-input').click()}
            >
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-400">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>

            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
            placeholder="Enter your full name"
          />
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
            placeholder="Enter your username"
          />
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-600"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded-md text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};


export default EditProfile
