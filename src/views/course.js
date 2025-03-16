import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Navbar, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/styles.css'; // Importăm fișierul CSS

function CourseDetailsPage() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonFile, setLessonFile] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingLessonId, setEditingLessonId] = useState(null);
  const { user,isLoggedIn,logout } = useAuth();
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      const response = await fetch(`http://localhost:3001/curs/${id}/lectii`);
      console.log('Response ',response)
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        setLessons(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Eroare:', lessons);
    }
  };

  

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/curs/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setCourseDetails(data[0]);
            setLoading(false);
          } else {
            console.error('Nu s-au găsit detaliile pentru cursul cu ID-ul specificat.');
          }
        } else {
          console.error('Eroare la obținerea detaliilor cursului:', response.status);
        }
      } catch (error) {
        console.error('Eroare:', error.message);
      }
    };

    getCourseDetails();
  }, [id]);

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setLessonTitle('');
    setLessonContent('');
    setLessonFile(null);
    setEditingLessonId(null);
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/lectie/${lessonId}`);
  };
  const handleListClick = () => {
    if (isLoggedIn) {
      navigate('/TeacherListPage');
    } else {
      navigate('/login');
    }

  };
  const handleClassesClick = () => {
    if (isLoggedIn) {
      navigate('/Classes');
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

  const handleDeleteLesson = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:3001/lectie/${lessonId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setLessons(lessons.filter(lesson => lesson._id !== lessonId));
      } else {
        console.error('Eroare la ștergerea lecției:', response.status);
      }
    } catch (error) {
      console.error('Eroare la ștergerea lecției:', error);
    }
  };

  const handleEditLesson = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:3001/lectie/${lessonId}`);
      if (response.ok) {
        const lessonData = await response.json();
        setLessonTitle(lessonData.titlu);
        setLessonContent(lessonData.continut);
        setLessonFile(null);
        setEditingLessonId(lessonId);
        setShowModal(true);
      } else {
        console.error('Eroare la obținerea detaliilor lecției:', response.status);
      }
    } catch (error) {
      console.error('Eroare la obținerea detaliilor lecției:', error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [id]);


  const adaugaSiActualizeazaLectie = async () => {
    try {
      const requestData = {
        titlu: lessonTitle,
        continut: lessonContent,
        fisier: lessonFile,
      };

      const method = editingLessonId ? 'PUT' : 'POST';
      const url = editingLessonId ? `http://localhost:3001/lectie/${editingLessonId}` : `http://localhost:3001/curs/${id}/addLectii`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        //fetchLessons();
        handleCloseModal();
      } else {
        console.error('Eroare la încărcarea lecției:', response.status);
      }
    } catch (error) {
      console.error('Eroare la încărcarea lecției:', error);
    }
  };
  const handleAssignCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3001/asignare/${id}/${user._id}`, {
        method: 'PUT', // sau 'POST', în funcție de implementarea backend-ului
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cursId: id }) // trimite ID-ul cursului în corpul cererii
      });
      if (response.ok===200) {
        console.log('Cursul a fost asignat cu succes!');
        setMessage('Cursul a fost asignat cu succes!');
      } else {
        //console.log('Cursul este deja asignat!');
        setMessage('Cursul este deja asignat!');
      }
    } catch (error) {
      console.error('Eroare la asignarea cursului:', error);
      setMessage('Cursul nu a putut fi asignat!');
    }
  };
  
  

  return (
    <Container>
      <Navbar expand="lg" className="my-4 navbar-custom">
        <Container>
          <Navbar.Brand href="/Home">BrainIT</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ maxHeight: '100px' }}>
              <Nav.Link className="nav-item nav-link" onClick={handleClassesClick}>Cursurile mele</Nav.Link>
              {user.rol === 'admin' && (
                <Nav.Link className="nav-item nav-link"onClick={handleListClick}>Lista profesori</Nav.Link>
              )}
              <Nav.Link className="nav-item nav-link" onClick={handleForumClick}>Forum</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Card className="my-4 card-custom">
        <Card.Body>
          <h1>Detalii Curs</h1>
          {courseDetails ? (
            <div> 
              <div><h2>Numele Cursului: {courseDetails.nume}</h2>
              <div>
              <Button variant="primary button-custom" onClick={handleAssignCourse}>
                Asignează
              </Button>
              {message && ( // Afișăm Alert doar dacă message nu este gol
                <p className="text-success">{message}</p>
              )}
              </div>
              </div>
              <p>{courseDetails.descriere}</p>
              <p>Nivel: {courseDetails.nivel}</p>
              <p>Autor: {courseDetails.autor}</p>
              <p>Categorie: {courseDetails.categorie}</p>
              <hr />
              {(user && (user.rol === 'admin' || user.rol === 'profesor')) && (
                <Button variant="primary button-custom" onClick={() => setShowModal(true)}>
                  <FontAwesomeIcon icon={faPlus} />
                  Încarcă Lecție
                </Button>
              )}
            </div>
          ) : (
            <p>Se încarcă detaliile cursului...</p>
          )}
        </Card.Body>
      </Card>

      <Card className="my-4 card-custom">
        <Card.Body>
          <h2>Lecții</h2>
          {loading ? (
            <p>Se încarcă lecțiile...</p>
          ) :  lessons && lessons.length > 0 ? (
              <div className="list-group justify-content-end">
                {lessons.map((lesson, index) => (
                  <a
                    key={index}
                    className="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center"
                    onClick={() => handleLessonClick(lesson._id)}
                  >
                    <div>{lesson.titlu ? lesson.titlu : 'Lecție fără titlu'}</div>
                    <div>
                      {(user && (user.rol === 'admin' || user.rol === 'profesor')) && (
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="me-2"
                          onClick={(e) => { e.stopPropagation(); handleEditLesson(lesson._id); }}
                        />
                      )}
                      {user && user.rol === 'admin' && (
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson._id); }}
                        />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p>Nu există lecții disponibile pentru acest curs.</p>
            )
}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingLessonId ? 'Modifică Lecție' : 'Încarcă Lecție Nouă'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="lessonTitle">
              <Form.Label>Titlul Lecției</Form.Label>
              <Form.Control type="text" placeholder="Introdu titlul lecției" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="lessonContent">
              <Form.Label>Conținutul Lecției</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Introdu conținutul lecției" value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="lessonFile">
              <Form.Label>Fișierul Lecției</Form.Label>
              <Form.Control type="file" onChange={(e) => setLessonFile(e.target.files[0])} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Anulează
          </Button>
          <Button variant="primary button-custom" onClick={adaugaSiActualizeazaLectie}>
            {editingLessonId ? 'Salvează Modificările' : 'Încarcă Lecție'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CourseDetailsPage;
