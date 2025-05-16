import React, { useState } from 'react';
import api from '../api/api'; // Adjust the path if necessary
import './css/EmployeeTransition.css';

const TransactionForm = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [customer, setCustomer] = useState(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomer = async () => {
    if (!mobileNo) {
      setMessage('Please enter a mobile number');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.get(`/customer/customer-by-mobile/${mobileNo}`);
      setCustomer(response.data);
      setMessage('');
      setMessageType('');
    } catch (error) {
      setCustomer(null);
      setMessage('Customer not found');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer) {
      setMessage('Please fetch a customer first');
      setMessageType('error');
      return;
    }

    if (!paidAmount && !purchaseAmount) {
      setMessage('Please enter either paid amount or purchase amount');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/transaction/transactions', {
        customer_id: customer.customer_id,
        old_customer_id: customer.old_customer_id,
        customer_name: customer.customer_name,
        mobile_no: customer.mobile_no,
        paid_amount: parseFloat(paidAmount || 0),
        purchase_amount: parseFloat(purchaseAmount || 0),
      });

      setMessage('Transaction added successfully');
      setMessageType('success');
      setPaidAmount('');
      setPurchaseAmount('');
    } catch (error) {
      console.error(error);
      setMessage('Error submitting transaction');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNewBalance = () => {
    if (!customer) return 0;
    
    const currentBalance = parseFloat(customer.balance_amount || 0);
    const paid = parseFloat(paidAmount || 0);
    const purchase = parseFloat(purchaseAmount || 0);
    
    return currentBalance - paid + purchase;
  };

  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Add Transaction</h2>
      
      {/* Mobile Number Section */}
      <div className="input-group">
        <label htmlFor="mobileNo">Mobile Number</label>
        <input
          id="mobileNo"
          type="text"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          placeholder="Enter customer mobile number"
        />
      </div>
      
      <button 
        type="button" 
        className="button secondary-button fetch-button"
        onClick={fetchCustomer}
        disabled={isLoading}
      >
        {isLoading ? 'Fetching...' : 'Fetch Customer'}
      </button>

      {/* Customer Information Card */}
      {customer && (
        <div className="customer-card form-animation">
          <div className="customer-info">
            <span className="info-label">Name:</span>
            <span className="info-value">{customer.customer_name}</span>
          </div>
          
          <div className="customer-info">
            <span className="info-label">Customer ID:</span>
            <span className="info-value">{customer.customer_id}</span>
          </div>
          
          <div className="customer-info">
            <span className="info-label">Old ID:</span>
            <span className="info-value">{customer.old_customer_id || 'N/A'}</span>
          </div>
          
          <div className="customer-info">
            <span className="info-label">Current Balance:</span>
            <span className="info-value balance-amount">₹{customer.balance_amount || 0}</span>
          </div>
        </div>
      )}

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="form-animation">
        <div className="input-group">
          <label htmlFor="paidAmount">Paid Amount</label>
          <div className="currency-input">
            <span className="currency-symbol">₹</span>
            <input
              id="paidAmount"
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder="Amount paid by customer"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="purchaseAmount">Purchase Amount</label>
          <div className="currency-input">
            <span className="currency-symbol">₹</span>
            <input
              id="purchaseAmount"
              type="number"
              step="0.01"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              placeholder="Amount of new purchase"
            />
          </div>
        </div>

        {/* Balance Preview */}
        {customer && (paidAmount || purchaseAmount) && (
          <div className="balance-display">
            <strong>New Balance:</strong> ₹{calculateNewBalance().toFixed(2)}
            <div className={`transaction-status ${calculateNewBalance() < parseFloat(customer.balance_amount || 0) ? 'status-updated' : 'status-pending'}`}>
              <span className="status-icon"></span>
              {calculateNewBalance() < parseFloat(customer.balance_amount || 0) ? 'Reduced' : 'Increased'}
            </div>
          </div>
        )}

        <div className="submit-section">
          <button 
            type="submit" 
            className="button primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit Transaction'}
          </button>
        </div>
      </form>

      {/* Messages */}
      {message && (
        <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default TransactionForm;