const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Cont = require('../Model/cont.js');
const {
  adaugaCont,
  actualizeazaCont,
  stergeCont,
  getConturi,
  getCont,
  getConturiTeachers,
  emailCheck,
  getContById,
  actualizeazaCursuriCont,
  getCursuriByIdUser
} = require('../Controller/contController');


router.post('/addUser', async (req, res) => {
  try {
    const { username, email, password, rol ,linkCv} = req.body;
    const acces = true;

    if (await emailCheck(email)) {
      return res.status(400).json({ message: 'Email-ul a fost deja folosit!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cont = new Cont(username, email, hashedPassword, rol, acces, linkCv);
    const insertedId = await adaugaCont(cont);

    res.status(201).json({ message: 'Cont adăugat cu succes!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/addTeacher', async (req, res) => {
  try {
    const { username, email, password, rol,linkCv } = req.body;
    const acces = false;

    if (await emailCheck(email)) {
      return res.status(400).json({ message: 'Email-ul a fost deja folosit!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cont = new Cont(username, email, hashedPassword, rol, acces,linkCv);
    const insertedId = await adaugaCont(cont);

    res.status(201).json({ message: 'Cont adăugat cu succes!' });
  } catch (error) {
    res.status (500).json({ error: error.message });
  }} );

  router.put('/asignare/:cursId/:contId', async (req, res) => {
    try {
      const { contId, cursId } = req.params;
      console.log(contId);
      const cont = await actualizeazaCursuriCont(contId, cursId);
      if (!cont) {
        console.log('Cursul este deja asignat acestui cont sau contul nu există.');
        return res.status(304).json({ message: 'Cursul este deja asignat acestui cont sau contul nu există.' });
      }
  
      res.status(200).json({ message: 'Cursul a fost asignat cu succes contului!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


// Ruta pentru actualizarea unui cont existent
router.put('/updateTeacher', async (req, res) => {
    try {
      const id = req.body.id;
      const contActualizat = {
        acces: true,
        rol: 'profesor'
      };
      const result = await actualizeazaCont(id, contActualizat);
      if (result) {
        res.status(200).json({ message: 'Cont actualizat cu succes!' });
      } else {
        res.status(404).json({ message: 'Contul nu a fost găsit!' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Ruta pentru ștergerea unui cont
router.delete('/deleteTeacher', async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const result = await stergeCont(id);
    res.status(200).json({ message: 'Cont șters cu succes!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta pentru obținerea tuturor conturilor
router.get('/lista', async (req, res) => {
  try {
    const conturi = await getConturi();
    res.status(200).json(conturi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/getTeachers', async (req, res) => {
    try {
      const conturi = await getConturiTeachers();
      console.log(conturi);
      res.status(200).json(conturi);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
// Ruta pentru obținerea unui cont specific după email
router.get('/detalii/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const cont = await getCont(email);
    if (cont) {
      res.status(200).json(cont);
    } else {
      res.status(404).json({ message: 'Contul nu există!' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/getUserCourses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const cursuri = await getCursuriByIdUser(id);
      console.log(cursuri);
      if (cursuri.length > 0) {
        res.json(cursuri);
      } else {
        res.status(200).json({ message: 'Nu există cursuri asignate acestui cont!' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
