const express = require('express');
const router = express.Router();
const { adaugaCautare } = require('../Controller/searchController.js');
const Search = require('../Model/searchHistory'); 
const { ObjectId } = require('mongodb');

router.post('/addSearch', async (req, res) => {
    try {
      const { user, query, matched_courses, timestamp } = req.body;
  
      const newSearch = new Search(user, query, matched_courses, timestamp);
  
      const insertedId = await adaugaCautare(newSearch);
  
      res.status(201).json({ insertedId });
    } catch (error) {
      console.error('Eroare la adăugarea cautarii:', error.message);
      res.status(500).json({ error: 'A apărut o eroare la adăugarea cautarii.' });
    }
  });

  module.exports = router;