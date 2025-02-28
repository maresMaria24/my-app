import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import {useAuth} from '../AuthContext';
import { Link } from 'react-router-dom';


function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      const data = await response.json();
      login(data.user, data.token);
      console.log(data.user);
      navigate('/Home');
    } catch (error) {
      setError('Authentication failed');
      console.error('Authentication failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={6}>
                  <img src="path_to_your_image" alt="Your Image" className="img-fluid" />
                </Col>
                <Col sm={6}>
                  <h1>Pagina de autentificare</h1>
                  <p>Loghează-te pentru a continua.</p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        className="text-left"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Parola</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        className="text-left"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <br></br>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Se incarca...' : 'Logare'}
                    </Button>
                  </Form>
                  <p className="mt-3">Nu ai cont?<a href="/register">Inregistrare</a></p>
                  <p className="mt-3">Esti profesor? <a href="/RegisterTeacher">Inregistrare ca profesor</a></p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
