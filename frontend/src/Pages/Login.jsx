// MasGit Login
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router";

export default function MasGitLoginForm({ onAuthSuccess }) {
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

      if (data.success) {
        console.log("Data: "+data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }

        // Navigate to feed
        navigate('/Feed');
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
    <div className="w-full max-w-md px-8 py-12 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white font-mono">MasGit</h1>
        <p className="text-gray-400 text-sm mt-2">Version Control for Your Projects</p>
      </div>
      <div className="space-y-6">

        {/* Email Field */}
        <div className="relative">
          <label
            className={`absolute left-0 transition-all duration-300 pointer-events-none ${
              focusedField === 'email' || formData.email
                ? '-top-6 text-sm text-blue-400'
                : 'top-0 text-lg text-gray-400'
            }`}
          >
            EMAIL
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-400 outline-none text-white text-lg py-2 transition-all duration-300 font-mono"
            required
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-mono px-6 py-3 rounded-md transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </div>


      </div>
    </div>
  );
}
