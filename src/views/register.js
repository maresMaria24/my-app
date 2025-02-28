import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkCv, setlinkCV] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [isElev, setIsElev] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStudentChange = (checked) => {
    if (checked) {
      setIsElev(false);
    }
    setIsStudent(checked);
  };

  const handleElevChange = (checked) => {
    if (checked) {
      setIsStudent(false);
    }
    setIsElev(checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const rol = isStudent ? 'student' : 'elev';
    const acces = true; 
    const data = { username, email, password, rol };
    try {
      const response = await fetch('http://localhost:3001/addUser', {
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
                <Col sm={6}>
                  <h1>Pagina de inregistrare</h1>
                  <p>Completeaza formularul de mai jos:</p>
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

                      <Form.Group as={Row}>
                        <Form.Label as="legend" column sm={3}>
                          Selectați
                        </Form.Label>
                        <Col sm={9}>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Sunt student"
                            checked={isStudent}
                            onChange={(e) => handleStudentChange(e.target.checked)}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Sunt elev"
                            checked={isElev}
                            onChange={(e) => handleElevChange(e.target.checked)}
                          />
                        </Col>
                      </Form.Group>
                      
                      <Button variant="primary" type="submit">
                        Inregistrare
                      </Button>
                    </Form>
                  ) : (
                    <p className="text-success">{registrationMessage}</p>
                  )}
                  {registrationMessage && !submitted && (
                    <p className="text-danger">{registrationMessage}</p>
                  )}
                  <p className="mt-3">Ai deja cont? <a href="/Login">Logheaza-te</a></p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
