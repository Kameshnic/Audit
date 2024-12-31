import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaFacebookF, FaTwitter, FaInstagram, FaChartBar, FaClipboardCheck, FaUserTie, FaChevronRight } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Container, Typography, Button, Box, AppBar, Toolbar, IconButton } from '@mui/material';

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundImage: `url('https://png.pngtree.com/background/20211215/original/pngtree-modern-simple-elegant-dark-blue-landing-page-website-background-picture-image_1454711.jpg')`, // Replace with your image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(8, 2),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  color: '#fff',
  position: 'absolute',
  top: 65,
  left: 0,
  width: '100%',
  height: '230px'
}));

const Home = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            console.log({ ...formData });
            return;
        } else {
            console.log({});
        }
        const serviceID = "service_pufoguj";
        const templateID = "template_wdmolyf";
        const userID = "LQlN1nMISqn7SrhOA";
        const params = {
            ...formData,
            to_email: "kameshnic2885@gmail.com",
        };
        emailjs.send(serviceID, templateID, params, userID)
            .then(() => {
            alert('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' }); // Clear form
            })
            .catch(err => {
            console.error('Failed to send message', err);
            alert('Failed to send message. Please try again.');
            });
    };

    const handleReg = () => {
        nav('/register');
    }

    const handleLog = () => {
        nav('/login');
    }

    return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold text-white">Audit Platform</h1>
          <nav>
            <ul className="flex gap-6 text-white font-medium">
              <li>
                <Link to="hero" smooth={true} duration={500} className="cursor-pointer hover:text-blue-200 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="about" smooth={true} duration={500} className="cursor-pointer hover:text-blue-200 transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="services" smooth={true} duration={500} className="cursor-pointer hover:text-blue-200 transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="contact" smooth={true} duration={500} className="cursor-pointer hover:text-blue-200 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center">
            <button onClick={handleReg} className="text-white mr-4 hover:text-blue-200">
              <FaUserTie className="h-6 w-6" />
            </button>
            <button onClick={handleLog} className="text-white hover:text-blue-200">
              <FaChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <section id="hero" className="h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex flex-col justify-center items-center text-white text-center px-6 pt-16">
        <h1 className="text-5xl font-extrabold mb-6 animate-fade-in-down">Empowering Auditors Worldwide</h1>
        <p className="text-lg max-w-3xl mb-6 animate-fade-in-up">
          Explore auditing locations, enhance your skills, and connect with professionals using our advanced platform.
        </p>
        <button className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-blue-100 transition" onClick={handleLog}>
          Get Started
        </button>
      </section>
      <section id="about" className="py-16 px-6 bg-gray-50 text-gray-800 text-center">
        <h2 className="text-4xl font-semibold mb-6 text-blue-700">About Us</h2>
        <p className="text-lg max-w-4xl mx-auto mb-8">
          We provide the best auditing services and resources for professionals, offering detailed information about auditing locations, tools, and opportunities to connect with other auditors.
        </p>
        <div className="flex justify-center mb-8">
          <FaClipboardCheck className="text-6xl text-blue-700" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 bg-white text-gray-800">
        <h2 className="text-4xl font-semibold mb-6 text-blue-700 text-center">Our Services</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <FaChartBar className="text-5xl text-blue-700 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2 text-center">Financial Audits</h3>
            <p className="text-center">Comprehensive financial audits to ensure accuracy and compliance with regulations.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <FaClipboardCheck className="text-5xl text-blue-700 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2 text-center">Compliance Audits</h3>
            <p className="text-center">Ensure your organization adheres to industry standards and regulatory requirements.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <FaUserTie className="text-5xl text-blue-700 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2 text-center">Professional Training</h3>
            <p className="text-center">Enhance your auditing skills with our expert-led training programs and workshops.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gray-50 text-gray-800 text-center">
        <h2 className="text-4xl font-semibold mb-6 text-blue-700">Contact Us</h2>
        <p className="text-lg max-w-4xl mx-auto mb-8">
          Have questions? Feel free to reach out. We're here to help 24/7.
        </p>
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 text-4xl hover:text-blue-500 transition">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 text-4xl hover:text-blue-500 transition">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 text-4xl hover:text-pink-400 transition">
            <FaInstagram />
          </a>
        </div>

        <form onSubmit={handleFormSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          ></textarea>
          <button type="submit" className="w-full px-4 py-2 bg-blue-700 text-white font-bold rounded hover:bg-blue-600 transition">
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-6 text-center">
        <p className="font-medium">&copy; {new Date().getFullYear()} Audit Platform. All Rights Reserved.</p>
      </footer>
    </div>
    );
};

export default Home;
