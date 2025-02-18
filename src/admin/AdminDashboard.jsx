import React, { useState,useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Divider, Badge,IconButton } from '@mui/material';
import {FaTrash,FaEye} from 'react-icons/fa'
import { CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents,useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AdminDashboard = () => {
  const [audits, setAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [newChat, setNewChat] = useState("");
  const [regCount,setRegCount] = useState(0);
  const [status, setStatus] = useState([]);
  const [locatio, setLocatio] = useState([20.5937, 78.9629]);
  const [suggestions, setSuggestions] = useState([]);
  const [address, setAddress] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  const { auditId } = location.state || {};
  useEffect(() => {
      const fetchAudits = async () => {
        try {
          const response = await fetch('https://auditapi-qsiu.onrender.com/audits');
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
          await axios.put(`https://auditapi-qsiu.onrender.com/update_reg`, {
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
        const response = await axios.post('https://auditapi-qsiu.onrender.com/insert_audit', formattedAudit);
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
      const response = await axios.delete(`https://auditapi-qsiu.onrender.com/delete_audit/${id}`);
      console.log('Audit deleted successfully', response.data);
    } catch (error) {
      console.error('Error deleting audit:', error);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      const response = await axios.delete(`https://auditapi-qsiu.onrender.com/user/${id}`);
      console.log('User deleted successfully', response.data);
      nav('/login');
    } catch (error) {
      console.error('Error deleting audit:', error);
    }
  };

  const handleAccept = async (index) => {
    if(registrations.status!='rejected' && registrations.status!='accepted'){
      const updatedRegistrations = [...registrations];
      updatedRegistrations[index].status = 'accepted';
      setRegistrations(updatedRegistrations);
    
      try {
        await axios.put(`https://auditapi-qsiu.onrender.com/update_registration`, {
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
    if(registrations.status!='rejected' && registrations.status!='accepted'){
      const updatedRegistrations = [...registrations];
      updatedRegistrations[index].status = 'rejected';
      setRegistrations(updatedRegistrations);
    
      try {
        await axios.put(`https://auditapi-qsiu.onrender.com/update_registration`, {
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
      await axios.put(`https://auditapi-qsiu.onrender.com/update_aureg/${selectedAudit._id}`, {
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

  const handleAddChat = async (registrationId) => {
    if (newChat.trim()) {
      setRegistrations((prev) =>
        prev.map((registration) =>
          registration._id === registrationId
            ? { ...registration, chat: [...registration.chat, newChat] }
            : registration
        )
      );
      try {
        const text = newChat+"&*a";
        const response = await fetch('https://auditapi-qsiu.onrender.com/update_chat', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auditId:selectedAudit._id,
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
      const updatedStatus = [...prevStatus];
      updatedStatus[index] = !updatedStatus[index];
      return updatedStatus;
    });
  }

  const MapClick = () => {
    useMapEvents({
      click(e) {
        setLocatio([e.latlng.lat, e.latlng.lng]);
        newAudit.latitude = e.latlng.lat;
        newAudit.longitude = e.latlng.lng;
      },
    });
    return null;
  };

  const ChangeMapCenter = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(location, map.getZoom());
    }, [location, map]);
    return null;
    };

    useEffect(() => {
      if (newAudit.latitude && newAudit.longitude) {
        setLocatio([newAudit.latitude, newAudit.longitude]);
      }
    }, [newAudit.latitude, newAudit.longitude]);

    const setSuggestion = async () => {
      if (!address) {
        alert("Please enter an address.");
        return;
      }
  
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
        );
        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          handleSuggestionClick(lat,lon);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        alert("An error occurred while fetching the location.");
      }
    };

    const fetchSuggestions = async (query) => {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        setSuggestions(res.data);
      } catch (error) {
        console.error('Error fetching suggestions', error);
      }
    };
  
    const handleInputChange = (e) => {
      setAddress(e.target.value);
      if (e.target.value.length > 2) {
        fetchSuggestions(e.target.value);
      } else {
        setSuggestions([]);
      }
    };
  
    const handleSuggestionClick = (lat, lon) => {
      setLocatio([lat, lon]);
      newAudit.latitude = lat;
      newAudit.longitude = lon;
      setSuggestions([]);
    };

  return (
    <div className="min-h-screen p-4 bg-blue-50 w-full">
      <div className="flex items-center justify-between bg-blue-900 p-4 rounded-md text-white shadow-md mb-4">
        <Typography className="text-xl font-semibold">
          Welcome, Admin
          </Typography>
        <div className="space-x-4">
          <Button onClick={handleback} sx={{ height: '24px' }}>Back</Button>
          <Button onClick={() => handleUserDelete(auditId)} sx={{ height: '24px' }}>Delete User</Button>
        </div>
      </div>
      <Box display="flex" sx={{ minHeight: '80vh', flexDirection: { xs: 'column', md: 'row' }, gap: 2, color: 'black' }}>
        <Box sx={{ flex: 1, p: 2, bgcolor: 'white', boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Available Audits
            </Typography>
          <Divider />
          <List>
            {audits.map((audit, index) => {
              const registeredCount = audit.registrations.filter((registration) => registration.status === 'registered').length;
              return (
                <ListItem key={index} divider>
                  <ListItemText primary={`Name: ${audit.name}`} secondary={`Location: ${audit.location}, Coordinates: (${audit.coordinates.join(', ')}), Time: ${audit.time}`} />
                  <FaTrash className="h-5 w-5" onClick={() => handleDelete(audit._id)} />
                  <Button variant="contained" color="primary" sx={{ marginRight: '30px', marginLeft: '20px' }} onClick={() => handleReview(audit, registeredCount)}>Review</Button>
                  <Badge badgeContent={registeredCount} color="error" overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}></Badge>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box sx={{ flex: 1, p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, ml: { xs: 0, md: 4 } }}>
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
            <div style={{ display: "flex", gap: '10px' }}>
              <TextField fullWidth label="Address" value={address} margin="normal" variant="outlined" onChange={handleInputChange} style={{ marginTop: '0px' }} />
              <Button variant="contained" color="primary" onClick={setSuggestion} style={{ marginTop: '6px', height: '40px' }}>Locate</Button>
            </div>
            <ul style={{ position: 'relative', width: '300px', maxHeight: '200px', overflowY: 'auto', backgroundColor: 'white', borderRadius: '5px', zIndex: 1000, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', padding: '0', margin: '0', listStyleType: 'none', scrollbarWidth: 'none' }}>
              {suggestions.map((suggestion) => (
                <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion.lat, suggestion.lon)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ccc', transition: 'background-color 0.2s ease', backgroundColor: 'black', color: 'white' }} onMouseEnter={(e) => (e.target.style.backgroundColor = 'gray')} onMouseLeave={(e) => (e.target.style.backgroundColor = 'black')}>
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
            <MapContainer center={locatio} zoom={13} style={{ height: '250px', width: { xs: '100%', md: '500px' }, marginBottom: '10px' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClick />
              <Marker position={locatio}></Marker>
              <ChangeMapCenter location={locatio} />
            </MapContainer>
            <Button variant="contained" color="primary" onClick={handleAddAudit} fullWidth>Add Audit</Button>
          </Box>
        </Box>
        {selectedAudit && (
          <Box sx={{ flex: 1, p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, ml: { xs: 0, md: 4 } }}>
            <Box display="flex">
              <Typography variant="h6" gutterBottom>Registrations for {selectedAudit.name}</Typography>
              <Button onClick={handleRegStatus}>{selectedAudit.regstatus === "1" ? "Close" : "Open"}</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {registrations.map((registration, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText primary={`Name: ${registration.name}`} secondary={`Status: ${registration.status}`} />
                    <IconButton color="success" onClick={() => handleAccept(index)}><CheckCircle /></IconButton>
                    <IconButton color="error" onClick={() => handleReject(index)}><Cancel /></IconButton>
                    <IconButton color="error" onClick={() => handleView(index)}><FaEye /></IconButton>
                  </ListItem>
                  {status[index] && (
                    <div>
                      <div className="w-full md:w-96 h-[100px] border border-gray-300 rounded-md bg-white p-4 overflow-y-scroll shadow-md mb-2">
                        {registration.chat.length > 0 ? (
                          registration.chat.map((chat, inde) => {
                            const [message, alignment] = chat.split("&*");
                            return (
                              <div key={inde} className={`p-2 mb-2 text-sm text-gray-800 ${alignment === "u" ? "rounded-md rounded-bl-none bg-red-200 mr-32" : alignment === "a" ? "rounded-md rounded-tr-none bg-green-200 ml-32" : "rounded-md"}`}>
                                {message}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-gray-500 text-sm">No chats available.</div>
                        )}
                      </div>
                      <div className="flex w-full md:w-96 mb-2">
                        <input type="text" value={newChat} onChange={(e) => setNewChat(e.target.value)} placeholder="Enter your message" className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => handleAddChat(registration._id)} className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">Send</button>
                      </div>
                    </div>
                  )}
                  <Divider />
                </div>
              ))}
            </List>
          </Box>
        )}
        {!selectedAudit && (
          <Box sx={{ flex: 1, p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, ml: 4 }}>
            <Typography variant="h6" gutterBottom>Registrations</Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default AdminDashboard;
