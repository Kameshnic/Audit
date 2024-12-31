import React, { useState,useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Divider, Badge } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [audits, setAudits] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
      const fetchAudits = async () => {
        try {
          const response = await fetch('http://localhost:3000/audits');
          const data = await response.json();
          setAudits(data);
        } catch (error) {
          console.error('Error fetching audits:', error);
        }
      };
      fetchAudits();
    }, []);

  const [newAudit, setNewAudit] = useState({
    name: '',
    location: '',
    longitude: '',
    latitude: '',
    time: '',
  });

  const handleAddAudit = async () => {
    if (
      newAudit.name.trim() &&
      newAudit.location.trim() &&
      newAudit.latitude.trim() &&
      newAudit.longitude.trim() &&
      newAudit.time.trim()
    ) {
      const formattedAudit = {
        name: newAudit.name,
        location: newAudit.location,
        coordinates: [newAudit.latitude, newAudit.longitude],
        time: newAudit.time,
        registrations: [],
      };

      try {
        const response = await axios.post('http://localhost:3000/insert_audit', formattedAudit);
        if (response.status === 201) {
          setAudits([...audits, formattedAudit]);
          setNewAudit({ name: '', location: '', longitude: '', latitude: '', time: '' });
        } else {
          console.log('Failed to add audit to the database.');
        }
      } catch (error) {
        console.error('Error adding audit:', error);
        console.log('An error occurred while adding the audit. Please try again.');
      }
    } else {
      console.log('Please fill in all fields before adding an audit.');
    }
  };

  const handleback = () => {
    nav('/');
  }

  return (
    <Box sx={{ minHeight: '91.5vh', p: 4, bgcolor: '#f9f9f9',margin:'-30px'}}>
      <Box display='flex' sx={{minHeight:'11.5vh',color:'black'}}>
        <Typography>
          Welcome,Admin
        </Typography>
        <Button onClick={handleback} sx={{height:'24px'}}>Back</Button>
      </Box>
      <Box display='flex' sx={{minHeight: '80vh',color:'black'}}>
      <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Available Audits
        </Typography>
        <Divider/>
        <List>
        {audits.map((audit, index) => {
          const registeredCount = audit.registrations.filter(
            (registration) => registration.status === 'registered'
          ).length;
          return (
            <ListItem key={index} divider>
              <ListItemText primary={`Name: ${audit.name}`} secondary={`Location: ${audit.location}, Coordinates: (${audit.coordinates.join(', ')}), Time: ${audit.time}`} />
              <Badge badgeContent={registeredCount} color="error" overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right',}}></Badge>
            </ListItem>
          );
        })}
        </List>
      </Box>
      <Box sx={{ flex: 1, p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, ml: 4, }} >
        <Typography variant="h6" gutterBottom>
          Add New Audit
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" noValidate autoComplete="off">
          <TextField label="Audit Name" variant="outlined" fullWidth value={newAudit.name} onChange={(e) => setNewAudit({ ...newAudit, name: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Location" variant="outlined" fullWidth value={newAudit.location} onChange={(e) => setNewAudit({ ...newAudit, location: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Latitude" variant="outlined" fullWidth value={newAudit.latitude} onChange={(e) => setNewAudit({ ...newAudit, latitude: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Longitude" variant="outlined" fullWidth value={newAudit.longitude} onChange={(e) => setNewAudit({ ...newAudit, longitude: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Time" variant="outlined" fullWidth value={newAudit.time} onChange={(e) => setNewAudit({ ...newAudit, time: e.target.value })} sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" onClick={handleAddAudit} fullWidth >
            Add Audit
          </Button>
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
