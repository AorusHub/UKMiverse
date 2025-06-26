import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <section className="about-section">
        <div className="container">
          <h1 className="about-title">ABOUT US</h1>
          
          <div className="about-content">
            <div className="about-left">
              <h2 className="ukmiverse-title">UKMiverse</h2>
              <p className="ukmiverse-description">
                adalah dunia interaktif organisasi kampus yang memungkinkan mahasiswa untuk mengeksplorasi, 
                mengenal, dan bergabung dengan Unit Kegiatan Mahasiswa (UKM) sesuai dengan minat dan bakat 
                mereka.
              </p>
              
              <div className="mission-card">
                <div className="mission-icon">
                  <div className="star-icon">⭐</div>
                </div>
                <p className="mission-text">
                  Kami hadir untuk membantu mahasiswa menemukan komunitas yang tepat untuk 
                  berkembang, berkreasi, dan berkontribusi di luar ruang kelas.
                </p>
              </div>
              
              <div className="vision-card">
                <div className="vision-icon">
                  <div className="gear-icon">⚙️</div>
                </div>
                <p className="vision-text">
                  UKMiverse dikelola oleh tim pengembang kampus yang peduli terhadap perkembangan mahasiswa, 
                  dengan tujuan memudahkan akses informasi UKM dan mendorong partisipasi aktif di lingkungan 
                  organisasi kampus.
                </p>
              </div>
            </div>
            
            <div className="about-right">
              <div className="illustration">
                <div className="floating-elements">
                  <div className="element element-1">🎭</div>
                  <div className="element element-2">🏀</div>
                  <div className="element element-3">🎵</div>
                  <div className="element element-4">⚽</div>
                  <div className="element element-5">🎯</div>
                  <div className="element element-6">🏓</div>
                  <div className="element element-7">🎤</div>
                </div>
                <div className="main-illustration">
                  <div className="character character-green">🟢</div>
                  <div className="character character-yellow">🟡</div>
                  <div className="browser-window">
                    <div className="browser-header">
                      <div className="browser-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="browser-content">
                      <div className="content-lines">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line short"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="cta-bottom">
                <h3>Jelajahi UKMiverse sekarang!</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
