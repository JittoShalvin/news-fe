import React, { useState, useEffect } from 'react';
import './css/deletecustomer.css';
import API from '../api/api';

const DeleteCustomer = () => {
  const [customerId, setCustomerId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleInputChange = (e) => {
    setCustomerId(e.target.value);
    setConfirmDelete(false);
  };

  const handleConfirmation = (e) => {
    e.preventDefault();
    if (!customerId.trim()) {
      setAlert({
        type: 'error',
        message: 'Please enter a customer ID'
      });
      return;
    }
    setConfirmDelete(true);
  };

  const handleDeleteCustomer = () => {
    if (!customerId.trim()) return;
    
    setIsDeleting(true);
    
    API.delete(`/customer/${customerId}`)
      .then((response) => {
        setAlert({
          type: 'success',
          message: 'Customer has been successfully deleted from the system'
        });
        setCustomerId('');
        setConfirmDelete(false);
      })
      .catch((error) => {
        console.error('Error deleting customer:', error);
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to delete customer'
        });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div className="delete-customer-container">
      <div className="delete-card">
        <h2 className="delete-title">
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </span>
          Delete Customer
        </h2>
        
        <p className="delete-subtitle">
          Enter the ID of the customer you wish to remove from the system. This action cannot be undone.
        </p>
        
        <div className="warning-box">
          <div className="warning-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="warning-text">
            Deleting a customer will remove all their associated data including order history and account information. This operation cannot be reversed.
          </p>
        </div>
        
        <form className="delete-form" onSubmit={handleConfirmation}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Customer ID"
              value={customerId}
              onChange={handleInputChange}
              className="delete-input"
              disabled={confirmDelete}
            />
            <div className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
          </div>
          
          {confirmDelete ? (
            <div className="delete-confirmation">
              <p className="confirmation-text">
                Are you sure you want to delete customer with ID <span className="confirmation-id">{customerId}</span>?
              </p>
            </div>
          ) : null}
          
          {confirmDelete ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="delete-button"
                style={{ backgroundColor: '#6b7280', flex: 1 }}
                disabled={isDeleting}
              >
                <span className="button-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomer}
                className="delete-button"
                style={{ flex: 1 }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  'Deleting...'
                ) : (
                  <>
                    <span className="button-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </span>
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="delete-button"
              disabled={isDeleting}
            >
              <span className="button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Continue
            </button>
          )}
        </form>
      </div>
      
      {alert && (
        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <div className="alert-icon">
            {alert.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="alert-message">{alert.message}</div>
        </div>
      )}
    </div>
  );
};

export default DeleteCustomer;