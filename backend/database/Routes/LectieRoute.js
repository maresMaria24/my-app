const express = require('express');
const router = express.Router();
const Lectie = require('../Model/lectie');
const { ObjectId } = require('mongodb');
const {adaugaLectie, actualizeazaLectie, stergeLectie, getLectii, getLectie} = require('../Controller/lectieController');
const { actualizeazaCursLectie, cautaLectiiCurs } = require('../Controller/cursController'); 

router.get('/lectie/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const lectie = await getLectie(id);
      if (lectie) {
        res.json(lectie);
       
        
      } else {
        res.status(404).json({ message: 'Lectia nu a fost gasita.' });
      }
    } catch (error) {
      console.error('Eroare la obținerea detaliilor lectiei:', error);
      res.status(500).json({ message: 'Eroare la obținerea detaliilor lectiei.' });
    }
  });

  router.delete('/lectie/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const lectie = await stergeLectie(id);
        res.json({ message: 'Lectia a fost ștearsa cu succes!' });
      } catch (error) {
        console.error('Eroare la ștergerea lectiei:', error);
        res.status(500).json({ error: 'A apărut o eroare la ștergerea lectiei.' });   
  }});

  router.put('/lectie/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { titlu, continut, fisier} = req.body;
      const lectieActualizata = {
        titlu: titlu,
        continut: continut,
        fisier: fisier,
        articole:[],
    };
      console.log("LECTIE: ");
      console.log(lectieActualizata);
      console.log(id);
      const lectie = await actualizeazaLectie(new ObjectId(id), lectieActualizata);
        res.json({ message: 'Lectia a fost actualizata!' });
      } catch (error) {
        console.error('Eroare la actualizarea lectiei:', error);
        res.status(500).json({ error: 'A apărut o eroare la actualizarea lectiei.' });   
  }});

router.post('/curs/:id/addLectii', async (req, res) => {
    const { id } = req.params;
    const { titlu, continut, fisier } = req.body;
    try {
        const lectie = {
            titlu: titlu,
            continut: continut,
            fisier: fisier,
        };
        
        const newLectie = await adaugaLectie(lectie, id);
        const lectiiCurs = await cautaLectiiCurs(id);
        res.status(200).json({ newLectie,lectiiCurs });
        
    } catch (err) {
        console.error('Eroare la adăugarea lecției:', err.message);
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;
