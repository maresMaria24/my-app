import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Navbar, Nav, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
import '../styles/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function QuizCheck() {
  const [quizResults, setQuizResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comentariu, setComentariu] = useState('');
  const [nota, setNota] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, userEmail, user, logout } = useAuth();

  useEffect(() => {
    fetchQuizResults();
  }, []);

  const fetchQuizResults = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/quizResults');
      setQuizResults(response.data);
    } catch (error) {
      console.error('Eroare la obținerea rezultatelor:', error);
    }
  };

  const handleOpenModal = (result) => {
    setSelectedResult(result);
    setComentariu(result.comentariu || '');
    setNota(result.nota || '');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:3001/api/quizResults/${selectedResult._id}/evaluate`, {
        comentariu,
        nota,
      });
      setShowModal(false);
      fetchQuizResults();
    } catch (error) {
      console.error('Eroare la salvarea evaluării:', error);
    }
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleNavigation = (path) => navigate(path);

  if (!isLoggedIn || (user && user.rol !== 'admin')) return null;

  return (
    <Container>
      <Card className="my-4 card-custom">
        <Navbar expand="lg" >
          <Container fluid>
            <Navbar.Brand href="#">BrainIT</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto navbar-nav-scroll" style={{ maxHeight: '100px' }}>
                <Nav.Link onClick={() => handleNavigation('/Classes')}>Cursuri</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/TeacherListPage')}>Cereri profesori</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/QuizCheck')}>Teste</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/Forum')}>Forum</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/profile')}>Profilul meu</Nav.Link>
              </Nav>
              <div className="d-flex">
                {isLoggedIn ? (
                  <>
                    <p className="my-auto me-3">{userEmail}</p>
                    <Button variant="outline-danger" onClick={handleAuthClick}>Logout</Button>
                  </>
                ) : (
                  <Nav.Link href="/login">Login</Nav.Link>
                )}
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Card>

      <Card className="my-4 card-custom">
        <Card.Body>
          <Card.Title>Rezultate Quiz Trimise</Card.Title>
          {quizResults.length === 0 ? (
            <p>Nu există teste de evaluat.</p>
          ) : (
            <ListGroup>
            {quizResults.map((result) => {
              const submittedDate = new Date(result.submittedAt).toLocaleString('ro-RO');
              const evaluatedDate = result.evaluatLa
                ? new Date(result.evaluatLa).toLocaleString('ro-RO')
                : '-';
          
              return (
                <ListGroup.Item
                  key={result._id}
                  className="d-flex justify-content-between align-items-center"
                  style={{ minHeight: '100px' }}
                >
                  <div>
                    <strong>{result.studentName}</strong> – {result.lessonTitle || 'Fără titlu'}
                    <div><small>Trimis la: {submittedDate}</small></div>
                    <div><small>Evaluat la: {evaluatedDate}</small></div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span>{result.nota != null ? 'Notat' : 'Fără notă'}</span>
                    <Button variant="outline-primary" onClick={() => handleOpenModal(result)}>
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          
          
          
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalii test: {selectedResult?.quizTitle || 'Fără titlu'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <>
              <h5>Răspunsuri elev:</h5>
              <ul>
                {selectedResult.answers.map((ans, index) => (
                  <li key={index} className="mb-2">
                    <strong>Întrebarea #{ans.questionIndex}: {ans.questionText}</strong><br />
                    <strong>Răspuns elev:</strong> {ans.answer}
                  </li>
                ))}
              </ul>

              {selectedResult.nota === null || selectedResult.nota === undefined ? (
                <>
                  <Form.Group className="mt-3">
                    <Form.Label>Comentariu:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comentariu}
                      onChange={(e) => setComentariu(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Notă:</Form.Label>
                    <Form.Control
                      type="number"
                      value={nota}
                      onChange={(e) => setNota(e.target.value)}
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  <p><strong>Comentariu:</strong> {selectedResult.comentariu || 'Niciun comentariu'}</p>
                  <p><strong>Notă:</strong> {selectedResult.nota}</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Închide</Button>
          {(selectedResult?.nota === null || selectedResult?.nota === undefined) && (
            <Button variant="success" onClick={handleSave}>
              Salvează evaluarea
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default QuizCheck;
