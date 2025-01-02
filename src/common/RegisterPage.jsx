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
    <Container maxWidth="sm" sx={{ marginTop: '50px' }}>
      <Box sx={{ padding: '20px', borderRadius: '8px', boxShadow: 2, backgroundColor: 'white' }}>
        <div style={{display:'flex'}}>
          <Typography variant="h4" align="center" gutterBottom sx={{color:'black'}}>
            Register
          </Typography>
          <Button onClick={handleback}>Back</Button>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" variant="outlined" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <TextField label="Name" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Contact Info" variant="outlined" fullWidth margin="normal" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '20px' }} >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
