import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    contactInfo: '',
    email: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const nav = useNavigate();

  // Handle input change dynamically
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, and 1 number
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and include a number, an uppercase, and a lowercase letter.'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      return;
    }

    try {
      const response = await axios.post('https://auditapi-qsiu.onrender.com/insert_user', {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        contact_info: formData.contactInfo,
        email: formData.email,
      });
      if (response.status === 201) {
        console.log('User registered successfully!');
        nav('/login');
      }
    } catch (error) {
      console.error('Failed to register user. Please try again.');
    }
  };

  const handleBack = () => {
    nav('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Register</h1>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-4">
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                validatePassword(e.target.value);
              }}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <input
              id="contactInfo"
              type="text"
              value={formData.contactInfo}
              onChange={handleChange}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your contact information"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
