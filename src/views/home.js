import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import axios from 'axios';

function Home() {
  const { isLoggedIn, userEmail, user, logout } = useAuth();
  const navigate = useNavigate();
  const [recomandari, setRecomandari] = useState([]);
  const [cursuri, setCursuri] = useState([]);
  const scrollRef = useRef(null);
  const [loading,setLoading] = useState(false);
  

  const fetchRecomandari = async () => {
    setLoading(true);
    try {
      const userId = user?._id; 
  
      if (!userId) {
        console.error('Lipsește user_id!');
        setLoading(false);
        return;
      }
  
      const response = await axios.get(`http://localhost:3001/api/recommendations`, {
        params: { user_id: userId }
      });
  
      setRecomandari(response.data);
    } catch (error) {
      console.error('Eroare la obținerea recomandărilor:', error);
    } finally {
      setLoading(false);
    }
  };
  

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

  const cursuriRecomandate = cursuri.filter(curs => recomandari.includes(curs._id));

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn && user && user._id) {
      getCursuriFromDatabase();
      fetchRecomandari();
    }
  }, [isLoggedIn, user]);

  const handleListClick = () => navigate('/TeacherListPage');
  const handleClassesClick = () => navigate('/Classes');
  const handleForumClick = () => navigate('/Forum');
  const handleProfileClick = () => navigate('/profile');

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };
  const handleViewDetails = (cursId) => {
    if (cursId) {
      navigate(`/curs/${cursId}`);
    } else {
      console.error('ID-ul cursului este invalid.');
    }
  };
  

  if (!isLoggedIn) {
    return null;
  }
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
        <h2 className="mb-4">Cursuri Recomandate</h2>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Se încarcă...</span>
            </Spinner>
          </div>
        ) : (
          <Row>
            {cursuriRecomandate.length > 0 ? (
              cursuriRecomandate.map((curs) => (
                <Col key={curs._id} md={4} className="mb-4">
                  <Card
                    className="card-custom"
                    style={{ minHeight: '200px', cursor: 'pointer' }}
                    onClick={() => handleViewDetails(curs._id)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <h4>{curs.nume}</h4>
                        <p>{curs.descriere}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>Nu există cursuri recomandate momentan.</p>
            )}
          </Row>
        )}
      </Card.Body>
    </Card>
  </Col>
</Row>


    </Container>
  );
}

export default Home;
