import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { user, dash } = location.state || {};

  const handleLogout = () => {
    nav("/")
  }

  const handleback = () => {
    if(dash=="user"){
        nav('/userdash',{ state: { auditId: user._id } });
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <button className="absolute top-4 right-4 bg-blue-500 text-white p-2 hover:bg-blue-600" onClick={handleback}>
          Back
        </button>
        {/* Profile Header */}
        <div className="flex justify-center mb-6">
          <img
            src={user?.profilePicture || 'https://th.bing.com/th/id/OIP.BnVx7-iUe5x2guQLTVEZ3gHaFj?rs=1&pid=ImgDetMain'}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </div>

        {/* Username and Name */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">{user?.username}</h1>
          <p className="text-xl font-medium text-gray-600">{user?.name}</p>
        </div>

        {/* Contact Information */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="text-gray-800">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Contact No:</span>
            <span className="text-gray-800">{user?.contact_info || 'N/A'}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Joined:</span>
            <span className="text-gray-800">{user?.joinDate || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="text-gray-800">{user?.location || 'N/A'}</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
