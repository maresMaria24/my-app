import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function RegisterTeacher() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkCv, setCvLink] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [submitted, setSubmitted] = useState(false); // Variabilă pentru a controla dacă formularul a fost trimis
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const acces = true; // Setează accesul pe true by default
    const data = { username, email, password,linkCv }; 
    try {
      const response = await fetch('http://localhost:3001/addTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.status === 400) {
        setRegistrationMessage('Email-ul a fost deja folosit!');
      } else if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setRegistrationMessage('Mulțumim pentru înregistrare! Contul dvs. se află în etapa de verificare.');
        setSubmitted(true);
      } else {
        setRegistrationMessage('A apărut o eroare. Vă rugăm să încercați din nou.');
      }
    } catch (error) {
      console.error('Error:', error);
      setRegistrationMessage('A apărut o eroare. Vă rugăm să încercați din nou.');
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={12}>
                  <h1>Pagina de inregistrare profesor</h1>
                  <p>Completeaza formularul de mai jos pentru rolul de profesor:</p>
                  {!submitted ? ( // Afisam input-urile doar daca formularul nu a fost trimis
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formBasicUsername">
                        <Form.Label>Nume utilizator</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="text-left"
                        />
                      </Form.Group>
  
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="text-left"
                        />
                      </Form.Group>
  
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Parola</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="text-left"
                        />
                      </Form.Group>
                      
                      <Form.Group controlId="formBasicCVLink">
                        <Form.Label>Link CV</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter CV link"
                          value={linkCv}
                          onChange={(e) => setCvLink(e.target.value)}
                          className="text-left"
                        />
                      </Form.Group>
                      <br></br>
                      <Button variant="primary" type="submit">
                        Trimite cererea
                      </Button>
                    </Form>
                  ) : (
                    // Afisam mesajul de inregistrare daca formularul a fost trimis
                    <p className="text-success">{registrationMessage}</p>
                  )}
                  {registrationMessage && !submitted && (
                    <p className="text-danger">{registrationMessage}</p>
                  )}
                  <p className="mt-3">Ai deja cont? <Link to="/login">Loghează-te</Link></p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterTeacher;
