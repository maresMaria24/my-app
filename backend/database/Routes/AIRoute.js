const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
const axios = require('axios');

const { salveazaQuizResult, getQuizResults, evalueazaQuiz,
    getToateEvaluarile,
    getEvaluariPentruStudent } = require('../Controller/quizController');

router.post('/api/quizResults/:id/evaluate', async (req, res) => {
        const { comentariu, nota } = req.body;
        const { id } = req.params;
      
        try {
          const result = await evalueazaQuiz(id, comentariu, nota);
          res.status(200).json(result);
        } catch (err) {
          console.error('Eroare la evaluare:', err);
          res.status(500).json({ error: 'Eroare la evaluarea quizului' });
        }
      });
      
router.get('/api/evaluari', async (req, res) => {
    try {
      const results = await getToateEvaluarile();
      res.status(200).json(results);
    } catch (err) {
      console.error('Eroare la obținerea evaluărilor:', err);
      res.status(500).json({ error: 'Eroare internă la obținerea evaluărilor' });
    }
  });
  

  router.get('/api/evaluari/student/:studentId', async (req, res) => {
    try {
      const { studentId } = req.params;
      const results = await getEvaluariPentruStudent(studentId);
      res.status(200).json(results);
    } catch (err) {
      console.error('Eroare la obținerea evaluărilor studentului:', err);
      res.status(500).json({ error: 'Eroare la obținerea evaluărilor studentului' });
    }
  });
  
  router.get('/api/recommendations', async (req, res) => {
    const userId = req.query.user_id || '';
    try {
      const response = await axios.get(`http://127.0.0.1:8000/recommend?user_id=${userId}`);
      res.json(response.data);
    } catch (error) {
      console.error('Eroare la comunicarea cu FastAPI:', error.message);
      res.status(500).json({ error: 'Eroare la comunicarea cu FastAPI' });
    }
  });

router.post('/api/takequiz', async (req, res) => {
  const { lesson_id } = req.body;
  if (!lesson_id) return res.status(400).json({ error: 'Lipsește lesson_id' });

  try {
    const response = await axios.get(`http://127.0.0.1:8002/generate-questions`, {
      params: { lesson_id }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Eroare la comunicarea cu FastAPI:', error.message);
    res.status(500).json({ error: 'Eroare la generarea întrebarilor din FastAPI' });
  }
});

router.post('/api/quizResults', async (req, res) => {
  try {
    const result = await salveazaQuizResult(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Eroare la salvarea rezultatului quiz:', err);
    res.status(500).json({ error: 'Eroare internă la salvare quiz' });
  }
});

router.get('/api/quizResults', async (req, res) => {
  try {
    const results = await getQuizResults();
    res.status(200).json(results);
  } catch (err) {
    console.error('Eroare la obținerea rezultatelor:', err);
    res.status(500).json({ error: 'Eroare la obținerea rezultatelor quiz' });
  }
});

router.post('/api/quizResults/:id/evaluate', async (req, res) => {
  const { comentariu, nota } = req.body;
  const { id } = req.params;

  try {
    const result = await evalueazaQuiz(id, comentariu, nota);
    res.status(200).json(result);
  } catch (err) {
    console.error('Eroare la evaluare:', err);
    res.status(500).json({ error: 'Eroare la evaluarea quizului' });
  }
});

module.exports = router;
