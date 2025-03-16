const express = require('express');
const router = express.Router();
const { adaugaCautare } = require('../Controller/searchController.js');
const Search = require('../Model/searchHistory'); 
const { ObjectId } = require('mongodb');

router.post('/addSearch', async (req, res) => {
    try {
      const { user, query, matched_courses, timestamp } = req.body;
        console.log('Am gasit cursul ')
  
      const newSearch = new Search(user, query, matched_courses, timestamp);
      console.log('Cautare noua ', newSearch);
  
      const insertedId = await adaugaCautare(newSearch);
      console.log("A fost adaugat cursul cu id-ul :" + insertedId);
  
      res.status(201).json({ insertedId });
    } catch (error) {
      console.error('Eroare la adăugarea cautarii:', error.message);
      res.status(500).json({ error: 'A apărut o eroare la adăugarea cautarii.' });
    }
  });

  module.exports = router;