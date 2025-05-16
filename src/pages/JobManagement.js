import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api'; // Import the API module
import './css/JobManagement.css';

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('job_id');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all jobs
  const fetchJobs = useCallback(() => {
    setIsLoading(true);
    api.get('/job')
      .then((response) => {
        setJobs(response.data);
        setFilteredJobs(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setMessage('Error fetching jobs');
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Improved search function with better type handling
  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    const filtered = jobs.filter(job => {
      // Get the field value we're searching
      let fieldValue = job[searchField];
      
      // Handle potential null or undefined values
      if (fieldValue === null || fieldValue === undefined) {
        return false;
      }
      
      // Always convert to string for consistent comparison
      const fieldValueStr = String(fieldValue).toLowerCase();
      
      // Special handling for job_id - exact match or starts with
      if (searchField === 'job_id') {
        // Try exact match first (common for ID searches)
        if (fieldValue === parseInt(searchTerm, 10)) {
          return true;
        }
        // Otherwise check if it starts with the search term
        return fieldValueStr.startsWith(searchTermLower);
      }
      
      // For other fields, use contains
      return fieldValueStr.includes(searchTermLower);
    });
    
    setFilteredJobs(filtered);
  }, [searchTerm, searchField, jobs]);

  // Apply search when search term or field changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search for better performance
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchField, handleSearch]);

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingJob({ ...editingJob, [name]: value });
  };

  const handleUpdate = () => {
    setIsLoading(true);
    api.put(`/job/${editingJob.job_id}`, {
      job_status: editingJob.job_status,
      job_amount: editingJob.job_amount,
    })
      .then((response) => {
        setMessage(response.data.message);
        showNotification(response.data.message, 'success');
        setEditingJob(null);
        fetchJobs();
      })
      .catch((error) => {
        const errorMsg = 'Error updating job';
        setMessage(errorMsg);
        showNotification(errorMsg, 'error');
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setIsLoading(true);
      api.delete(`/job/jobs/${jobId}`)
        .then((response) => {
          setMessage(response.data.message);
          showNotification(response.data.message, 'success');
          fetchJobs();
        })
        .catch((error) => {
          const errorMsg = 'Error deleting job';
          setMessage(errorMsg);
          showNotification(errorMsg, 'error');
          console.error(error);
          setIsLoading(false);
        });
    }
  };

  const showNotification = (msg, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = msg;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }, 100);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-progress';
      case 'ready': return 'status-ready';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredJobs(jobs);
  };

  return (
    <div className="job-management-container">
      <div className="header-section">
        <h1 className="job-title">Job Management Dashboard</h1>
        <div className="search-container1">
          <div className="search-field-selector">
            <select 
              value={searchField} 
              onChange={(e) => {
                setSearchField(e.target.value);
                if (searchTerm) handleSearch();
              }}
              className="search-select"
            >
              <option value="job_id">Job ID</option>
              <option value="local_job_id">Local Job ID</option>
              <option value="mobile_no">Mobile Number</option>
              <option value="customer_name">Customer Name</option>
              <option value="old_customer_id">Old Customer ID</option>
            </select>
          </div>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder={`Search by ${searchField.replace('_', ' ')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button 
              className="search-button" 
              onClick={handleSearch}
              title="Search"
            >
              <i className="search-icon">🔍</i>
            </button>
            {searchTerm && (
              <button 
                className="clear-search-button" 
                onClick={clearSearch}
                title="Clear search"
              >
                <i className="clear-icon">✖</i>
              </button>
            )}
          </div>
        </div>
      </div>

      {message && <p className="message-bar">{message}</p>}

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {editingJob && (
            <div className="edit-job-modal">
              <div className="edit-job-content">
                <h3 className="edit-job-title">Edit Job #{editingJob.job_id}</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job ID:</label>
                    <span className="info-text">{editingJob.job_id}</span>
                  </div>
                  <div className="form-group">
                    <label>Local Job ID:</label>
                    <span className="info-text">{editingJob.local_job_id || 'N/A'}</span>
                  </div>
                  <div className="form-group">
                    <label>Customer:</label>
                    <span className="info-text">{editingJob.customer_name}</span>
                  </div>
                  <div className="form-group">
                    <label>Mobile Number:</label>
                    <span className="info-text">{editingJob.mobile_no}</span>
                  </div>
                  <div className="form-group">
                    <label>Old Customer ID:</label>
                    <span className="info-text">{editingJob.old_customer_id || 'N/A'}</span>
                  </div>
                  <div className="form-group status-select">
                    <label>Job Status:</label>
                    <select
                      name="job_status"
                      value={editingJob.job_status}
                      onChange={handleChange}
                      className={`status-dropdown ${getStatusClass(editingJob.job_status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Job Amount (₹):</label>
                    <input
                      type="text"
                      name="job_amount"
                      value={editingJob.job_amount}
                      onChange={handleChange}
                      className="amount-input"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn update-btn" onClick={handleUpdate}>Update Job</button>
                  <button className="btn cancel-btn" onClick={() => setEditingJob(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="jobs-table-container">
            <div className="table-wrapper">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Local ID</th>
                    <th>Customer</th>
                    <th>Mobile</th>
                    <th>Old ID</th>
                    <th>Status</th>
                    <th>Amount (₹)</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <tr key={job.job_id} className="job-row">
                        <td data-label="Job ID">{job.job_id}</td>
                        <td data-label="Local ID">{job.local_job_id || 'N/A'}</td>
                        <td data-label="Customer">{job.customer_name}</td>
                        <td data-label="Mobile">{job.mobile_no}</td>
                        <td data-label="Old ID">{job.old_customer_id || 'N/A'}</td>
                        <td data-label="Status">
                          <span className={`status-badge ${getStatusClass(job.job_status)}`}>
                            {formatStatus(job.job_status)}
                          </span>
                        </td>
                        <td data-label="Amount">₹{job.job_amount}</td>
                        <td data-label="Created">{new Date(job.created_at).toLocaleString()}</td>
                        <td data-label="Actions" className="action-buttons">
                          <button className="btn edit-btn" onClick={() => handleEdit(job)}>
                            <i className="icon">✏️</i>
                          </button>
                          <button className="btn delete-btn" onClick={() => handleDelete(job.job_id)}>
                            <i className="icon">🗑️</i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-records">
                        No jobs found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="dashboard-footer">
            <p>Total Jobs: {filteredJobs.length}</p>
            <p>Showing {filteredJobs.length} of {jobs.length} jobs</p>
          </div>
        </>
      )}
    </div>
  );
}

export default JobManagement;