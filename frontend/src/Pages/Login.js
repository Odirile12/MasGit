import React, { useState } from 'react';
import { Link, useNavigate } from "react-router";

export default function GeometricSignInForm({ onAuthSuccess }) {
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
        // Store user data in localStorage
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
    <div className="w-full max-w-md px-8 py-12 backdrop-blur-sm bg-black/30  border border-white/10">
        <div className="space-y-8">

          {/* Email Field */}
          <div className="relative">
            <label 
              className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                focusedField === 'email' || formData.email 
                  ? '-top-6 text-sm text-green-400' 
                  : 'top-0 text-lg text-green-500'
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
              className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-green-400 outline-none text-white text-lg py-2 transition-all duration-300"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label 
              className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                focusedField === 'password' || formData.password 
                  ? '-top-6 text-sm text-green-400' 
                  : 'top-0 text-lg text-green-500'
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
              className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-green-400 outline-none text-white text-lg py-2 transition-all duration-300"
              required
            />
          </div>

          {/* Sign In Button */}
          <div className="pt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="hover:text-black"
              style={{
                fontFamily: 'cursive, sans-serif',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              {isLoading ? (
                <span className="text-white">Loading...</span>
              ) : (
                <span className="relative z-10 text-6xl font-extralight p-3 font-sans hover:bg-[rgba(255,255,255,0.22)] text-white">
                  Login
                </span>
              )}
            </button>
          </div>
          
        
        </div>
      </div>
  );
}
