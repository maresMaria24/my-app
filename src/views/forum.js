import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button, Form, FormControl, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import '../styles/styles.css';

function Forum() {
  const navigate = useNavigate();
  const { userEmail, isLoggedIn, logout, user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  const getQuestionsFromDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3001/getIntrebari', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        console.error('Eroare la obținerea întrebărilor:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  const getCoursesFromDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3001/getCursuri', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Eroare la obținerea cursurilor:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  useEffect(() => {
    getQuestionsFromDatabase();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleHomeClick = () => {
    navigate('/Home');
  };

  const handleListClick = () => {
    navigate('/TeacherListPage');
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleClassesClick = () => {
    navigate('/Classes');
  };

  const handleForumClick = () => {
    navigate('/Forum');
  };

  const handleUploadQuestion = () => {
    getCoursesFromDatabase();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setQuestionTitle('');
    setQuestionDescription('');
    setSelectedCourse('');
  };

  const handleSaveQuestion = async () => {
    try {
      const newQuestion = {
        titlu: questionTitle,
        descriere: questionDescription,
        autor: user.utilizator,
        cursId: selectedCourse,
        data: new Date()
      };

      const response = await fetch('http://localhost:3001/addIntrebare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion)
      });

      if (response.ok) {
        console.log('Întrebarea a fost adăugată cu succes!');
        setShowModal(false);
        getQuestionsFromDatabase();
      } else {
        console.error('Eroare la adăugarea întrebării:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  const handleViewDiscussion = (questionId) => {
    navigate(`/discussion/${questionId}`);
  };

  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  if (!isLoggedIn) {
    return null;
  }
  const handleNavigation = (path) => navigate(path);
  return (
    <Container className="forum-page">
      <Card className="my-4 card-custom">
        <Card.Body>
         <Navbar expand="lg" >
                <Container fluid>
                  <Navbar.Brand href="/home">BrainIT</Navbar.Brand>
                  <Navbar.Toggle aria-controls="navbarScroll" />
                  <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ maxHeight: '100px' }}>
                      <Nav.Link onClick={() => handleNavigation('/Classes')}>Cursuri</Nav.Link>
                      {user && user.rol === 'admin' && (
                        <Nav.Link onClick={() => handleNavigation('/TeacherListPage')}>Cereri profesori</Nav.Link>
                        
                      )}
                        {user && user.rol === 'admin' && (
                        <Nav.Link onClick={() => handleNavigation('/QuizCheck')}>Teste</Nav.Link>
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
        <Col>
          <Card className="my-2 card-custom">
            <Card.Body>
              <div className="d-flex mb-3">
                <Button variant="primary button-custom" onClick={handleUploadQuestion}>
                  <FontAwesomeIcon icon={faPlus} /> Încarcă Întrebare
                </Button>
                <Form className="ms-auto d-flex">
                  <FormControl
                    type="search"
                    placeholder="Caută întrebări..."
                    className="me-2"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-secondary">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </Form>
              </div>
              {questions.filter(q => q.titlu.toLowerCase().includes(searchTerm.toLowerCase())).map((question, index) => (
                <Card key={index} className="my-2 card-custom">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <h3>{question.titlu}</h3>
                      <Button variant="outline-primary" className="me-2" onClick={() => handleViewDiscussion(question._id)}>
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </div>
                    <p>{truncateString(question.descriere, 85)}</p>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Încărcați o nouă întrebare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="questionTitle">
              <Form.Label>Titlu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu titlul întrebării"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="questionDescription" className="mt-3">
              <Form.Label>Descriere</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Introdu descrierea întrebării"
                value={questionDescription}
                onChange={(e) => setQuestionDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="questionCourse" className="mt-3">
              <Form.Label>Curs</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Selectează un curs</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.nume}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Anulează
          </Button>
          <Button variant="primary" onClick={handleSaveQuestion}>
            Salvează Întrebarea
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Forum;
