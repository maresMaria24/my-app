const express = require('express');
const router = express.Router();
const { adaugaCurs, getCursuri, getCurs, cautaLectiiCurs,stergeCurs,actualizeazaCurs } = require('../Controller/cursController'); // Importăm funcția pentru adăugarea cursului
const Curs = require('../Model/curs'); // Importăm modelul pentru cursuri
const { ObjectId } = require('mongodb');

// Ruta pentru adăugarea unui curs nou
router.post('/addCourse', async (req, res) => {
  try {
    // Extragem datele necesare pentru crearea cursului din corpul cererii
    const { nume, descriere, nivel, autor,lectii,categorie } = req.body;


    // Creăm o instanță a modelului de curs folosind datele primite în corpul cererii
    const cursNou = new Curs(nume, descriere, nivel, autor,lectii,categorie);

    // Apelăm funcția pentru adăugarea cursului în baza de date
    const insertedId = await adaugaCurs(cursNou);
    console.log("A fost adaugat cursul cu id-ul :" + insertedId);

    // Răspundem cu succes și returnăm ID-ul cursului nou creat
    res.status(201).json({ insertedId });
  } catch (error) {
    // În caz de eroare, trimitem un răspuns cu codul de stare 500 și un mesaj de eroare
    console.error('Eroare la adăugarea cursului:', error.message);
    res.status(500).json({ error: 'A apărut o eroare la adăugarea cursului.' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await stergeCurs(id);
    console.log(id);
    res.json({ message: 'Cursul a fost șters cu succes!' });
  } catch (error) {
    console.error('Eroare la ștergerea cursului:', error);
    res.status(500).json({ error: 'A apărut o eroare la ștergerea cursului.' });
  }
});

router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nume, descriere, nivel, autor,lectii, categorie } = req.body;

    const cursEditat={
      nume:nume, 
      descriere:descriere, 
      nivel:nivel,
      autor:autor,
      lectii,
      categorie:categorie,
    };

    const updatedCurs = await actualizeazaCurs(id,cursEditat);
    console.log("A fost actualizat cursul cu id ul "+ id);

    if (!updatedCurs) {
      return res.status(404).json({ message: 'Cursul nu a fost găsit.' });
    }

    res.json(updatedCurs);
  } catch (error) {
    console.error('Eroare la actualizarea cursului:', error.message);
    res.status(500).json({ message: 'Eroare la actualizarea cursului.' });
  }
});




router.get('/curs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Folosim funcția getCurs pentru a obține cursul specificat prin id
    const curs = await getCurs(id);
    if (curs) {
      res.json(curs);
    } else {
      res.status(404).json({ message: 'Cursul nu a fost găsit.' });
    }
  } catch (error) {
    console.error('Eroare la obținerea detaliilor cursului:', error);
    res.status(500).json({ message: 'Eroare la obținerea detaliilor cursului.' });
  }
});

router.get('/cursDis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Folosim funcția getCurs pentru a obține cursul specificat prin id
    const cursObj = await getCurs(id);
    if (cursObj) {
      res.json(cursObj);
    } else {
      res.status(404).json({ message: 'Cursul nu a fost găsit.' });
    }
  } catch (error) {
    console.error('Eroare la obținerea detaliilor cursului:', error);
    res.status(500).json({ message: 'Eroare la obținerea detaliilor cursului.' });
  }
});



// Ruta pentru obținerea cursurilor
router.get('/getCursuri', async (req, res) => {
  try {
    const cursuri = await getCursuri(); // Obținem cursurile din baza de date folosind funcția getCursuri din controllerul curs
    res.json(cursuri); // Returnăm cursurile către client în format JSON
  } catch (error) {
    console.error('Eroare la obținerea cursurilor:', error);
    res.status(500).json({ message: 'Eroare la obținerea cursurilor.' });
  }
});

router.get('/curs/:id/lectii', async (req, res) => {
    const { id } = req.params;
    try {
        const lectii = await cautaLectiiCurs(id);
        console.log('LECTIIIIIII ', lectii)
        res.json(lectii);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;


