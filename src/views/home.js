import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form, Card } from 'react-bootstrap';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

function Home() {
  const { isLoggedIn, userEmail, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

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

  if (!isLoggedIn) {
    return null; // Or a loading spinner, or a message, etc.
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Card className="card-custom">
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
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card className="card-custom">
            <Card.Body>
              <h1>Bun venit pe platforma de training online BrainIT!</h1>
              <div>
                <p>Bine ai venit pe <strong>BrainIT</strong> - platforma ta de învățare online! Aici, ne propunem să îți oferim o experiență educațională captivantă și eficientă, care să te ajute să îți dezvolți abilitățile și cunoștințele într-un mediu interactiv și prietenos.</p>
                <p>Ce ne diferențiază? La <strong>BrainIT</strong>, te așteaptă:</p>
                <ul>
                  <li><strong>Cursuri Captivante:</strong> Descoperă o gamă variată de cursuri concepute pentru a-ți stimula mintea și a-ți dezvolta competențele în diverse domenii. De la programare și design la management și dezvoltare personală, avem cursuri pentru toate nivelurile și interesele.</li>
                  <li><strong>Interacțiune Socială:</strong> Conectează-te cu o comunitate vibrantă de învățători și cursanți din întreaga lume. Participă la forumuri de discuții, colaborăriază la proiecte și împărtășește-ți experiențele pentru a învăța împreună.</li>
                  <li><strong>Flexibilitate și Confort:</strong> Accesează cursurile noastre de oriunde și oricând, folosind dispozitivele tale preferate. Învață în ritmul tău, adaptându-ți programul de studiu la nevoile și obiectivele tale personale.</li>
                  <li><strong>Suport Personalizat:</strong> Echipa noastră dedicată este aici pentru tine, oferindu-ți suport și îndrumare pe tot parcursul călătoriei tale de învățare. Indiferent de întrebările sau dificultățile întâmpinate, suntem aici să te ajutăm să reușești.</li>
                </ul>
                <p>Începe astăzi să îți explorezi potențialul și să îți îndeplinești aspirațiile educative cu <strong>BrainIT</strong>. Bucură-te de o experiență de învățare captivantă și inspirațională, care să te conducă către succesul personal și profesional!</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card className="card-custom">
            <Card.Body>
              <h2>Explorează</h2>
              <Row>
                <Col>
                  <Card className="card-custom interactive-card" onClick={handleClassesClick} style={{ height: '200px' }}>
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                      <h3>Cursuri</h3>
                      <p>Descoperă o gamă variată de cursuri concepute pentru a-ți stimula mintea și a-ți dezvolta competențele în diverse domenii.</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="card-custom interactive-card" onClick={handleForumClick} style={{ height: '200px' }}>
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                      <h3>Forum</h3>
                      <p>Conectează-te cu o comunitate vibrantă de învățători și cursanți din întreaga lume.</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="card-custom interactive-card" onClick={handleProfileClick} style={{ height: '200px' }}>
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                      <h3>Profilul meu</h3>
                      <p>Accesează și editează informațiile tale personale și detaliile contului.</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
