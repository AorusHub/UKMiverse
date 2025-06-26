import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo-section">
            <img src="/logo-unhas.svg" alt="Logo Unhas" className="footer-logo" />
            <div className="footer-text">
              <h3>Universitas Hasanuddin</h3>
              <div className="footer-address">
                <p>Lantai 2, Gedung Rektorat Universitas Hasanuddin,</p>
                <p>Jl. Perintis Kemerdekaan Km. 10, Tamalanrea, Makassar</p>
                <p>90245, Sulawesi Selatan, Indonesia</p>
                <p>Telp: 0411-588200</p>
              </div>
            </div>
          </div>
          <div className="footer-contact">
            <h4>Kontak Kami</h4>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>Telp: +6285249598688</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>Telp: +628534209467</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>Email: reghni@bantara.co.id</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
