import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/styles.css';

function Discussion() {
  const navigate = useNavigate();
  const { userEmail, isLoggedIn, logout, user } = useAuth();
  const { id: questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [course, setCourseDetails] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      getQuestionAndComments();
    }
  }, [isLoggedIn, questionId]);

  const getQuestionAndComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getIntrebare/${questionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.question) {
          const questionData = data.question;
          console.log(questionData[0])
          const commentsData = data.comments || [];
          setQuestion(questionData[0]);
          setComments(commentsData);
          
          setCourseDetails(questionData[0].curs);
          getCourseDetails(questionData[0].curs);
        } else {
          console.error('No question found');
        }
      } else {
        console.error('Error fetching question and comments:', response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:3001/cursDis/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCourseDetails(data[0]);
        
      } else {
        console.error('Error fetching course details:', response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleNewComment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/addRaspuns/${questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment, autor: user ? user.utilizator : '', curs: question.curs })
      });

      if (response.ok) {
        getQuestionAndComments(); // Refresh comments after adding a new one
        setNewComment('');
        setShowCommentInput(false);
      } else {
        console.error('Error adding comment:', response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  if (!isLoggedIn) {
    return null; // Or a loading spinner, or a message, etc.
  }

  return (
    <Container className="discussion-page">
      <Card className="my-4 card-custom">
        <Card.Body>
          <Navbar expand="lg" className="navbar-custom">
            <Container fluid>
              <Navbar.Brand href="/home">BrainIT</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ maxHeight: '100px' }}>
                  <Nav.Link className="nav-item nav-link" onClick={() => navigate('/Classes')}>Cursuri</Nav.Link>
                  {user && user.rol === 'admin' && (
                    <Nav.Link className="nav-item nav-link" onClick={() => navigate('/TeacherListPage')}>Cereri profesori</Nav.Link>
                  )}
                  <Nav.Link className="nav-item nav-link" onClick={() => navigate('/Forum')}>Forum</Nav.Link>
                  <Nav.Link className="nav-item nav-link" onClick={() => navigate('/profile')}>Profilul meu</Nav.Link>
                </Nav>
                <Form className="d-flex">
                  {isLoggedIn ? (
                    <>
                      <p className="my-auto me-3">{userEmail}</p>
                      <Button variant="outline-danger" onClick={logout}>Logout</Button>
                    </>
                  ) : (
                    <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ maxHeight: '100px' }}>
                      <Nav.Link href="/login" active>Login</Nav.Link>
                    </Nav>
                  )}
                </Form>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Card.Body>
      </Card>
      <Row>
        <Col>
          <Card className="my-2 card-custom">
            <Card.Body>
              {question && (
                <>
                  <h2>{question.titlu}</h2>
                  <p>{question.descriere}</p>
                  <p><strong>Curs:</strong> {course ? course.nume : 'Se încarcă...'}</p>
                  {isLoggedIn && (
                    <>
                      {!showCommentInput ? (
                        <Button variant="primary" onClick={() => setShowCommentInput(true)} className="mt-2">
                          Adaugă comentariu
                        </Button>
                      ) : (
                        <Form>
                          <Form.Group controlId="newComment">
                            <Form.Label>Adaugă un comentariu</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                          </Form.Group>
                          <div className="mt-2">
                            <Button variant="primary" onClick={handleNewComment} className="me-2">
                              Adaugă
                            </Button>
                            <Button variant="secondary" onClick={() => setShowCommentInput(false)}>
                              Anulează
                            </Button>
                          </div>
                        </Form>
                      )}
                    </>
                  )}
                  <hr />
                  <h4>Comentarii</h4>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <Card key={index} className="my-2 reply-card">
                        <Card.Body>
                          <p><strong>Autor:</strong> {comment.autor}</p>
                          <p><strong>Data:</strong> {new Date(comment.dataCreare).toLocaleString()}</p>
                          <hr />
                          <p>{comment.text}</p>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>Nu există comentarii încă.</p>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Discussion;
