import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

function Quiz({ isOpen, onClose, lessons }) {
  const [selectedLesson, setSelectedLesson] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const { userEmail, isLoggedIn, logout, user } = useAuth();

  const handleLessonChange = (e) => {
    setSelectedLesson(e.target.value);
    setQuestions([]);
    setAnswers({});
  };

  const fetchQuestions = async () => {
    if (!selectedLesson) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/takequiz', {
        lesson_id: selectedLesson,
      });

      if (response.data && response.data.intrebari) {
        setQuestions(response.data.intrebari);
      } else {
        console.warn('Format greșit din backend:', response.data);
      }
    } catch (err) {
      console.error('Eroare la generarea întrebărilor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = async () => {
    try {
        const lessonObj = lessons.find(lesson => lesson._id === selectedLesson);
        const lessonTitle = lessonObj ? lessonObj.titlu : '';
        console.log('lessonTitle', lessonTitle)

      const payload = {
        studentId: user?._id,
        lessonId: selectedLesson,
        lessonTitle: lessonTitle,
        studentName: user?.utilizator,
        studentEmail: user?.email,
        answers: Object.entries(answers).map(([index, answer]) => ({
          questionIndex: Number(index),
          questionText: questions[Number(index)],
          answer,
        })),
      };
  
      const response = await axios.post('http://localhost:3001/api/quizResults', payload);
  
      console.log('Răspunsuri trimise cu succes:', response.data);
      onClose();
    } catch (error) {
      console.error('Eroare la trimiterea răspunsurilor:', error);
    }
  };
  
  

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Quiz - Generează întrebări</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Selectează o lecție:</Form.Label>
          <Form.Select value={selectedLesson} onChange={handleLessonChange}>
            <option value="">Alege...</option>
            {lessons?.map((lesson) => (
              <option key={lesson._id} value={lesson._id}>
                {lesson.titlu}
              </option>
            ))}
          </Form.Select>
          <Button className="mt-2" variant="primary" onClick={fetchQuestions} disabled={!selectedLesson}>
            Generează întrebări
          </Button>
        </Form.Group>

        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '150px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Se încarcă...</span>
            </div>
            <p className="mt-3">Se încarcă, vă rugăm așteptați...</p>
          </div>
        ) : (
          questions.length > 0 && (
            <Form className="mt-4">
              {questions.map((q, index) => (
                <Form.Group className="mb-3" key={index}>
                  <Form.Label>{index + 1}. {q}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Scrie răspunsul..."
                    value={answers[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                </Form.Group>
              ))}
            </Form>
          )
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Închide</Button>
        <Button variant="success" onClick={handleSubmit} disabled={questions.length === 0}>
          Trimite Răspunsuri
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Quiz;
