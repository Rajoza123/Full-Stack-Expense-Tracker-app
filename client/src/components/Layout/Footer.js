import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import icons
import './Footer.css'; // Custom CSS for the footer

const Footer = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row>
          <Col md={4} className="footer-col">
            <h5>About MyApp</h5>
            <p className="footer-description">
              A compact expense tracker to manage your finances effortlessly.
            </p>
          </Col>
          <Col md={4} className="footer-col">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </Col>
          <Col md={4} className="footer-col">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
            <h5>Contact Us</h5>
            <p>Email: info@myapp.com</p>
            <p>Phone: +123 456 789</p>
          </Col>
        </Row>
        <Row className="text-center mt-3">
          <Col>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} MyApp. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
