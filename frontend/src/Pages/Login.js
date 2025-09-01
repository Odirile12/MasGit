import React, { useState } from 'react';

export default function GeometricSignInForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });

  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Form Container with backdrop filter */}
      <div className="w-full max-w-md px-8 py-12 backdrop-blur-sm bg-black/30  border border-white/10">
        <div className="space-y-8">
          {/* Username Field */}
          <div className="relative">
            <label 
              className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                focusedField === 'username' || formData.username 
                  ? '-top-6 text-sm text-green-400' 
                  : 'top-0 text-lg text-green-500'
              }`}
            >
              USERNAME
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-green-400 outline-none text-white text-lg py-2 transition-all duration-300"
            />
          </div>

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
            />
          </div>

          {/* Confirm Field */}
          <div className="relative">
            <label 
              className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                focusedField === 'confirm' || formData.confirm 
                  ? '-top-6 text-sm text-green-400' 
                  : 'top-0 text-lg text-green-500'
              }`}
            >
              CONFIRM
            </label>
            <input
              type="password"
              value={formData.confirm}
              onChange={(e) => handleInputChange('confirm', e.target.value)}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField('')}
              className="w-full bg-transparent border-0 border-b-2 border-gray-600 focus:border-green-400 outline-none text-white text-lg py-2 transition-all duration-300"
            />
          </div>

          {/* Sign In Button */}
          <div className="pt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="relative group overflow-hidden px-8 py-3 bg-transparent border-2 border-white text-white transition-all duration-300 hover:text-black"
              style={{
                fontFamily: 'cursive, sans-serif',
                fontSize: '2rem',
                fontWeight: 'bold',
                fontStyle: 'italic'
              }}
            >
              <span className="absolute inset-0 bg-white transform scale-x-0 0 origin-left"></span>
              <span className="relative z-10">LogIn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}