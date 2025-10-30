// MasGit Admin Signup
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router";
import { Shield } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const lowercaseRegex = /(?=.*[a-z])/;
const uppercaseRegex = /(?=.*[A-Z])/;
const digitRegex = /(?=.*\d)/;
const symbolRegex = /(?=.*[\W_])/;
const minLengthRegex = /^.{9,}$/;

export default function MasGitAdminSignupForm({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    adminCode: ''
  });

  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = [
    { label: "At least one lowercase letter", valid: lowercaseRegex.test(formData.password) },
    { label: "At least one uppercase letter", valid: uppercaseRegex.test(formData.password) },
    { label: "At least one digit", valid: digitRegex.test(formData.password) },
    { label: "At least one symbol (non-word character)", valid: symbolRegex.test(formData.password) },
    { label: "Minimum 9 characters", valid: minLengthRegex.test(formData.password) }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate admin code (you can change this to any secret code)
    if (formData.adminCode !== 'ADMIN001') {
      alert("Invalid admin authorization code!");
      return;
    }

    // Validate email + password
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email format!");
      return;
    }

    if (passwordChecks.some(check => !check.valid)) {
      alert("Password does not meet all requirements!");
      return;
    }

    if (formData.password !== formData.confirm) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'admin' // Set role to admin
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
        navigate('/Admin');
      } else {
        alert('Admin account creation failed: ' + data.message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Sign up error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  function getLabelClass(field) {
    const base = 'absolute left-0 transition-all duration-300 pointer-events-none';
    const isFocusedOrFilled = focusedField === field || formData[field];

    if (isFocusedOrFilled) {
      const color = field === 'email'
        ? (emailRegex.test(formData.email) ? 'text-blue-400' : 'text-red-400')
        : 'text-blue-400';
      return `${base} -top-6 text-sm ${color}`;
    } else {
      return `${base} top-0 text-lg text-gray-400`;
    }
  }

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
          <h1 className="text-3xl font-bold text-white font-mono mb-2">MasGit Admin Signup</h1>
          <p className="text-gray-400">Version Control Administration</p>
        </div>

        {/* Signup Form */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg px-8 py-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Code Field */}
            <div className="relative">
              <label className={getLabelClass('adminCode')}>
                ADMIN CODE
              </label>
              <input
                type="password"
                value={formData.adminCode}
                onChange={(e) => handleInputChange('adminCode', e.target.value)}
                onFocus={() => setFocusedField('adminCode')}
                onBlur={() => setFocusedField('')}
                className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-400 outline-none text-white text-lg py-2 transition-all duration-300 font-mono"
                placeholder="Enter authorization code"
                required
              />
            </div>

            {/* Username Field */}
            <div className="relative">
              <label className={getLabelClass('username')}>
                ADMIN USERNAME
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField('')}
                className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-400 outline-none text-white text-lg py-2 transition-all duration-300 font-mono"
                required
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className={getLabelClass('email')}>
                ADMIN EMAIL
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className={`w-full bg-transparent border-0 border-b-2 outline-none text-white text-lg py-2 transition-all duration-300 font-mono
                  ${emailRegex.test(formData.email) ? "border-blue-400" : "border-red-400"}`}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className={getLabelClass('password')}>
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

              {/* Password validation list */}
              <ul id="validate-password" className="mt-2 text-sm">
                {passwordChecks.map((check, idx) => (
                  <li
                    key={idx}
                    className={`pass ${check.valid ? "text-blue-400" : "text-red-400"}`}
                  >
                    {check.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className={getLabelClass('confirm')}>
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={formData.confirm}
                onChange={(e) => handleInputChange('confirm', e.target.value)}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField('')}
                className={`w-full bg-transparent border-0 border-b-2 outline-none text-white text-lg py-2 transition-all duration-300 font-mono
                  ${formData.confirm && formData.confirm === formData.password ? "border-blue-400" : "border-red-400"}`}
                required
              />
            </div>

            {/* Sign Up Button */}
            <div className="pt-8 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono px-6 py-3 rounded-md transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </button>
            </div>
          </form>

          {/* Back to Admin Login */}
          <div className="mt-8 text-center">
            <Link
              to="/AdminLogin"
              className="text-gray-400 hover:text-white transition-colors font-mono"
            >
              ← Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
