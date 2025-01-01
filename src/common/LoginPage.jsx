import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

    return (
        <Box sx={{ padding: '20px', borderRadius: '8px', boxShadow: 2, backgroundColor: 'white' }}>
            <Typography variant="h4" gutterBottom sx={{color:'black'}}>
                Login
            </Typography>
            <TextField label="Username" variant="outlined" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }} >
                Login
            </Button>
        </Box>
    );
};

export default Login;