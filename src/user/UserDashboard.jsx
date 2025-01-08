import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Divider, List, ListItem, ListItemText, IconButton} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { FaTrash, FaUser } from 'react-icons/fa';

const UserDashboard = () => {
  const [audits, setAudits] = useState([]);
  const [registeredAudits, setRegisteredAudits] = useState([]);
  const [user, setUser] = useState([]);
  const [newChat, setNewChat] = useState("");
  const [status, setStatus] = useState([]);
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
        setStatus(registeredAudits ? registeredAudits.map(() => false) : []);
        setUser(userDetails);
        setAudits(data);
      } catch (error) {
        console.error('Error fetching audits:', error);
      }
    };
    fetchAudits();
  }, []);

  const handleRegister = async (audit) => {
    if(audit.regstatus=="1"){
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
    }
    else{
      alert('registrations closed');
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

  const handleProf = () => {
    nav('/profile',{ state: { user: user, dash:"user" } });
  }

  const handleAddChat = async (auditId, registrationId) => {
    if (newChat.trim()) {
      setRegisteredAudits((prev) => {
        return prev.map((audit) => {
          if (audit._id === auditId) {
            return {
              ...audit,
              registrations: audit.registrations.map((registration) => {
                if (registration._id === registrationId) {
                  return {
                    ...registration,
                    chat: [...registration.chat, newChat],
                  };
                }
                return registration;
              }),
            };
          }
          return audit;
        });
      });
      try {
        const text = newChat+"&*u";
        const response = await fetch('http://localhost:3000/update_chat', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auditId:auditId,
            registrationId:registrationId,
            text:text,
          }),
        });
    
        if (response.ok) {
          const result = await response.json();
          console.log('Chat updated successfully:', result.message);
        } else {
          const errorData = await response.json();
          console.error('Error updating chat:', errorData.error);
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error pushing chat to API:', error);
        alert('Failed to update chat. Please try again later.');
      }
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

  const handleRegDelete = async (auditid,regid) => {
    try {
      const response = await axios.delete(`http://localhost:3000/audit/${auditid}/registration/${regid}`);
      alert('Registration deleted successfully');
    } catch (error) {
      console.error('Error deleting audit:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-blue-50 w-full">
      <div className="flex items-center justify-between bg-blue-900 p-4 rounded-md text-white shadow-md mb-4">
        <Typography variant="h4" gutterBottom>
          Welcome, {user.username}
        </Typography>
        <div className="space-x-4 flex">
          <Button onClick={handleback}>Back</Button>
          <Button onClick={() => handleDelete(user._id)}>Delete User</Button>
          <FaUser className="top-7 right-7 text-3xl" onClick={handleProf} />
        </div>
      </div>
      <Divider sx={{ mb: 4 }} />

      <Box display="flex" gap={4}>
        <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2, maxWidth:'600px'}}>
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
              registeredAudits.map((audit, index) => {
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
                <List key={index}>
                <div>
                <ListItem>
                  <ListItemText primary={`Name: ${audit.name}`} secondary={`Location: ${audit.location}, Time: ${audit.time}`} />
                  <FaTrash onClick={() => handleRegDelete(audit._id,filtered[0]._id)} className='mr-2'/>
                  <Box width={20} height={20} borderRadius="50%" bgcolor={circleColor} mr={1} />
                  <Box width={70} height={20} border={2} borderColor={circleColor} bgcolor={boxColor} borderRadius={1} >
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ lineHeight: '20px' }} >
                      {filtered[0].status}
                    </Typography>
                  </Box>
                  <IconButton color="primary" onClick={() => handleView(index)}>
                      <ChatIcon />
                    </IconButton>
                </ListItem>
                {status[index] && (
                  <div>
                <div className="w-96 h-[100px] border border-gray-300 rounded-md bg-white p-4 overflow-y-scroll shadow-md mb-2">
                {filtered[0].chat.length > 0 ? (
                  filtered[0].chat.map((chat, inde) => {
                    const [message, alignment] = chat.split("&*");
                    return (
                      <div
                        key={index}
                        className={`p-2 mb-2 text-sm text-gray-800 ${
                          alignment === "u"
                            ? "rounded-md rounded-bl-none bg-green-200 mr-32"
                            : alignment === "a"
                            ? "rounded-md rounded-tr-none bg-red-200 ml-32"
                            : "rounded-md"
                        }`}
                      >
                        {message}
                      </div>
                    );})
                ) : (
                  <div className="text-gray-500 text-sm">No chats available.</div>
                )}
                </div>
                <div className="flex w-96 mb-2">
                  <input type="text" value={newChat} onChange={(e) => setNewChat(e.target.value)} placeholder="Enter your message" className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => handleAddChat(audit._id,filtered[0]._id)} className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600" >
                    Send
                  </button>
                </div>
                </div>
                )}
                <Divider/>
                </div>
                </List>
              );})
          ) : (
            <Typography>No registered audits.</Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UserDashboard;
