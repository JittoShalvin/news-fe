import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './nav.css'; // Assuming you have a CSS file for styling
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-container">
            <span className="logo">
              <svg className="logo-icon real" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg className="logo-icon fake" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </span>
            <h1>TruthSeeker</h1>
          </div>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </div>

        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link
              to="/"
              className={location.pathname === "/" ? "nav-link active" : "nav-link"}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/alysis"
              className={location.pathname === "/webscraper" ? "nav-link active" : "nav-link"}
              onClick={() => setIsMenuOpen(false)}
            >
              News Analysis
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
