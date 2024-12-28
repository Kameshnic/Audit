import './App.css'
import Home from './Home'
import Login from './LoginPage';
import RegisterPage from './RegisterPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/userdash' element={<UserDashboard/>} />
        <Route path='/admindash' element={<AdminDashboard/>} />
      </Routes>
    </Router>
  )
}

export default App
