import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button, Modal, Form, FormControl, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/styles.css';

function Classes() {
  const navigate = useNavigate();
  const { userEmail, isLoggedIn, logout, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [nivel, setNivel] = useState('');
  const [autor, setAutor] = useState('');
  const [categorie, setCategorie] = useState('');
  const [cursuri, setCursuri] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const { id } = useParams(); 
  const [loading, setLoading] = useState(false);

  const getCursuriFromDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/getCursuri');
      if (response.ok) {
        const data = await response.json();
        setCursuri(data);
        setFilteredCourses(data);
      } else {
        console.error('Eroare la obținerea cursurilor:', response.status);
      }
    } catch (error) {
      console.error('Eroare:', error.message);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filtered = cursuri.filter((curs) =>
        curs.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curs.descriere.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
      saveSearch(searchTerm, filtered); 
    }, 600);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, cursuri]);

  const saveSearch = async (query, matchedCourses) => {
    if (!query.trim()) {
      console.log('Termenul de căutare este gol, nu se trimite cererea.');
      return; 
    }
    const courseIds = matchedCourses.map(course => course._id);
    try {
      const response = await fetch('http://localhost:3001/addSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user._id,
          query: query,
          matched_courses: courseIds,
          timestamp: new Date(),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Căutarea a fost salvată cu ID-ul:', result.insertedId);
      } else {
        console.error('Eroare la salvarea căutării:', response.status);
      }
    } catch (error) {
      console.error('Eroare la trimiterea cererii de căutare:', error);
    }
  };

  const handleNavigation = (path) => navigate(path);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
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
    return null; 
  }

  return (
    <Container>
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

      <Card className="my-4 card-custom">
        <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="m-0">Cursurile mele</h1>
        <Form className="d-flex" style={{ maxWidth: '300px' }}>
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
      {user && user.rol === 'admin' && (
        <Button variant="primary button-custom" onClick={() => setShowModal(true)} className="mb-3">
          Adaugă Curs
        </Button>
      )}
      <hr />
          <Row className="mt-4">
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              filteredCourses.length > 0 ? (
                filteredCourses.map((curs, index) => (
                  <Col key={index} md={4} className="mb-4">
                    <Card className="card-custom" style={{ minHeight: '200px' }}>
                    <Card.Body className="d-flex flex-column justify-content-between" style={{ minHeight: '200px', position: 'relative' }}>
                  <div>
                    <h3 className="text-center mt-2">{curs.nume}</h3>
                    <p className="text-start">{curs.descriere}</p>
                  </div>
                  <div className="d-flex justify-content-end align-items-end mt-auto">
                    <Button onClick={() => handleViewDetails(curs._id)} className="mt-3">Detalii</Button>
                  </div>

                  {user && user.rol === 'admin' && (
                    <>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleEditCourse(curs)}
                        style={{ position: 'absolute', top: 5, right: '40px', cursor: 'pointer' }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteCourse(curs._id)}
                        style={{ position: 'absolute', top: 5, right: '10px', cursor: 'pointer' }}
                      />
                    </>
                  )}
                </Card.Body>

                    </Card>
                  </Col>
                ))
              ) : (
                <p>Nu s-au găsit cursuri.</p>
              )
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Modal adaugare/modificare curs */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCourseId ? 'Modifică Curs' : 'Adaugă Curs Nou'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="courseName" className="mb-3">
              <Form.Label>Nume Curs</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu numele cursului"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="courseAutor" className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu autorul cursului"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="courseNivel" className="mb-3">
              <Form.Label>Nivel</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu nivelul cursului"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="courseCategorie" className="mb-3">
              <Form.Label>Categorie</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu categoria cursului"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="courseDescription" className="mb-3">
              <Form.Label>Descriere Curs</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Introdu descrierea cursului"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Anulează</Button>
          <Button
            variant="primary button-custom"
            onClick={editingCourseId ? handleSaveCourse : handleAddCourse}
          >
            {editingCourseId ? 'Salvează Modificările' : 'Adaugă Curs'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Classes;
