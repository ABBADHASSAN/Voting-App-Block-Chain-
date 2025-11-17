import React from 'react';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {year} Voting Portal. All rights reserved. New era with Block Chain</p>
      </div>
    </footer>
  );
}

export default Footer;


