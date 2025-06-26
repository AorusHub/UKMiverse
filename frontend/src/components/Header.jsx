import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <img src="/logo-unhas.svg" alt="Logo Unhas" className="logo" />
          <div className="logo-text">
            <h1>UKMiverse</h1>
            <p>Universitas Hasanuddin</p>
          </div>
        </div>
        
        {/* Hamburger Menu Button */}
        <button className="hamburger" onClick={toggleMenu}>
          <span className={`line ${isMenuOpen ? 'line1' : ''}`}></span>
          <span className={`line ${isMenuOpen ? 'line2' : ''}`}></span>
          <span className={`line ${isMenuOpen ? 'line3' : ''}`}></span>
        </button>
        
        <nav className={`navigation ${isMenuOpen ? 'navigation-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/daftar-ukm" className="nav-link" onClick={() => setIsMenuOpen(false)}>Daftar UKM</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
