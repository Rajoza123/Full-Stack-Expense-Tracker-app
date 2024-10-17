import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './RegisterForm.css'; // Custom styles
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/register', formData);
      alert('registration seccussful')
    } catch (error) {
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  return (
    <Container className="register-form-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="form-title text-center">Create an Account</h2>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-gradient">
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mt-3">
              Register
            </Button>
          </Form>
          {message && <p className="mt-3 text-center message">{message}</p>}
          <p className="text-center mt-3">
            Already have an account ? <Link to="/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
