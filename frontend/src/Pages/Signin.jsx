import React, { useState } from 'react'; 
import { Link, useNavigate } from "react-router";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const lowercaseRegex = /(?=.*[a-z])/;
const uppercaseRegex = /(?=.*[A-Z])/;
const digitRegex = /(?=.*\d)/;
const symbolRegex = /(?=.*[\W_])/;
const minLengthRegex = /^.{9,}$/;

export default function SignUpForm({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
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
          password: formData.password
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
        navigate('/Feed');
      } else {
        alert('Sign up failed: ' + data.message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Sign up error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };
  
  function getLabelClass() {
    const base = 'absolute left-0 transition-all duration-300 pointer-events-none';
    const isFocusedOrFilled = focusedField === 'email' || formData.email;

    if (isFocusedOrFilled) {
      const color = emailRegex.test(formData.email) ? 'text-green-400' : 'text-red-400';
      return `${base} -top-6 text-sm ${color}`;
    } else {
      return `${base} top-0 text-lg text-green-500`;
    }
  }

  return (
    <div className="w-full max-w-md px-8 py-12 backdrop-blur-sm bg-black/30 border border-white/10">
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
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <label className={getLabelClass()}>
              EMAIL
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              className={`w-full bg-transparent border-0 border-b-2 outline-none text-white text-lg py-2 transition-all duration-300
                ${emailRegex.test(formData.email) ? "border-green-400" : "border-red-400"}`}
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

            {/* Password validation list */}
            <ul id="validate-password" className="mt-2 text-sm">
              {passwordChecks.map((check, idx) => (
                <li 
                  key={idx} 
                  className={`pass ${check.valid ? "text-green-400" : "text-red-400"}`}
                >
                  {check.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <label 
              className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                focusedField === 'confirm' || formData.confirm 
                  ? '-top-6 text-sm text-green-400' 
                  : 'top-0 text-lg text-green-500'
              }`}
            >
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={formData.confirm}
              onChange={(e) => handleInputChange('confirm', e.target.value)}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField('')}
              className={`w-full bg-transparent border-0 border-b-2 outline-none text-white text-lg py-2 transition-all duration-300
                ${formData.confirm && formData.confirm === formData.password ? "border-green-400" : "border-red-400"}`}
              required
            />
          </div>

          <div className="pt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="hover:text-black text-white"
              style={{
                fontFamily: 'cursive, sans-serif',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              {isLoading ? (
                <span className="text-white">Creating account...</span>
              ) : (
                <span className="relative z-10 text-6xl font-extralight p-3 font-sans hover:bg-[rgba(255,255,255,0.22)] text-white">
                  Sign Up
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
  );
}
