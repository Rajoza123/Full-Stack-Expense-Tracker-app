import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './LoginForm.css'; // Custom styles
import { useNavigate,Link } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', formData);
      setMessage('Login successful! Token: ' + res.data.token);
      const token = res.data.token
      localStorage.setItem('token',token)
      navigate('/')
    } catch (error) {
      setMessage('Login failed: ' + error.response.data.message);
    }
  };

  return (
    <Container className="login-form-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="form-title text-center">Login to Your Account</h2>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-gradient">
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
              Login
            </Button>
          </Form>
          {message && <p className="mt-3 text-center message">{message}</p>}
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
