import { useState, useEffect } from 'react';
import api from '../api/api';

const UpdateCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');

  // Styles for blue theme
  const styles = {
    appContainer: {
      display: 'flex',
      height: '100vh',
      fontFamily: "'Poppins', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      color: '#333',
      background: '#f5f7fb'
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#1a56db',
      color: 'white',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
    },
    appLogo: {
      backgroundColor: '#ffffff',
      color: '#1a56db',
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '20px auto',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    tabMenu: {
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '0 15px'
    },
    tabBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 15px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.8)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left'
    },
    tabBtnActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: 'white'
    },
    sidebarFooter: {
      marginTop: 'auto',
      padding: '15px'
    },
    refreshBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    mainContent: {
      flex: 1,
      padding: '20px 30px',
      overflowY: 'auto'
    },
    contentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    h1: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1a56db',
      margin: 0
    },
    h2: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a56db',
      margin: '0 0 5px 0'
    },
    h3: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a56db',
      margin: '0 0 5px 0'
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '10px 15px',
      boxShadow: '0 2px 8px rgba(26, 86, 219, 0.1)',
      width: '300px'
    },
    searchIcon: {
      color: '#1a56db',
      marginRight: '10px'
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      width: '100%',
      fontSize: '14px'
    },
    contentBody: {
      padding: '20px 0'
    },
    loadingState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 0',
      color: '#1a56db'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(26, 86, 219, 0.1)',
      borderRadius: '50%',
      borderTop: '4px solid #1a56db',
      animation: 'spin 1s linear infinite'
    },
    listInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
      fontSize: '14px',
      color: '#64748b'
    },
    customerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    customerCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(26, 86, 219, 0.08)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      border: '1px solid #e2e8f0',
      display: 'flex',
    },
    customerAvatar: {
      width: '70px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a56db',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    customerDetails: {
      flex: 1,
      padding: '20px',
      position: 'relative'
    },
    customerData: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginTop: '8px'
    },
    dataItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#64748b'
    },
    tag: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '4px 10px',
      borderRadius: '30px',
      backgroundColor: 'rgba(26, 86, 219, 0.1)',
      color: '#1a56db',
      fontSize: '12px',
      fontWeight: '500'
    },
    editBtn: {
      marginTop: '15px',
      padding: '6px 12px',
      backgroundColor: '#1a56db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    backNavigation: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    backBtn: {
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 10px rgba(26, 86, 219, 0.1)',
      cursor: 'pointer',
      color: '#1a56db'
    },
    customerProfile: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(26, 86, 219, 0.08)'
    },
    profileHeader: {
      backgroundColor: '#1a56db',
      padding: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      color: 'white'
    },
    largeAvatar: {
      width: '80px',
      height: '80px',
      backgroundColor: 'white',
      color: '#1a56db',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '30px',
      fontWeight: 'bold',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    },
    profileInfo: {
      flex: 1
    },
    profileTags: {
      display: 'flex',
      gap: '10px',
      marginTop: '8px'
    },
    profileTag: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '13px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    editFormContainer: {
      padding: '30px'
    },
    formColumns: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '30px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1a56db'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
      backgroundColor: '#f8fafc'
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '15px',
      marginTop: '30px'
    },
    cancelBtn: {
      padding: '12px 20px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    saveBtn: {
      padding: '12px 20px',
      backgroundColor: '#1a56db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    toastMessage: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      color: 'white',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease'
    },
    successToast: {
      backgroundColor: '#10b981'
    },
    errorToast: {
      backgroundColor: '#ef4444'
    },
    toastIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    toastText: {
      fontSize: '14px',
      fontWeight: '500'
    },
    noResults: {
      textAlign: 'center',
      padding: '60px 0',
      color: '#64748b'
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    '@keyframes slideIn': {
      '0%': { transform: 'translateY(20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 }
    }
  };

  // Fetch customers on load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/customer');
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showMessage('Failed to load customers', 'error');
    } finally {
      setLoading(false);
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
    try {
      await api.put(`/customer/${selectedCustomer.customer_id}`, selectedCustomer);
      showMessage('Customer updated successfully', 'success');
      fetchCustomers(); // refresh after update
    } catch (error) {
      console.error('Error updating customer:', error);
      showMessage('Error updating customer', 'error');
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab('edit');
  };

  const handleCancel = () => {
    setSelectedCustomer(null);
    setActiveTab('list');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formFields = [
    { name: 'customer_name', label: 'Customer Name', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'pin_code', label: 'PIN Code', type: 'number' },
    { name: 'district', label: 'District', type: 'text' },
    { name: 'mobile_no', label: 'Mobile Number', type: 'tel' },
    { name: 'customer_type', label: 'Customer Type', type: 'text' },
    { name: 'balance_amount', label: 'Balance Amount', type: 'number' },
  ];

  return (
    <div style={styles.appContainer}>
      <div style={styles.sidebar}>
        <div style={styles.appLogo}>CM</div>
        <div style={styles.tabMenu}>
          <button 
            style={{...styles.tabBtn, ...(activeTab === 'list' ? styles.tabBtnActive : {})}}
            onClick={() => setActiveTab('list')}
          >
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
            <span>Customer List</span>
          </button>
          {selectedCustomer && (
            <button 
              style={{...styles.tabBtn, ...(activeTab === 'edit' ? styles.tabBtnActive : {})}}
              onClick={() => setActiveTab('edit')}
            >
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              <span>Edit Customer</span>
            </button>
          )}
        </div>
        <div style={styles.sidebarFooter}>
          <button style={styles.refreshBtn} onClick={fetchCustomers}>
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {activeTab === 'list' && (
          <div>
            <header style={styles.contentHeader}>
              <h1 style={styles.h1}>Customer Management</h1>
              <div style={styles.searchBox}>
                <svg style={styles.searchIcon} viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <input
                  style={styles.searchInput}
                  type="text"
                  placeholder="Search customers by name or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </header>

            <div style={styles.contentBody}>
              {loading ? (
                <div style={styles.loadingState}>
                  <div style={styles.spinner}></div>
                  <p>Loading customers...</p>
                </div>
              ) : (
                <>
                  <div style={styles.listInfo}>
                    <span>{filteredCustomers.length} customers found</span>
                  </div>
                  
                  {filteredCustomers.length > 0 ? (
                    <div style={styles.customerGrid}>
                      {filteredCustomers.map((customer) => (
                        <div 
                          key={customer.customer_id} 
                          style={styles.customerCard}
                          onClick={() => selectCustomer(customer)}
                        >
                          <div style={styles.customerAvatar}>
                            {getInitials(customer.customer_name)}
                          </div>
                          <div style={styles.customerDetails}>
                            <h3 style={styles.h3}>{customer.customer_name}</h3>
                            <div style={styles.customerData}>
                              <div style={styles.dataItem}>
                                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                                <span>{customer.mobile_no}</span>
                              </div>
                              <div style={styles.dataItem}>
                                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                                <span>₹{customer.balance_amount}</span>
                              </div>
                            </div>
                            <div style={styles.tag}>{customer.customer_type}</div>
                            <button style={styles.editBtn}>
                              <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.noResults}>
                      <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                      <h3 style={{...styles.h3, marginTop: '15px'}}>No customers found</h3>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'edit' && selectedCustomer && (
          <div>
            <header style={styles.contentHeader}>
              <div style={styles.backNavigation}>
                <button style={styles.backBtn} onClick={() => setActiveTab('list')}>
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                </button>
                <h1 style={styles.h1}>Edit Customer</h1>
              </div>
            </header>

            <div style={styles.contentBody}>
              <div style={styles.customerProfile}>
                <div style={styles.profileHeader}>
                  <div style={styles.largeAvatar}>
                    {getInitials(selectedCustomer.customer_name)}
                  </div>
                  <div style={styles.profileInfo}>
                    <h2 style={{...styles.h2, color: 'white'}}>{selectedCustomer.customer_name}</h2>
                    <div style={styles.profileTags}>
                      <span style={styles.profileTag}>{selectedCustomer.customer_type}</span>
                      <span style={styles.profileTag}>
                        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        {selectedCustomer.mobile_no}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.editFormContainer}>
                  <div>
                    <div style={styles.formColumns}>
                      <div>
                        {formFields.slice(0, Math.ceil(formFields.length / 2)).map((field) => (
                          <div key={field.name} style={styles.formGroup}>
                            <label htmlFor={field.name} style={styles.label}>{field.label}</label>
                            <input
                              style={styles.input}
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              value={selectedCustomer[field.name] || ''}
                              onChange={handleChange}
                              placeholder={field.label}
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        {formFields.slice(Math.ceil(formFields.length / 2)).map((field) => (
                          <div key={field.name} style={styles.formGroup}>
                            <label htmlFor={field.name} style={styles.label}>{field.label}</label>
                            <input
                              style={styles.input}
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              value={selectedCustomer[field.name] || ''}
                              onChange={handleChange}
                              placeholder={field.label}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={styles.formActions}>
                      <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                      <button style={styles.saveBtn} onClick={handleUpdate}>Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className={`toast-message ${messageType}`}>
          <span className="toast-icon">
            {messageType === 'success' ? (
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            )}
          </span>
          <span className="toast-text">{message}</span>
        </div>
      )}
    </div>
  );
};

export default UpdateCustomer;