import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button, Modal, Form, FormControl } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/styles.css'; // Importăm fișierul CSS

function Classes() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [nivel, setNivel] = useState('');
  const [autor, setAutor] = useState('');
  const [categorie, setCategorie] = useState('');
  const [cursuri, setCursuri] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null); // New state for editing course ID
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const { id } = useParams(); 

  const getCursuriFromDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3001/getCursuri');
      if (response.ok) {
        const data = await response.json();
        setCursuri(data);
      } else {
        console.error('Eroare la obținerea cursurilor:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  useEffect(() => {
    getCursuriFromDatabase();
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

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleClassesClick = () => {
    navigate('/Classes');
  };

  const handleForumClick = () => {
    navigate('/Forum');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setCourseName('');
    setCourseDescription('');
    setNivel('');
    setAutor('');
    setCategorie('');
    setEditingCourseId(null);
  };

  const handleAddCourse = async () => {
    try {
      const newCourse = {
        nume: courseName,
        descriere: courseDescription,
        nivel: nivel,
        autor: autor,
        categorie: categorie,
      };

      const response = await fetch('http://localhost:3001/addCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse)
      });
      if (response.ok) {
        console.log('Cursul a fost creat cu succes!');
        setShowModal(false);
        getCursuriFromDatabase();
      } else {
        console.error('Eroare la crearea cursului:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  const handleSaveCourse = async () => {
    try {
      const courseData = {
        nume: courseName,
        descriere: courseDescription,
        nivel: nivel,
        autor: autor,
        categorie: categorie
      };

      const method = editingCourseId ? 'PUT' : 'POST';
      const url = editingCourseId ? `http://localhost:3001/edit/${editingCourseId}` : 'http://localhost:3001/addCourse';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        console.log(editingCourseId ? 'Cursul a fost actualizat cu succes!' : 'Cursul a fost creat cu succes!');
        setShowModal(false);
        getCursuriFromDatabase();
      } else {
        console.error('Eroare la salvarea cursului:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  const handleViewDetails = (cursId) => {
    if (cursId) {
      navigate(`/curs/${cursId}`);
    } else {
      console.error('ID-ul cursului este invalid.');
    }
  };
  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleEditCourse = (curs) => {
    setCourseName(curs.nume);
    setCourseDescription(curs.descriere);
    setNivel(curs.nivel);
    setAutor(curs.autor);
    setCategorie(curs.categorie);
    setEditingCourseId(curs._id);
    setShowModal(true);
  };

  const handleDeleteCourse = async (cursId) => {
    try {
      const response = await fetch(`http://localhost:3001/delete/${cursId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Cursul a fost șters cu succes!');
        getCursuriFromDatabase();
      } else {
        console.error('Eroare la ștergerea cursului:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    }
  };

  if (!isLoggedIn) {
    return null; // Or a loading spinner, or a message, etc.
  }

  return (
    <Container>
      <Card className="my-4 card-custom">
        <Card.Body>
        <Navbar expand="lg" className="navbar-custom">
          <Container fluid>
            <Navbar.Brand href="/home">BrainIT</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ maxHeight: '100px' }}>
              <Nav.Link className="nav-item nav-link" onClick={handleClassesClick}>Cursuri</Nav.Link>
              {user && user.rol === 'admin' && (
                <Nav.Link className="nav-item nav-link" onClick={handleListClick}>Cereri profesori</Nav.Link>
              )}
              <Nav.Link className="nav-item nav-link" onClick={handleForumClick}>Forum</Nav.Link>
              <Nav.Link className="nav-item nav-link" onClick={handleProfileClick}>Profilul meu</Nav.Link>
            </Nav>
              <Form className="d-flex">
                {isLoggedIn ? (
                  <>
                    <p className="my-auto me-3 dark">{user.utilizator}</p>
                    <Button variant="outline-danger" onClick={handleAuthClick}>Logout</Button>
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
          <h1 className="mb-4">Cursurile mele</h1>
          <div className="d-flex mb-3">
          {user && user.rol === 'admin' && (
            <Button variant="primary button-custom" onClick={() => setShowModal(true)}>Adaugă Curs</Button>
          )}
            <Form className="ms-auto">
              <FormControl
                type="search"
                placeholder="Caută cursuri..."
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>
          </div>
          <Row className="mt-4">
            {cursuri
              .filter((curs) =>
                curs.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                curs.descriere.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((curs, index) => (
                <Col key={index} md={4} className="mb-4">
                  <Card className="card-custom">
                    <Card.Body style={{ position: 'relative' }}>
                      <h3>{curs.nume}</h3>
                      <p>{curs.descriere}</p>
                      <Button onClick={() => handleViewDetails(curs._id)}>Detalii</Button>
                      {user && user.rol === 'admin' && (
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleEditCourse(curs)}
                        style={{ position: 'absolute', top: 5, right: '40px', cursor: 'pointer' }}
                      />
                    )}
                      {user && user.rol === 'admin' && ( // Afișăm butonul de ștergere doar pentru admini
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handleDeleteCourse(curs._id)}
                          style={{ position: 'absolute', top: 5, right: '10px', cursor: 'pointer' }}
                        />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCourseId ? 'Modifică Curs' : 'Adaugă Curs Nou'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="courseName">
              <Form.Label>Nume Curs</Form.Label>
              <Form.Control type="text" placeholder="Introdu numele cursului" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="courseAutor">
              <Form.Label>Autor</Form.Label>
              <Form.Control type="text" placeholder="Introdu autorul cursului" value={autor} onChange={(e) => setAutor(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="courseNivel">
              <Form.Label>Nivel</Form.Label>
              <Form.Control type="text" placeholder="Introdu nivelul cursului" value={nivel} onChange={(e) => setNivel(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="courseCategorie">
              <Form.Label>Categorie</Form.Label>
              <Form.Control type="text" placeholder="Introdu categoria cursului" value={categorie} onChange={(e) => setCategorie(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="courseDescription">
              <Form.Label>Descriere Curs</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Introdu descrierea cursului" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Anulează
          </Button>
          <Button variant="primary button-custom" onClick={editingCourseId ? handleSaveCourse : handleAddCourse}>
            {editingCourseId ? 'Salvează Modificările' : 'Adaugă Curs'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Classes;
