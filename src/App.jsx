import './App.css'
import Home from './common/Home'
import Login from './common/LoginPage';
import RegisterPage from './common/RegisterPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import Profile from './common/Profile';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/userdash' element={<UserDashboard/>} />
        <Route path='/admindash' element={<AdminDashboard/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </Router>
  )
}

export default App
