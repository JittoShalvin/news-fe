import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/nav.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [customerDropdown, setCustomerDropdown] = useState(false);

  useEffect(() => {
    setActiveLink(window.location.pathname);
    
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setAdminDropdown(false);
        setCustomerDropdown(false);
      }
      
      if (menuOpen && !event.target.closest('.navbar')) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setMenuOpen(false);
    setAdminDropdown(false);
    setCustomerDropdown(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleAdminDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdminDropdown(!adminDropdown);
    setCustomerDropdown(false);
  };
  
  const toggleCustomerDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCustomerDropdown(!customerDropdown);
    setAdminDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">Admin Panel</span>
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
      
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link 
          to="/admin-dashboard" 
          className={`nav-link ${activeLink === '/admin-dashboard' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/admin-dashboard')}
        >
          <i className="nav-icon dashboard-icon"></i>
          <span>Dashboard</span>
        </Link>
                <Link 
          to="/job-management" 
          className={`nav-link ${activeLink === '/job-management' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/job-management')}
        >
          <i className="nav-icon job-icon"></i>
          <span>Job Management</span>
        </Link>
        <div className="nav-dropdown">
          <a 
            href="#" 
            className={`nav-link dropdown-toggle ${activeLink.includes('/admin') || activeLink === '/create-admin' || activeLink === '/adminlist' ? 'active' : ''}`}
            onClick={toggleAdminDropdown}
          >
            <i className="nav-icon admin-icon"></i>
            <span>Admin</span>
          </a>
          <div className={`dropdown-menu ${adminDropdown ? 'show' : ''}`}>
            <Link 
              to="/create-admin" 
              className={`dropdown-item ${activeLink === '/create-admin' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/create-admin')}
            >
              Create Admin
            </Link>
            <Link 
              to="/admin-list" 
              className={`dropdown-item ${activeLink === '/admin-list' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/admin-list')}
            >
              Admin List
            </Link>
          </div>
        </div>
        

        
        <Link 
          to="/create-job" 
          className={`nav-link ${activeLink === '/create-job' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/create-job')}
        >
          <i className="nav-icon create-job-icon"></i>
          <span>Create Job</span>
        </Link>
        
        <div className="nav-dropdown">
          <a 
            href="#" 
            className={`nav-link dropdown-toggle ${activeLink.includes('/customer') || activeLink === '/create-new-customer' || activeLink === '/update-customer' || activeLink === '/Detecustomer' || activeLink === '/customer-transition' ? 'active' : ''}`}
            onClick={toggleCustomerDropdown}
          >
            <i className="nav-icon customer-icon"></i>
            <span>Customer Management</span>
          </a>
          <div className={`dropdown-menu ${customerDropdown ? 'show' : ''}`}>
            <Link 
              to="/create-new-customer" 
              className={`dropdown-item ${activeLink === '/create-new-customer' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/create-new-customer')}
            >
              Create Customer
            </Link>
            <Link 
              to="/update-customer" 
              className={`dropdown-item ${activeLink === '/update-customer' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/update-customer')}
            >
              Update Customer
            </Link>
            <Link 
              to="/delete-customer" 
              className={`dropdown-item ${activeLink === '/delete-customer' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/delete-customer')}
            >
              Delete Customer
            </Link>
            <Link 
              to="/customer-transition" 
              className={`dropdown-item ${activeLink === '/customer-transition' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/customer-transition')}
            >
              Customer Transition
            </Link>
          </div>
        </div>
        
        <Link 
          to="/update-payment" 
          className={`nav-link ${activeLink === '/update-payment' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/update-payment')}
        >
          <i className="nav-icon payment-icon"></i>
          <span>Update Payment</span>
        </Link>
      </div>
      
      <div className="navbar-user">

        <button onClick={handleLogout} className="logout-button">
          <i className="logout-icon"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}