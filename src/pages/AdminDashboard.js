import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Filter } from 'lucide-react';
import './css/AdminDashboard.css'
const statusMapping = { 
  'pending': 'Waiting For Design', 
  'in_progress': 'Ready for Printing', 
  'ready': 'Printing Completed Ready for Delivery', 
  'delivered': 'Delivered' 
};

// For status ordering
const statusOrder = ['pending', 'in_progress', 'ready', 'delivered'];

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('mobile_no');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortByStatus, setSortByStatus] = useState(true);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  // Fetch all jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/job');
      setJobs(response.data);
      setFilteredJobs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...jobs];
    
    // First apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(job => {
        const searchValue = String(job[searchField] || '').toLowerCase();
        return searchValue.includes(searchTerm.toLowerCase());
      });
    }
    
    // Then apply status filter if not "all"
    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(job => job.job_status === activeStatusFilter);
    }
    
    // Then sort by status if enabled
    if (sortByStatus) {
      filtered.sort((a, b) => {
        const statusA = statusOrder.indexOf(a.job_status);
        const statusB = statusOrder.indexOf(b.job_status);
        return statusA - statusB;
      });
    }
    
    setFilteredJobs(filtered);
  }, [searchTerm, searchField, jobs, sortByStatus, activeStatusFilter]);

  // Get status index for progress bar
  const getStatusIndex = (status) => {
    return statusOrder.indexOf(status);
  };

  // Format status text using the mapping
  const formatStatus = (status) => {
    return statusMapping[status] || status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // View job details
  const viewJobDetails = (job) => {
    setSelectedJob(job);
  };

  // Close job details
  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  // Filter by status
  const filterByStatus = (status) => {
    setActiveStatusFilter(status);
  };

  // Toggle sorting by status
  const toggleStatusSort = () => {
    setSortByStatus(!sortByStatus);
  };

  // Group jobs by status for display
  const groupJobsByStatus = () => {
    const grouped = {};
    
    // Initialize groups based on status order
    statusOrder.forEach(status => {
      grouped[status] = {
        jobs: [],
        title: statusMapping[status]
      };
    });
    
    // Add jobs to appropriate groups
    filteredJobs.forEach(job => {
      if (grouped[job.job_status]) {
        grouped[job.job_status].jobs.push(job);
      }
    });
    
    return grouped;
  };

  const jobGroups = groupJobsByStatus();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Job Dashboard</h1>
        <div className="search-controls">
          <div className="search-wrapper">
            <div className="search-field-selector">
              <select 
                value={searchField} 
                onChange={(e) => setSearchField(e.target.value)}
                className="search-select"
              >
                <option value="job_id">Job ID</option>
                <option value="local_job_id">Local Job ID</option>
                <option value="mobile_no">Mobile Number</option>
                <option value="customer_name">Customer Name</option>
                <option value="old_customer_id">Old Customer ID</option>
              </select>
            </div>
            <div className="search-input-container">
              <input
                type="text"
                placeholder={`Search by ${searchField.replace('_', ' ')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="search-button">
                <span className="search-icon">🔍</span>
              </button>
            </div>
          </div>
          
          <div className="filter-controls">
            <button 
              className={`filter-button ${sortByStatus ? 'active' : ''}`} 
              onClick={toggleStatusSort}
              title="Sort by status"
            >
              <Filter size={16} />
              <span>Sort by Status</span>
            </button>
            
            <div className="status-filter-buttons">
              <button 
                className={`status-filter ${activeStatusFilter === 'all' ? 'active' : ''}`}
                onClick={() => filterByStatus('all')}
              >
                All
              </button>
              {statusOrder.map(status => (
                <button 
                  key={status}
                  className={`status-filter ${activeStatusFilter === status ? 'active' : ''}`}
                  onClick={() => filterByStatus(status)}
                >
                  {statusMapping[status]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading jobs...</p>
        </div>
      ) : (
        <div className="jobs-container">
          {filteredJobs.length > 0 ? (
            sortByStatus ? (
              // Grouped by status display
              Object.keys(jobGroups).map(status => (
                jobGroups[status].jobs.length > 0 && (
                  <div className="status-group" key={status}>
                    <div className="status-group-header">
                      <h2>{jobGroups[status].title}</h2>
                      <span className="job-count">{jobGroups[status].jobs.length} jobs</span>
                    </div>
                    <div className="jobs-grid">
                      {jobGroups[status].jobs.map(job => (
                        <div className="job-card" key={job.job_id} onClick={() => viewJobDetails(job)}>
                          <div className="job-card-header">
                            <div className="job-id">Job #{job.job_id}</div>
                            <div className="job-date">{new Date(job.created_at).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="job-card-content">
                            <div className="job-info-row">
                              <span className="info-label">Customer:</span>
                              <span className="info-value">{job.customer_name}</span>
                            </div>
                            <div className="job-info-row">
                              <span className="info-label">Mobile:</span>
                              <span className="info-value">{job.mobile_no}</span>
                            </div>
                            <div className="job-info-row">
                              <span className="info-label">Local ID:</span>
                              <span className="info-value">{job.local_job_id || 'N/A'}</span>
                            </div>
                            <div className="job-info-row">
                              <span className="info-label">Amount:</span>
                              <span className="info-value amount">₹{job.job_amount}</span>
                            </div>
                          </div>
                          
                          <div className="job-status-container">
                            <div className="status-text">{formatStatus(job.job_status)}</div>
                            <div className="status-line-container">
                              <div className="status-line">
                                <div className="status-progress" style={{
                                  width: `${(getStatusIndex(job.job_status) + 1) * 100 / statusOrder.length}%`
                                }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))
            ) : (
              // Regular grid display
              <div className="jobs-grid">
                {filteredJobs.map(job => (
                  <div className="job-card" key={job.job_id} onClick={() => viewJobDetails(job)}>
                    <div className="job-card-header">
                      <div className="job-id">Job #{job.job_id}</div>
                      <div className="job-date">{new Date(job.created_at).toLocaleDateString()}</div>
                    </div>
                    
                    <div className="job-card-content">
                      <div className="job-info-row">
                        <span className="info-label">Customer:</span>
                        <span className="info-value">{job.customer_name}</span>
                      </div>
                      <div className="job-info-row">
                        <span className="info-label">Mobile:</span>
                        <span className="info-value">{job.mobile_no}</span>
                      </div>
                      <div className="job-info-row">
                        <span className="info-label">Local ID:</span>
                        <span className="info-value">{job.local_job_id || 'N/A'}</span>
                      </div>
                      <div className="job-info-row">
                        <span className="info-label">Amount:</span>
                        <span className="info-value amount">₹{job.job_amount}</span>
                      </div>
                    </div>
                    
                    <div className="job-status-container">
                      <div className="status-text">{formatStatus(job.job_status)}</div>
                      <div className="status-line-container">
                        <div className="status-line">
                          <div className="status-progress" style={{
                            width: `${(getStatusIndex(job.job_status) + 1) * 100 / statusOrder.length}%`
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="no-jobs-message">
              <div className="empty-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>We couldn't find any jobs matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {selectedJob && (
        <div className="job-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Job Details</h2>
              <button className="close-button" onClick={closeJobDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="job-details-grid">
                <div className="detail-group">
                  <div className="detail-label">Job ID</div>
                  <div className="detail-value">{selectedJob.job_id}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Local Job ID</div>
                  <div className="detail-value">{selectedJob.local_job_id || 'N/A'}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Customer Name</div>
                  <div className="detail-value">{selectedJob.customer_name}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Mobile Number</div>
                  <div className="detail-value">{selectedJob.mobile_no}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Old Customer ID</div>
                  <div className="detail-value">{selectedJob.old_customer_id || 'N/A'}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Amount</div>
                  <div className="detail-value amount">₹{selectedJob.job_amount}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Created At</div>
                  <div className="detail-value">{new Date(selectedJob.created_at).toLocaleString()}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Status</div>
                  <div className="detail-value status">{formatStatus(selectedJob.job_status)}</div>
                </div>
              </div>
              
              <div className="job-status-details">
                <h3>Job Status Tracker</h3>
                <div className="detailed-status-tracker">
                  <div className="status-line-container">
                    <div className="status-line">
                      <div className="status-progress" style={{
                        width: `${(getStatusIndex(selectedJob.job_status) + 1) * 100 / statusOrder.length}%`
                      }}></div>
                    </div>
                    <div className="status-markers">
                      {statusOrder.map((status, index) => (
                        <div 
                          key={status} 
                          className={`status-marker ${getStatusIndex(selectedJob.job_status) >= index ? 'active' : ''}`}
                        >
                          <div className="marker-dot"></div>
                          <div className="marker-label">{statusMapping[status]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-btn" onClick={closeJobDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;