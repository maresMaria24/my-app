import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Navbar, Nav, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import '../styles/styles.css'; // Importăm fișierul CSS cu stilurile noastre personalizate

function Profile() {
  const navigate = useNavigate();
  const { userEmail, isLoggedIn, logout, user } = useAuth();
  const [userCourses, setUserCourses] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      getUserCoursesFromDatabase();
    }
  }, [isLoggedIn, user, navigate]);

  const getUserCoursesFromDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getUserCourses/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handleViewCourse = (courseId) => {
    navigate(`/curs/${courseId}`);
  };

  if (!isLoggedIn) {
    return null; // Or a loading spinner, or a message, etc.
  }

  return (
    <Container className="profile-page">
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
                      <p className="my-auto me-3">{userEmail}</p>
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
        </Card.Body>
      </Card>
      <Row>
        <Col sm={4}>
          <Card className="my-2 card-custom">
            <Card.Body>
              <h2>Cursurile Mele</h2>
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
            </Card.Body>
          </Card>
        </Col>
        <Col sm={8}>
          <Card className="my-2 card-custom">
            <Card.Body>
              <h1>Profile</h1>
              <p>Username: {user.utilizator}</p>
              <p>Email: {user.email}</p>
              <p>Rol: {user.rol}</p>
              {/* Adaugă alte informații despre utilizator aici */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
