import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './css/AdminList.css';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/all');
      setAdmins(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete admin
  const deleteAdmin = async (admin_id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await api.delete(`/admin/delete/${admin_id}`);
        alert('Admin deleted successfully');
        fetchAdmins(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Error deleting admin');
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admins...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-headera">
        <h2>All Administrators</h2>
      </div>
      
      {admins.length === 0 ? (
        <div className="admin-empty">No administrators found.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin ID</th>
                <th>Username</th>
                <th>Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.admin_id}>
                  <td>{admin.admin_id}</td>
                  <td>{admin.username}</td>
                  <td>{admin.address}</td>
                  <td>
                    <span className="admin-role">{admin.role}</span>
                  </td>
                  <td>
                    <button 
                      className="admin-delete-btn"
                      onClick={() => deleteAdmin(admin.admin_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminList;