import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Navbar, Nav, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import JoditEditor from "jodit-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/styles.css'; 

function LecturePage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user, userEmail } = useAuth();
  const { id } = useParams();

  const [titlu, setLessonTitle] = useState('');
  const [continut, setLessonContent] = useState('');

  const [articoleLectie, setArticoleLectie] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [articolEditat, setArticolEditat] = useState(null);

  const handleCloseForm = () => {
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setLessonTitle('');
    setLessonContent('');
    setArticolEditat(null);
  };

  const handleSaveArticle = async () => {
    try {
      const Article = {
        titlu: titlu,
        continut: continut
      };

      const response = await fetch(`http://localhost:3001/articol/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Article)
      });
      if (response.ok) {
        console.log('Articolul a fost adăugat cu succes!');
        fetchArticoleLectie();
        fetchLesson();
        handleCloseForm(); 
      } else {
        console.error('Eroare la adăugarea articolului:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };
  const fetchLesson = async () => {
    try {
      const response = await fetch(`http://localhost:3001/lectie/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data[0]);
        setLessonContent(data[0].continut);
        setLessonTitle(data[0].titlu);

      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  const handleEditArticle = async () => {
    try {
      const updatedArticle = {
        titlu: titlu,
        continut: continut
      };
  
      const response = await fetch(`http://localhost:3001/articol/${articolEditat._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedArticle)
      });
  
      if (response.ok) {
        console.log('Articolul a fost actualizat cu succes! ID: ' + articolEditat._id);
        fetchArticoleLectie();
        handleCloseForm();
      } else {
        console.error('Eroare la actualizarea articolului:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/articol/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log('Articolul a fost șters cu succes! ' + id);
        fetchArticoleLectie();
      } else {
        console.error('Eroare la ștergerea articolului:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  const handleClassesClick = (lessonId) => {
    navigate(`/lectie/${lessonId}`);
  };
  const handleListClick = () => {
    if (isLoggedIn) {
      navigate('/TeacherListPage');
    } else {
      navigate('/login');
    }
  };

  const handleForumClick = () => {
    if (isLoggedIn) {
      navigate('/Forum');
    } else {
      navigate('/login');
    }
  };
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };
  
  const fetchArticoleLectie = async () => {
    try {
      const response = await fetch(`http://localhost:3001/articole/${id}`);
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setArticoleLectie(data);
        } else {
          console.error('Data received is not an array:', data);
          setArticoleLectie([]); 
        }
      } else {
        console.error('Eroare la preluarea articolelor lectiei:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
      setArticoleLectie([]); 
    }
  };

  useEffect(() => {
    fetchArticoleLectie();
  }, []);
  useEffect(() => {
    fetchLesson();
  }, []);
  const handleNavigation = (path) => navigate(path);
  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Card className="card-custom">
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
        </Col>
      </Row>
      <Card className="my-4 card-custom">
        <Card.Body>
          
          <div>
            <h2>{titlu}</h2>
          </div>
          <p>{continut}</p>
          {(user && (user.rol === 'admin' || user.rol === 'profesor')) && (
          <>
            <hr />
            <Button variant="primary button-custom" onClick={() => setShowAddForm(true)}>
              <FontAwesomeIcon icon={faPlus} />
              Încarcă Articol
            </Button>
          </>
        )}

        </Card.Body>
      </Card>

      {showAddForm && (
        <Modal show={showAddForm} onHide={handleCloseForm} enforceFocus={false}>
          <Modal.Header closeButton>
            <Modal.Title>{articolEditat ? 'Editează articol' : 'Adaugă articol'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="lessonArticle">
                <Form.Label>Titlu Articol</Form.Label>
                <Form.Control type="text" placeholder="Introdu titlul articolului" value={titlu} onChange={(e) => setLessonTitle(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="lessonContent">
                <Form.Label>Conținut articol</Form.Label>
                <JoditEditor
                  value={continut}
                  onChange={(newContent) => setLessonContent(newContent)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseForm}>Anulează</Button>
            {articolEditat ? (
              <Button className="button-custom" onClick={handleEditArticle}>Salvează Articol</Button>
            ) : (
              <Button className="button-custom" onClick={handleSaveArticle}>Salvează Articol</Button>
            )}
          </Modal.Footer>
        </Modal>
      )}

      {Array.isArray(articoleLectie) && articoleLectie.map((articol) => (
        <Card key={articol._id} className="my-4 card-custom card-custom-hover">
          <Card.Body>
            <h5>{articol.titlu}</h5>
            <div dangerouslySetInnerHTML={{ __html: articol.continut }}></div>
            {(user && (user.rol === 'admin' || user.rol === 'profesor')) && (
              <>
                <Button variant="info" onClick={() => {
                  setArticolEditat(articol);
                  setLessonTitle(articol.titlu);
                  setLessonContent(articol.continut);
                  setShowAddForm(true);
                }}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteArticle(articol._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default LecturePage;
