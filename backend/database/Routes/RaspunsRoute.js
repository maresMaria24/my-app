const express = require('express');
const router = express.Router();
const { adaugaRaspuns, getRaspunsuriByIntrebareId,getRaspunsuri } = require('../Controller/raspunsController.js');
const { actualizeazaIntrebareComentariu} = require('../Controller/intrebareController.js');
const {ObjectId} = require('../mongodb.js');
const Raspuns = require('../Model/raspuns.js');

router.post('/addRaspuns/:questionId', async (req, res) => {
    const { questionId } = req.params;
    const { text, autor, curs} = req.body;
   
    try {
      const raspuns = new Raspuns(text, autor, curs);
      console.log(raspuns + ' - ' + questionId);
      const insertedRaspuns = await adaugaRaspuns(raspuns, questionId);
      res.status(201).json(insertedRaspuns);
    } catch (error) {
      console.error('Error adding answer:', error);
      res.status(500).json({ error: 'An error occurred while adding the answer.' });
    }
  });

module.exports = router;
