import React, { useState } from 'react';
import api from '../api/api'; // Using your custom api instance
import './css/CreateJob.css';

const CreateJob = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [jobStatus, setJobStatus] = useState('pending');
  const [jobAmount, setJobAmount] = useState('');
  const [localJobId, setLocalJobId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Handle search of customer by mobile number
  const handleMobileSearch = async () => {
    if (!mobileNo) {
      setError('Please enter a mobile number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/customer/customer-by-mobile/${mobileNo}`);
      setCustomerData(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setCustomerData(null);
      setError('Customer not found for this mobile number.');
    } finally {
      setLoading(false);
    }
  };

  // Handle job creation
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!customerData) {
      setError('Please search and load a customer first.');
      return;
    }

    // Ensure Local Job ID is entered
    if (!localJobId) {
      setError('Please enter a Local Job ID.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const jobPayload = {
        customer_id: customerData.customer_id,
        old_customer_id: customerData.old_customer_id,
        mobile_no: customerData.mobile_no,
        job_status: jobStatus,
        job_amount: parseFloat(jobAmount),
        local_job_id: localJobId,
      };

      await api.post('/job', jobPayload);

      setSuccess('Job created successfully!');
      // Clear form after submission
      setMobileNo('');
      setCustomerData(null);
      setJobStatus('pending');
      setJobAmount('');
      setLocalJobId('');
    } catch (err) {
      console.error(err);
      setError('Error creating job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-container">
      <div className="create-job-card">
        <div className="job-header">
          <h1>Create New Job</h1>
          <p>Search for a customer by mobile number to create a job</p>
        </div>

        {/* Search Section - Fixed with proper alignment */}
        <div className="search-section">
          <label htmlFor="mobileNo">Customer Mobile Number</label>
          <div className="search-input-container">
            <input
              id="mobileNo"
              type="text"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              placeholder="Enter mobile number"
              className="search-input"
            />
            <button
              type="button"
              onClick={handleMobileSearch}
              className="search-button"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Search'}
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>

        {/* Auto-fill customer details */}
        {customerData && (
          <form onSubmit={handleJobSubmit} className="job-form">
            <div className="customer-details">
              <h2>Customer Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name</label>
                  <input 
                    id="customerName"
                    type="text" 
                    value={customerData.customer_name} 
                    disabled 
                    className="input-field disabled" 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerType">Customer Type</label>
                  <input 
                    id="customerType"
                    type="text" 
                    value={customerData.customer_type} 
                    disabled 
                    className="input-field disabled" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input 
                  id="address"
                  type="text" 
                  value={customerData.address} 
                  disabled 
                  className="input-field disabled" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="district">District</label>
                <input 
                  id="district"
                  type="text" 
                  value={customerData.district} 
                  disabled 
                  className="input-field disabled" 
                />
              </div>
            </div>

            <div className="job-details">
              <h2>Job Information</h2>
              
              <div className="form-group">
                <label htmlFor="localJobId">Local Job ID *</label>
                <input
                  id="localJobId"
                  type="text"
                  value={localJobId}
                  onChange={(e) => setLocalJobId(e.target.value)}
                  className="input-field"
                  placeholder="Enter Local Job ID"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jobStatus">Job Status</label>
                  <select
                    id="jobStatus"
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value)}
                    className="select-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="jobAmount">Job Amount (₹) *</label>
                  <input
                    id="jobAmount"
                    type="number"
                    value={jobAmount}
                    onChange={(e) => setJobAmount(e.target.value)}
                    className="input-field"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>
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
                'Create Job'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateJob;