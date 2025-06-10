import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, ListGroup, Navbar, Nav, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';

function TeacherListPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (user.rol !== 'admin') {
      navigate('/home');
    } else {
      fetchTeachers();
    }
  }, [isLoggedIn, user, navigate]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3001/getTeachers');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTeachers(data);
      } else {
        console.error('Error fetching teachers:', response.status);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleViewTeacherDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const handleConfirmDelete = async (teacherId) => {
    try {
      const response = await fetch('http://localhost:3001/deleteTeacher', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: teacherId })
      });
      if (response.ok) {
        setTeachers(teachers.filter(teacher => teacher._id !== teacherId));
      } else {
        console.error('Error deleting teacher:', response.status);
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const sendConfirmationEmail = async (email, name) => {
    try {
      const response = await fetch('http://localhost:3001/confirmare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name })
      });
      if (response.ok) {
        console.log('Confirmation email sent successfully!');
      } else {
        console.error('Error sending confirmation email:', response.status);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:3001/updateTeacher', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedTeacher._id })
      });
      if (response.ok) {
        console.log("Profesorul a fost confirmat:", selectedTeacher);
        setTeachers(teachers.map(teacher =>
          teacher._id === selectedTeacher._id
            ? { ...teacher, acces: true, rol: 'profesor' }
            : teacher
        ));
        await sendConfirmationEmail(selectedTeacher.email, selectedTeacher.utilizator);
        fetchTeachers();
        setShowModal(false);
      } else {
        console.error('Error confirming teacher:', response.status);
      }
    } catch (error) {
      console.error('Error confirming teacher:', error);
    }
  };

  const handleListClick = () => {
    navigate('/TeacherListPage');
  };

  const handleClassesClick = () => {
    navigate('/Classes');
  };

  const handleForumClick = () => {
    navigate('/Forum');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };
  if (!isLoggedIn || (user && user.rol !== 'admin')) {
    return null;
  }
  return (
    <Container>
      <Card className="my-4 card-custom">
        <Navbar expand="lg" >
          <Container fluid>
            <Navbar.Brand href="#">BrainIT</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ maxHeight: '100px' }}>
                <Nav.Link className="nav-item nav-link" onClick={handleClassesClick}>Cursuri</Nav.Link>
                <Nav.Link className="nav-item nav-link" onClick={handleListClick}>Cereri profesori</Nav.Link>
                <Nav.Link className="nav-item nav-link" onClick={handleForumClick}>Forum</Nav.Link>
                <Nav.Link className="nav-item nav-link" onClick={handleConfirm}>Profilul meu</Nav.Link>
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
      </Card>
      <Card className="my-4 card-custom">
        <Card.Body>
          <Card.Title>Cereri de profesori</Card.Title>
          <ListGroup>
            {teachers.length === 0 ? (
              <div>Nu exista in acest moment cereri :)</div>
            ) : (
              teachers.map((teacher) => (
                <ListGroup.Item key={teacher._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <div>{teacher.email}</div>
                  </div>
                  <div>
                    <Button variant="outline-primary" className="me-2" onClick={() => handleViewTeacherDetails(teacher)}>
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleConfirmDelete(teacher._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalii profesori</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeacher && (
            <div>
              <p>Name: {selectedTeacher.utilizator}</p>
              <p>Email: {selectedTeacher.email}</p>
              <p>CV Link: {selectedTeacher.linkCv}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleConfirmDelete(selectedTeacher._id)}>
            Delete
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default TeacherListPage;
