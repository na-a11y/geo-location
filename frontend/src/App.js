// App.js 
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LocationPage from './LocationPage';
import HomePage from './HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h2>Geo-Location Tracking System</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/location">Location</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/location" element={<LocationPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>

        <footer className="footer">
          <p>&copy; 2024 Geo-Location Tracking System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
