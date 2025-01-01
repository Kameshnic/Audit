import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Divider, List, ListItem, ListItemText, IconButton} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';

const UserDashboard = () => {
  const [audits, setAudits] = useState([]);
  const [registeredAudits, setRegisteredAudits] = useState([]);
  const [user, setUser] = useState([]);
  const nav = useNavigate();
  const location = useLocation();
  const { auditId } = location.state || {};
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await fetch('http://localhost:3000/audits');
        const userDetailsResponse = await fetch(`http://localhost:3000/user_details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ id: auditId })});
        const userDetails = await userDetailsResponse.json();
        const resp = await fetch(`http://localhost:3000/search_audits?name=${userDetails.username}`);
        const data = await response.json();
        const data1 = await resp.json();
        setRegisteredAudits(data1);
        setUser(userDetails);
        setAudits(data);
      } catch (error) {
        console.error('Error fetching audits:', error);
      }
    };
    fetchAudits();
  }, []);

  const handleRegister = async (audit) => {
    if (!registeredAudits.some((item) => item.name === audit.name)) {
      try {
        audit.registrations.push({name: user.username, status: 'registered', chat: []});
        setRegisteredAudits([...registeredAudits, audit]);
        const response = await fetch(`http://localhost:3000/update_audit/${audit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            newRegistration: {name:user.username,status:'registered',chat:[]},
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update audit:', errorData.message);
          return;
        }
        const updatedAudit = await response.json();
        console.log('Audit updated successfully:', updatedAudit);
      } catch (error) {
        console.error('Error updating audit:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/user/${id}`);
      console.log('User deleted successfully', response.data);
      nav('/login');
    } catch (error) {
      console.error('Error deleting audit:', error);
    }
  };

  const handleback = () => {
    nav('/');
  }

  return (
    <Box sx={{ minHeight: '91.5vh', p: 4, bgcolor: '#f9f9f9',color:'black' }}>
      <Box display="flex">
        <Typography variant="h4" gutterBottom>
          Welcome, {user.username}
        </Typography>
        <Button onClick={handleback}>Back</Button>
        <Button onClick={() => handleDelete(user._id)}>Delete User</Button>
      </Box>
      <Divider sx={{ mb: 4 }} />

      <Box display="flex" gap={4}>
        <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2, width:'1000px'}}>
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

        <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2, width:'200px' }}>
          <Typography variant="h6" gutterBottom>
            Registered Audits
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {registeredAudits.length > 0 ? (
            <List>
              {registeredAudits.map((audit, index) => {
                  const filtered = audit.registrations.filter(
                    (registration) => registration.name === user.username
                  );
                  let circleColor, boxColor;
                  switch (filtered[0].status) {
                    case 'registered':
                      circleColor = 'yellow';
                      boxColor = 'lightyellow';
                      break;
                    case 'accepted':
                      circleColor = 'green';
                      boxColor = 'lightgreen';
                      break;
                    case 'rejected':
                      circleColor = 'red';
                      boxColor = 'lightcoral';
                      break;
                    default:
                      circleColor = 'grey';
                      boxColor = 'lightgray';
                  }
                return(
                <ListItem key={index} divider>
                  <ListItemText primary={`Name: ${audit.name}`} secondary={`Location: ${audit.location}, Time: ${audit.time}`} />
                  <Box width={20} height={20} borderRadius="50%" bgcolor={circleColor} mr={1} />
                  <Box width={70} height={20} border={2} borderColor={circleColor} bgcolor={boxColor} borderRadius={1} >
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ lineHeight: '20px' }} >
                      {filtered[0].status}
                    </Typography>
                  </Box>
                  <IconButton color="primary">
                      <ChatIcon />
                    </IconButton>
                </ListItem>
              );})}
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
