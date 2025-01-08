import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/insert_user', {
        username:username,
        password:password,
        name:name,
        contact_info: contactInfo,
        email:'kgf',
      });
      if (response.status === 201) {
        console.log('User registered successfully!');
        nav('/login');
      }
    } catch (error) {
        console.log('Failed to register user. Please try again.');
    }
  };

  const handleback = () => {
    nav('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Register</h1>
          <button
            onClick={handleback}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your username" />
          </div>
  
          <div className="mb-4">
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your password" />
          </div>
  
          <div className="mb-4">
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your full name" />
          </div>
  
          <div className="mb-6">
            <input id="contactInfo" type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your contact information" />
          </div>
  
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" >
            Register
          </button>
        </form>
      </div>
    </div>
  );  
};

export default RegisterPage;
