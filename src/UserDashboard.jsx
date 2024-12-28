import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Divider, List, ListItem, ListItemText } from '@mui/material';

const UserDashboard = () => {
  const [audits, setAudits] = useState([]);
  const [registeredAudits, setRegisteredAudits] = useState([]);
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

  const handleRegister = (audit) => {
    if (!registeredAudits.some((item) => item.name === audit.name)) {
      setRegisteredAudits([...registeredAudits, audit]);
    }
  };

  return (
    <Box sx={{ minHeight: '91.5vh', p: 4, bgcolor: '#f9f9f9',color:'black' }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box display="flex" gap={4}>
        <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Available Audits
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {audits.length > 0 ? (
            audits.map((audit, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{audit.name}</Typography>
                  <Typography variant="body2">Location: {audit.location}</Typography>
                  <Typography variant="body2">
                    Coordinates: {audit.coordinates[0]}, {audit.coordinates[1]}
                  </Typography>
                  <Typography variant="body2">Time: {audit.time}</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleRegister(audit)} >
                    Register
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No audits available.</Typography>
          )}
        </Box>

        <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Registered Audits
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {registeredAudits.length > 0 ? (
            <List>
              {registeredAudits.map((audit, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={`Name: ${audit.name}`} secondary={`Location: ${audit.location}, Time: ${audit.time}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No registered audits.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
