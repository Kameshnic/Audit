import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/users', {
                username:username,
                password:password,
            });
            if (response.data.found) {
                console.log('Login successful!');
                if(username=='jithu'){
                    nav('/admindash',{ state: { auditId: response.data.id } })
                }
                else{
                    nav('/userdash',{ state: { auditId: response.data.id } });
                }
            } else {
                console.log('Invalid username or password.');
            }
        } catch (error) {
            console.log('An error occurred during login.');
        }
    };

    const handleback = () => {
        nav('/');
      }

    const handleSignUp = () => {
        nav('/register');
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Login</h1>
                <button onClick={handleback} className="text-blue-600 hover:text-blue-800 font-medium" >
                  Back
                </button>
              </div>
      
              <form>
                <div className="mb-4">
                  <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your username" />
                </div>
                <div className="mb-6">
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your password" />
                </div>
                <Button onClick={handleLogin} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" >
                  Login
                </Button>
              </form>
      
              <div className="flex justify-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button onClick={handleSignUp} className="text-blue-600 hover:text-blue-800 font-medium" >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
      );       
};

export default Login;