import React, { useState,useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Divider, Badge,IconButton } from '@mui/material';
import {FaTrash,FaEye} from 'react-icons/fa'
import { CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [audits, setAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [newChat, setNewChat] = useState("");
  const [regCount,setRegCount] = useState(0);
  const [status, setStatus] = useState([]);
  const nav = useNavigate();
  const location = useLocation();
  const { auditId } = location.state || {};
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

    useEffect(() => {
      if (!selectedAudit || regCount<=0) return;
      const UpdateReg = async () => {
        try {
          await axios.put(`http://localhost:3000/update_reg`, {
            auditId: selectedAudit._id,
          });
          console.log('Registration updated successfully.');
        } catch (error) {
          console.error('Error updating registration:', error);
        }
      };
      UpdateReg();
    }, [selectedAudit]);    

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
        regstatus: "1",
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

  const handleReview = (audit,rego) => {
    setSelectedAudit(audit);
    setRegistrations(audit.registrations || []);
    setStatus(audit.registrations ? audit.registrations.map(() => false) : []);
    setRegCount(rego);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/delete_audit/${id}`);
      console.log('Audit deleted successfully', response.data);
    } catch (error) {
      console.error('Error deleting audit:', error);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/user/${id}`);
      console.log('User deleted successfully', response.data);
      nav('/login');
    } catch (error) {
      console.error('Error deleting audit:', error);
    }
  };

  const handleAccept = async (index) => {
    if(registrations.status=='rejected'||registrations.status=='accepted'){
      const updatedRegistrations = [...registrations];
      updatedRegistrations[index].status = 'accepted';
      setRegistrations(updatedRegistrations);
    
      try {
        await axios.put(`http://localhost:3000/update_registration`, {
          auditId: selectedAudit._id,
          registrationId: updatedRegistrations[index]._id,
          status: 'accepted',
        });
        console.log('Registration accepted successfully');
      } catch (error) {
        console.error('Error accepting registration:', error);
        alert('Failed to update registration status. Please try again.');
      }
    }
  };
  
  const handleReject = async (index) => {
    if(registrations.status=='rejected'||registrations.status=='accepted'){
      const updatedRegistrations = [...registrations];
      updatedRegistrations[index].status = 'rejected';
      setRegistrations(updatedRegistrations);
    
      try {
        await axios.put(`http://localhost:3000/update_registration`, {
          auditId: selectedAudit._id,
          registrationId: updatedRegistrations[index]._id,
          status: 'rejected',
        });
        console.log('Registration rejected successfully');
      } catch (error) {
        console.error('Error rejecting registration:', error);
        alert('Failed to update registration status. Please try again.');
      }
    }
  };

  const handleRegStatus = async () => {
    try {
      await axios.put(`http://localhost:3000/update_aureg/${selectedAudit._id}`, {
        regstatus: selectedAudit.regstatus=='1'?'2':'1',
      });
      setSelectedAudit((prevAudit) => ({
        ...prevAudit,
        regstatus: prevAudit.regstatus === '1' ? '2' : '1',
      }));      
      console.log('Registration rejected successfully');
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Failed to update registration status. Please try again.');
    }
  }

  const handleAddChat = (registrationId) => {
    if (newChat.trim()) {
      setRegistrations((prev) =>
        prev.map((registration) =>
          registration._id === registrationId
            ? { ...registration, chat: [...registration.chat, newChat] }
            : registration
        )
      );
      setNewChat("");
    }
  };

  const handleView = (index) => {
    setStatus((prevStatus) => {
      const updatedStatus = [...prevStatus]; // Create a copy of the previous status array
      updatedStatus[index] = !updatedStatus[index]; // Toggle the value at the specific index
      return updatedStatus;
    });
  }

  return (
    <Box sx={{ minHeight: '91.5vh', p: 4, bgcolor: '#f9f9f9',margin:'-30px',width:'1615px',marginLeft:'-200px'}}>
      <Box display='flex' sx={{minHeight:'11.5vh',color:'black'}}>
        <Typography>
          Welcome,Admin
        </Typography>
        <Button onClick={handleback} sx={{height:'24px'}}>Back</Button>
        <Button onClick={() => handleUserDelete(auditId)} sx={{height:'24px'}}>Delete User</Button>
      </Box>
      <Box display='flex' sx={{minHeight: '80vh',color:'black'}}>
      <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2}}>
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
              <FaTrash className="h-5 w-5" onClick={() => handleDelete(audit._id)}/>
              <Button variant='contained' color='primary' sx={{marginRight:'30px',marginLeft:'20px'}} onClick={() => handleReview(audit,registeredCount)} >Review</Button>
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
      {selectedAudit && (
          <Box sx={{ flex: 1, p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, ml: 4 }}>
            <Box display='flex'>
            <Typography variant="h6" gutterBottom>
              Registrations for {selectedAudit.name}
            </Typography>
            <Button onClick={handleRegStatus} >
            {selectedAudit.regstatus=="1" ? "Close" : "Open"}
          </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {registrations.map((registration, index) => (
                <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Name: ${registration.name}`}
                    secondary={`Status: ${registration.status}`}
                  />
                  <IconButton
                    color="success"
                    onClick={() => handleAccept(index)}
                  >
                    <CheckCircle />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleReject(index)}
                  >
                    <Cancel />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleView(index)}
                  >
                    <FaEye/>
                  </IconButton>
                </ListItem>
                {status[index] && (
                  <div>
                <div className="w-96 h-[100px] border border-gray-300 rounded-md bg-white p-4 overflow-y-scroll shadow-md mb-2">
                {registration.chat.length > 0 ? (
                  registration.chat.map((chat, index) => (
                    <div
                      key={index}
                      className="p-2 mb-2 bg-gray-200 rounded-md text-sm text-gray-800"
                    >
                      {chat}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No chats available.</div>
                )}
                </div>
                <div className="flex w-96 mb-2">
                  <input type="text" value={newChat} onChange={(e) => setNewChat(e.target.value)} placeholder="Enter your message" className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => handleAddChat(registration._id)} className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600" >
                    Send
                  </button>
                </div>
                </div>
                )}
                <Divider/>
                </div>
              ))}
            </List>
          </Box>
        )}
        {!selectedAudit && <Box sx={{ flex: 1, p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, ml: 4 }}>
            <Typography variant="h6" gutterBottom>
              Registrations
            </Typography>
            </Box>
            }
      </Box>
    </Box>
  );
};

export default AdminDashboard;
