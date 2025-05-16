import React, { useState } from 'react';
import api from '../api/api';
import './css/CreateNewCustomer.css';

const CreateCustomer = () => {
  const [customerData, setCustomerData] = useState({
    old_customer_id: '',
    customer_name: '',
    address: '',
    pin_code: '',
    district: '',
    mobile_no: '',
    customer_type: '',
    balance_amount: ''
  });
  
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  
  // Added state to track successful customer creation
  const [customerCreated, setCustomerCreated] = useState(false);
  const [createdCustomerName, setCreatedCustomerName] = useState('');
  
  // Track field validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  // Track submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value
    });
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message
    });

    // Only auto-hide success notifications, keep error notifications visible
    if (type === 'success') {
      // Hide notification after 5 seconds (extended from 3 seconds)
      setTimeout(() => {
        setNotification({
          ...notification,
          show: false
        });
        
        // Reset the customer created state after notification disappears
        setTimeout(() => {
          setCustomerCreated(false);
        }, 500);
      }, 5000);
    }
  };
  
  // Function to dismiss error notification
  const dismissNotification = () => {
    setNotification({
      ...notification,
      show: false
    });
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Basic validations
    if (!customerData.customer_name.trim()) {
      errors.customer_name = "Customer name is required";
    }
    
    if (!customerData.address.trim()) {
      errors.address = "Address is required";
    }
    
    if (!customerData.pin_code.trim()) {
      errors.pin_code = "PIN code is required";
    } else if (!/^\d{6}$/.test(customerData.pin_code.trim())) {
      errors.pin_code = "PIN code must be 6 digits";
    }
    
    if (!customerData.district.trim()) {
      errors.district = "District is required";
    }
    
    if (!customerData.mobile_no.trim()) {
      errors.mobile_no = "Mobile number is required";
    } else if (!/^\d{10}$/.test(customerData.mobile_no.trim())) {
      errors.mobile_no = "Mobile number must be 10 digits";
    }
    
    if (!customerData.customer_type) {
      errors.customer_type = "Please select a customer type";
    }
    
    if (customerData.balance_amount && isNaN(parseFloat(customerData.balance_amount))) {
      errors.balance_amount = "Balance amount must be a number";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear any existing notifications before submitting
    setNotification({
      show: false,
      type: '',
      message: ''
    });
    
    // Validate form before submission
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors in the form before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    api.post('/customer', customerData)
      .then((response) => {
        setIsSubmitting(false);
        
        if (response.data.message === 'Customer created successfully') {
          // Store the created customer's name
          setCreatedCustomerName(customerData.customer_name);
          
          // Set customer created flag to true
          setCustomerCreated(true);
          
          showNotification('success', `Customer "${customerData.customer_name}" created successfully!`);
          
          // Reset form
          setCustomerData({
            old_customer_id: '',
            customer_name: '',
            address: '',
            pin_code: '',
            district: '',
            mobile_no: '',
            customer_type: '',
            balance_amount: ''
          });
          
          // Clear field errors
          setFieldErrors({});
        } else {
          // Format the error message to be more specific
          const errorMsg = response.data.message || 'Unknown server error';
          showNotification('error', `Failed to create customer: ${errorMsg}`);
          
          // Check if error is related to specific fields
          if (response.data.errors) {
            setFieldErrors(response.data.errors);
          }
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error('Error creating customer:', error);
        
        // Provide more detailed error information
        let errorMessage = 'Failed to create customer';
        
        if (error.response) {
          // Server responded with a non-2xx status code
          if (error.response.data && error.response.data.message) {
            errorMessage = `${errorMessage}: ${error.response.data.message}`;
            
            // Handle validation errors from server
            if (error.response.data.errors) {
              setFieldErrors(error.response.data.errors);
            }
          } else if (error.response.status === 400) {
            errorMessage = `${errorMessage}: Invalid data provided`;
          } else if (error.response.status === 409) {
            errorMessage = `${errorMessage}: Customer already exists`;
          } else if (error.response.status === 500) {
            errorMessage = `${errorMessage}: Server error - please try again later`;
          }
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = `${errorMessage}: No response from server. Please check your connection.`;
        } else {
          // Error in setting up the request
          errorMessage = `${errorMessage}: ${error.message}`;
        }
        
        showNotification('error', errorMessage);
      });
  };

  // Reset form and clear notification
  const handleNewCustomer = () => {
    setCustomerCreated(false);
    setNotification({
      show: false,
      type: '',
      message: ''
    });
  };

  return (
    <div className="customer-container">
      {customerCreated ? (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Customer Created Successfully!</h2>
          <p>"{createdCustomerName}" has been added to the customer database.</p>
          <button className="new-customer-btn" onClick={handleNewCustomer}>
            Create Another Customer
          </button>
        </div>
      ) : (
        <>
          <div className="header-section">
            <h2>Create New Customer</h2>
            <p>Enter the customer details below to register a new customer in the system.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="form-animation">
            <div className="form-group">
              <label htmlFor="old_customer_id">Old Customer ID</label>
              <input
                type="text"
                id="old_customer_id"
                name="old_customer_id"
                placeholder="Enter old customer ID if applicable"
                value={customerData.old_customer_id}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={`form-group ${fieldErrors.customer_name ? 'has-error' : ''}`}>
              <label htmlFor="customer_name">Customer Name*</label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                placeholder="Enter customer name"
                value={customerData.customer_name}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.customer_name && (
                <span className="error-message">{fieldErrors.customer_name}</span>
              )}
            </div>
            
            <div className={`form-group ${fieldErrors.address ? 'has-error' : ''}`}>
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter full address"
                value={customerData.address}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.address && (
                <span className="error-message">{fieldErrors.address}</span>
              )}
            </div>
            
            <div className={`form-group ${fieldErrors.pin_code ? 'has-error' : ''}`}>
              <label htmlFor="pin_code">PIN Code*</label>
              <input
                type="text"
                id="pin_code"
                name="pin_code"
                placeholder="Enter PIN code (6 digits)"
                value={customerData.pin_code}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.pin_code && (
                <span className="error-message">{fieldErrors.pin_code}</span>
              )}
            </div>
            
            <div className={`form-group ${fieldErrors.district ? 'has-error' : ''}`}>
              <label htmlFor="district">District*</label>
              <input
                type="text"
                id="district"
                name="district"
                placeholder="Enter district"
                value={customerData.district}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.district && (
                <span className="error-message">{fieldErrors.district}</span>
              )}
            </div>
            
            <div className={`form-group ${fieldErrors.mobile_no ? 'has-error' : ''}`}>
              <label htmlFor="mobile_no">Mobile Number*</label>
              <input
                type="text"
                id="mobile_no"
                name="mobile_no"
                placeholder="Enter mobile number (10 digits)"
                value={customerData.mobile_no}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.mobile_no && (
                <span className="error-message">{fieldErrors.mobile_no}</span>
              )}
            </div>
            
            <div className={`form-group ${fieldErrors.customer_type ? 'has-error' : ''}`}>
              <label htmlFor="customer_type">Customer Type*</label>
              <select
                id="customer_type"
                name="customer_type"
                value={customerData.customer_type}
                onChange={handleInputChange}
                required
              >
                
                <option value="Artist">Artist</option>
                <option value="Regular">Regular</option>
              </select>
              {fieldErrors.customer_type && (
                <span className="error-message">{fieldErrors.customer_type}</span>
              )}
            </div>
            
            <div className={`form-group ${fieldErrors.balance_amount ? 'has-error' : ''}`}>
              <label htmlFor="balance_amount">Balance Amount</label>
              <input
                type="number"
                id="balance_amount"
                name="balance_amount"
                placeholder="Enter balance amount"
                value={customerData.balance_amount}
                onChange={handleInputChange}
              />
              {fieldErrors.balance_amount && (
                <span className="error-message">{fieldErrors.balance_amount}</span>
              )}
            </div>
            
            <div className="button-container">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
            
            {Object.keys(fieldErrors).length > 0 && (
              <div className="form-error-summary">
                Please fix the highlighted errors to proceed.
              </div>
            )}
          </form>
        </>
      )}
      
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          {notification.type === 'error' && (
            <button className="notification-dismiss" onClick={dismissNotification}>
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateCustomer;