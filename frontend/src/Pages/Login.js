import React, { useState } from 'react';
import {Link} from  "react-router";


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


          {/* Sign In Button */}
          <div className="pt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="hover:text-black"
              style={{
                fontFamily: 'cursive, sans-serif',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              
              <span className="relative z-10"><Link to ="/Home" className=" text-6xl font-extralight p-3 font-sans hover:bg-[rgba(255,255,255,0.22)] text-white" >Login</Link></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}