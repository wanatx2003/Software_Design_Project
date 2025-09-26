import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Discover Something New</h1>
              <h2>Make a Difference in Your Community</h2>
              <p>Our volunteer management platform connects passionate individuals with meaningful opportunities, updated regularly with the latest community needs.</p>
              <div className="hero-actions">
                <Link to="/register" className="btn-primary">
                  Start Volunteering
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Volunteer Services</h2>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <span>🏥</span>
              </div>
              <h3>Healthcare & Medical</h3>
              <p>Support healthcare initiatives and provide medical assistance to communities in need</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span>📚</span>
              </div>
              <h3>Education & Teaching</h3>
              <p>Share knowledge and help educate the next generation through tutoring and educational programs</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span>🏛️</span>
              </div>
              <h3>Community Building</h3>
              <p>Participate in community development projects and neighborhood improvement initiatives</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span>🎯</span>
              </div>
              <h3>Events & Workshops</h3>
              <p>Join our community events and skill-building workshops to make connections and learn new skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2>Why Choose Our Platform?</h2>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">✅</div>
                  <div className="feature-content">
                    <h4>Smart Matching</h4>
                    <p>Get matched with opportunities that align with your skills and availability</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-content">
                    <h4>Track Your Impact</h4>
                    <p>Monitor your volunteer hours and see the difference you're making</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🤝</div>
                  <div className="feature-content">
                    <h4>Community Network</h4>
                    <p>Connect with like-minded volunteers and build lasting relationships</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📱</div>
                  <div className="feature-content">
                    <h4>Easy Management</h4>
                    <p>Manage your volunteer schedule and commitments from one convenient platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>Getting Started</h3>
              <div className="info-content">
                <p><strong>Monday - Friday:</strong> 8:00 AM - 10:00 PM</p>
                <p><strong>Saturday - Sunday:</strong> 10:00 AM - 8:00 PM</p>
                <p>Support available during these hours for new volunteer registration and assistance.</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Contact Us</h3>
              <div className="info-content">
                <p><strong>Email:</strong> volunteer@university.edu</p>
                <p><strong>Phone:</strong> (123) 456-7890</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Location</h3>
              <div className="info-content">
                <p>Main Campus, Building C</p>
                <p>123 University Avenue</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of volunteers who are already making an impact in their communities</p>
            <div className="cta-actions">
              <Link to="/register" className="btn-cta">
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
