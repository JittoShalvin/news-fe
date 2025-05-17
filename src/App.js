import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import WelcomePage from './pages/welcome';

import Webscraper from './pages/webscrap';

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/']; // Hide Navbar on the welcome page if needed

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<WelcomePage />} />

            <Route path="/anlysis" element={<Webscraper />} />
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
