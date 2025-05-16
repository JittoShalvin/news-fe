import React from 'react';
import './css/footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} JittoShalvin. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;