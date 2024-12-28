import './App.css'
import Home from './Home'
import RegisterPage from './RegisterPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    </Router>
  )
}

export default App
