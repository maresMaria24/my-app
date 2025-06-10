import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Button,
  ListGroup,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import '../styles/styles.css';

function Profile() {
  const navigate = useNavigate();
  const { userEmail, isLoggedIn, logout, user } = useAuth();
  const [userCourses, setUserCourses] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      getUserCoursesFromDatabase();
      fetchUserQuizResults();
    }
  }, [isLoggedIn, user]);

  const getUserCoursesFromDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getUserCourses/${user._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setUserCourses(data);
        }
      }
    } catch (error) {
      console.log('Eroare: ', error);
    }
  };

  const fetchUserQuizResults = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/quizResults');
      const userQuizzes = response.data.filter(result => result.studentId === user._id);
      setQuizResults(userQuizzes);
    } catch (error) {
      console.error('Eroare la obținerea testelor:', error);
    }
  };

  const handleOpenModal = (result) => {
    setSelectedResult(result);
    setShowModal(true);
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleNavigation = (path) => navigate(path);
  const handleViewCourse = (courseId) => navigate(`/curs/${courseId}`);

  if (!isLoggedIn) return null;

  return (
    <Container className="profile-page">
      <Card className="my-4 card-custom">
        <Card.Body>
          <Navbar expand="lg">
            <Container fluid>
              <Navbar.Brand href="/home">BrainIT</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ maxHeight: '100px' }}>
                  <Nav.Link onClick={() => handleNavigation('/Classes')}>Cursuri</Nav.Link>
                  {user?.rol === 'admin' && (
                    <>
                      <Nav.Link onClick={() => handleNavigation('/TeacherListPage')}>Cereri profesori</Nav.Link>
                      <Nav.Link onClick={() => handleNavigation('/QuizCheck')}>Teste</Nav.Link>
                    </>
                  )}
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
        </Card.Body>
      </Card>

      <Row>
        <Col sm={4}>
          <Card className="my-2 card-custom">
            <Card.Body style={{ minHeight: '596px' }}>
              <h2>Cursurile Mele</h2>
              <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {userCourses.length === 0 ? (
                  <p>Nu ai cursuri asignate.</p>
                ) : (
                  userCourses.map((course, index) => (
                    <Card key={index} className="my-2 card-custom">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <h3>{course.nume}</h3>
                          <Button variant="outline-primary" className="me-2" onClick={() => handleViewCourse(course._id)}>
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        </div>
                        <p>{course.descriere}</p>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={8}>
          <Card className="my-2 card-custom">
            <Card.Body>
              <h1>Profil</h1>
              <p><strong>Utilizator: </strong> {user.utilizator}</p>
              <p><strong>Email: </strong>{user.email}</p>
              <p><strong>Rol: </strong>{user.rol}</p>
            </Card.Body>
          </Card>

          <Card className="my-2 card-custom">
            <Card.Body>
              <h2>Testele mele</h2>
              <div style={{minHeight:'300px', maxHeight: '250px', overflowY: 'auto' }}>
                {quizResults.length === 0 ? (
                  <p>Nu ai teste trimise.</p>
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
                            <strong>{result.lessonTitle || 'Fără titlu'}</strong>
                            <div><small>Trimis la: {submittedDate}</small></div>
                            <div><small>Evaluat la: {evaluatedDate}</small></div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span>{result.nota != null ? `Notă: ${result.nota}` : 'Fără notă'}</span>
                            <Button variant="outline-primary" onClick={() => handleOpenModal(result)}>
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalii test: {selectedResult?.quizTitle || 'Fără titlu'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <>
              <h5>Răspunsuri:</h5>
              <ul>
                {selectedResult.answers.map((ans, index) => (
                  <li key={index} className="mb-2">
                    <strong>Întrebarea #{ans.questionIndex}: {ans.questionText}</strong><br />
                    <strong>Răspuns elev:</strong> {ans.answer}
                  </li>
                ))}
              </ul>
              <hr />
              <p><strong>Comentariu:</strong> {selectedResult.comentariu || 'Niciun comentariu'}</p>
              <p><strong>Notă:</strong> {selectedResult.nota != null ? selectedResult.nota : 'Nicio notă'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Închide</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profile;
