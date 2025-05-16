import React, { useEffect, useState } from 'react';
import api from '../api/api'; // your axios instance
import './css/updatepayment.css'; // Import the external CSS file

const ManageEmployees = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch customers on load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/customer');
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setMessage('Failed to fetch employees');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Search logic
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (c) =>
        c.customer_name.toLowerCase().includes(lowerSearch) ||
        c.mobile_no.toString().includes(lowerSearch)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleChange = (e) => {
    setSelectedCustomer({ ...selectedCustomer, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await api.put(`/customer/${selectedCustomer.customer_id}`, selectedCustomer);
      setMessage('Employee updated successfully');
      setMessageType('success');
      fetchCustomers(); // refresh after update
    } catch (error) {
      console.error('Error updating customer:', error);
      setMessage('Error updating employee');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Icons mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'user':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
      case 'home':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
      case 'pin':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />;
      case 'map':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />;
      case 'phone':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;
      case 'users':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
      case 'dollar':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  const formFields = [
    { name: 'customer_name', label: 'Name', icon: 'user' },
    { name: 'address', label: 'Address', icon: 'home' },
    { name: 'pin_code', label: 'PIN Code', icon: 'pin' },
    { name: 'district', label: 'District', icon: 'map' },
    { name: 'mobile_no', label: 'Mobile No', icon: 'phone' },
    { name: 'customer_type', label: 'Type', icon: 'users' },
    { name: 'balance_amount', label: 'Balance', icon: 'dollar' },
  ];

  return (
    <div className="employee-container">
      <div className="card">
        <h2 className="title">Manage Employees</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {isLoading && !filteredCustomers.length ? (
          <div className="loading-message">Loading employees...</div>
        ) : (
          <div className="employees-list">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust) => (
                <div
                  key={cust.customer_id}
                  className={`employee-item ${
                    selectedCustomer && selectedCustomer.customer_id === cust.customer_id
                      ? 'selected'
                      : ''
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedCustomer(cust);
                      setMessage('');
                    }}
                    className="employee-info"
                  >
                    <span className="employee-name">{cust.customer_name}</span>
                    <span className="employee-mobile">{cust.mobile_no}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No matching employees found.</p>
            )}
          </div>
        )}

        {selectedCustomer && (
          <div className="edit-form">
            <h3 className="edit-title">Edit Employee</h3>

            <div className="form-grid">
              {formFields.map((field) => (
                <div key={field.name} className="input-container">
                  <input
                    type="text"
                    name={field.name}
                    value={selectedCustomer[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.label}
                    className="form-input"
                  />
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {getIcon(field.icon)}
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="button-container">
              <button
                onClick={handleUpdate}
                className="update-button"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Employee'}
              </button>
            </div>

            {message && (
              <div className="message-container">
                <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
                  {message}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEmployees;