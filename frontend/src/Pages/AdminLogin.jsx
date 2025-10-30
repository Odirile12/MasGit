// MasGit Admin Login
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router";
import { Shield } from 'lucide-react';

export default function MasGitAdminLoginForm({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success && data.user.role === 'admin') {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }

        // Navigate to admin panel
        navigate('/Admin');
      } else if (data.success && data.user.role !== 'admin') {
        alert('Access denied: Admin privileges required');
      } else {
        alert('Sign in failed: ' + data.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Admin Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-600 rounded-full">
              <Shield size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">MasGit Admin</h1>
          <p className="text-gray-400">Version Control Administration</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg px-8 py-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                  focusedField === 'email' || formData.email
                    ? '-top-6 text-sm text-blue-400'
                    : 'top-0 text-lg text-gray-400'
                }`}
              >
                ADMIN EMAIL
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-400 outline-none text-white text-lg py-2 transition-all duration-300 font-mono"
                required
                placeholder="admin@example.com"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                  focusedField === 'password' || formData.password
                    ? '-top-6 text-sm text-blue-400'
                    : 'top-0 text-lg text-gray-400'
                }`}
              >
                PASSWORD
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-400 outline-none text-white text-lg py-2 transition-all duration-300 font-mono"
                required
              />
            </div>

            {/* Sign In Button */}
            <div className="pt-8 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono px-6 py-3 rounded-md transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'Admin Login'}
              </button>
            </div>
          </form>

          {/* Back to Main Login */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors font-mono"
            >
              ← Back to Main Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
