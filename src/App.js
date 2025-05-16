import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateAdmin from './pages/CreateAdmin';
import UpdatePayment from './pages/UpdatePayment';
import CreateJob from './pages/CreateJob';
import CreateNewCustomer from './pages/CreateNewCustomer';
import DeleteCustomer from './pages/DeleteCustomer';
import JobManagement from './pages/JobManagement';
import CustomerTransition from './pages/CustomerTransition';
import AdminList from './pages/AdminList';
import UpdateCustomer from './pages/updatecustomer';
import Footer from './components/footer';

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/']; // Hide Navbar on login page

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/create-admin" element={<CreateAdmin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/update-payment" element={<UpdatePayment />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/create-new-customer" element={<CreateNewCustomer />} />
            <Route path="/delete-customer" element={<DeleteCustomer />} />
            <Route path="/job-management" element={<JobManagement />} />
            <Route path="/customer-transition" element={<CustomerTransition />} />
            <Route path="/admin-list" element={<AdminList />} />
            <Route path="/update-customer" element={<UpdateCustomer />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
