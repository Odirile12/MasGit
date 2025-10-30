// 52_Masanabo
import React, { useState, useEffect } from "react";
import { Shield, Users, Folder, Trash2, Edit3, AlertTriangle } from "lucide-react";
import Nevigat from "../components/header/Nav";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', bio: '', email: '', username: '' });

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/projects?filter=Global', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('User deleted successfully');
        fetchUsers();
      } else {
        const error = await response.json();
        alert('Failed to delete user: ' + error.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const deleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete project "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Project deleted successfully');
        fetchProjects();
      } else {
        const error = await response.json();
        alert('Failed to delete project: ' + error.message);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const startEditUser = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name || '',
      bio: user.bio || '',
      email: user.email || '',
      username: user.username || ''
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', bio: '', email: '', username: '' });
  };

  const saveUserEdit = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/${editingUser}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        alert('User updated successfully');
        setEditingUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        alert('Failed to update user: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchProjects()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="px-6 py-4 border-b border-gray-700">
        <Nevigat name="Admin Panel" />
      </header>

      <main className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={32} className="text-red-500" />
              <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-gray-400">Manage users and projects across the platform</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Users size={18} className="inline mr-2" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Folder size={18} className="inline mr-2" />
              Projects ({projects.length})
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users size={20} />
                  User Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user._id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full px-2 py-1 bg-gray-600 rounded text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Username"
                                value={editForm.username}
                                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                className="w-full px-2 py-1 bg-gray-600 rounded text-sm"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                  {user.avatar || user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{user.name}</div>
                                <div className="text-sm text-gray-400">@{user.username}</div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user._id ? (
                            <input
                              type="email"
                              placeholder="Email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="w-full px-2 py-1 bg-gray-600 rounded text-sm"
                            />
                          ) : (
                            <div className="text-sm text-gray-300">{user.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingUser === user._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={saveUserEdit}
                                className="text-green-400 hover:text-green-300"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-400 hover:text-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditUser(user)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => deleteUser(user._id, user.name)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Folder size={20} />
                  Project Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Members</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{project.title || project.name}</div>
                            <div className="text-sm text-gray-400">{project.description?.substring(0, 50)}...</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                {project.owner?.avatar || project.owner?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-white">{project.owner?.name}</div>
                              <div className="text-sm text-gray-400">@{project.owner?.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {project.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {project.membersCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            project.isPrivate
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {project.isPrivate ? 'Private' : 'Public'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteProject(project.id, project.title || project.name)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
