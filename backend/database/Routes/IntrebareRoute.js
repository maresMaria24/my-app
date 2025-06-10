const express = require('express');
const router = express.Router();
const { adaugaIntrebare, actualizeazaIntrebare, stergeIntrebare, getIntrebari, getIntrebare, cautaComentariiIntrebare, actualizeazaIntrebareComentariu } = require('../Controller/intrebareController');
const Intrebare = require('../Model/intrebare.js');
router.get('/getIntrebari', async (req, res) => {
  try {
    const questions = await getIntrebari();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'An error occurred while fetching questions.' });
  }
});

router.get('/getIntrebare/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const question = await getIntrebare(id);
    const comments = await cautaComentariiIntrebare(id);
    res.status(200).json({question,comments});
  } catch (error) {
    console.error('Error fetching question and comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching the question and comments.' });
  }
});

router.get('/getRaspunsuri/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const raspunsuri = await cautaComentariiIntrebare(id);
      res.status(200).json(raspunsuri);
    } catch (error) {
      console.error('Error fetching answers:', error);
      res.status(500).json({ error: 'An error occurred while fetching the answers.' });
    }
  });


router.post('/addIntrebare', async (req, res) => {
  const { titlu, descriere, autor, cursId, comentarii } = req.body;
  const newQuestion = new Intrebare(titlu, descriere, autor,cursId, comentarii, new Date());

  try {
    const insertedQuestion = await adaugaIntrebare(newQuestion);
    res.status(201).json(insertedQuestion);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'An error occurred while adding the question.' });
  }
});

router.put('/updateIntrebare/:id', async (req, res) => {
  const questionId = req.params.id;
  const updatedData = req.body;
  
  try {
    const updatedQuestion = await actualizeazaIntrebare(questionId, updatedData);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'An error occurred while updating the question.' });
  }
});

router.delete('/deleteIntrebare/:id', async (req, res) => {
  const questionId = req.params.id;
  
  try {
    const result = await stergeIntrebare(questionId);
    res.status(200).json({ message: 'Question deleted successfully', result });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'An error occurred while deleting the question.' });
  }
});

module.exports = router;
