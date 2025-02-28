const {adaugaLectie, actualizeazaLectie, stergeLectie, getLectii, getLectie, cautaArticoleLectie} = require('../Controller/lectieController');
const {adaugaArticol, actualizeazaArticol, stergeArticol } = require('../Controller/articolController');
const Articol = require('../Model/articol'); 
const express = require('express');
const router = express.Router();

router.post('/articol/:id', async (req, res) => {
    const {id} = req.params;
    const { titlu, continut, fisier } = req.body;
    try {
        const articol = {
            titlu: titlu,
            continut: continut,
            fisier: fisier,
        };
        const newArticol= await adaugaArticol(articol, id);

        //const articoleLectie = await cautaArticoleLectie(id);
        res.status(200).json({newArticol});
    } catch (err) {
        console.error('Eroare la adăugarea articolului:', err.message);
        res.status(400).json({ message: err.message });
    }
});

router.get('/articole/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
      console.log("ID " + id);
      const lectii = await cautaArticoleLectie(id);
      res.json(lectii);
  } catch (err) {
      console.error('Eroare la obținerea articolelor pentru lecție:', err);
      res.status(500).json({ message: 'Eroare la obținerea articolelor pentru lecție.' });
  }
});


router.delete('/articol/:id', async (req, res) => {
    const articolId = req.params.id;
    try {
      const rezultat = await stergeArticol(articolId);
      res.status(200).json({ message: 'Articolul a fost șters cu succes', rezultat });
    } catch (eroare) {
      res.status(500).json({ message: 'Eroare la ștergerea articolului', error: eroare.message });
    }
});

router.put('/articol/:id', async (req, res) => {
  const { id } = req.params;
  const { titlu, continut } = req.body; 
  try {
    const result = await actualizeazaArticol(id, { titlu, continut });

    if (result) {
      res.status(200).json({ message: 'Articolul a fost actualizat cu succes.' });
    } else {
      res.status(404).json({ message: 'Articolul nu a putut fi găsit.' });
    }
  } catch (error) {
    console.error('Eroare la actualizarea articolului:', error);
    res.status(500).json({ message: 'A apărut o eroare la actualizarea articolului.' });
  }
});
  
module.exports = router;