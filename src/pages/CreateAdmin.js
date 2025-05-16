import React, { useState } from 'react';
import API from '../api/api';  // Assuming you have an API utility file
import './css/CreateAdmin.css';

function CreateAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });  // For success or error messages

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate inputs before submission
      if (!username || !password || !address) {
        setMessage({ text: 'All fields are required', type: 'error' });
        setLoading(false);
        return;
      }
      
      // Sending POST request to backend to create a new admin
      const response = await API.post('/admin/create', { username, password, address, role });

      // If admin is created successfully, show success message
      if (response.status === 201) {
        setMessage({ text: 'Admin Created Successfully!', type: 'success' });
        // Clear the form fields after successful creation
        setUsername('');
        setPassword('');
        setAddress('');
        setRole('admin');
      } else {
        setMessage({ text: 'Failed to create Admin', type: 'error' });
      }
    } catch (err) {
      console.error('Error creating admin:', err);
      setMessage({ 
        text: err.response?.data?.message || 'Failed to create Admin', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-admin-container">
      <div className="create-admin-card">
        <div className="create-admin-content">
          <div className="admin-header">
            <h1>Create New Admin</h1>
            <p>Enter the details to add a new administrator</p>
          </div>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              <p>{message.text}</p>
            </div>
          )}
          
          <form onSubmit={handleCreate} className="admin-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                placeholder="Enter secure password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                placeholder="Enter address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select 
                id="role"
                value={role} 
                onChange={e => setRole(e.target.value)}
                className="select-field"
              >
                <option value="admin">Admin</option>
                <option value="main_admin">Main Admin</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Creating...</span>
                </>
              ) : (
                'Create Admin'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAdmin;