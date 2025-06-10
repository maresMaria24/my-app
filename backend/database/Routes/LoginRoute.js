const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config.js');
const User = require('../Controller/contController.js');

router.post('/Login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  try {
    const user = await User.getCont(email);
    console.log(user);
    
    if (!user) {
      return res.status(401).json({ message: 'Email-ul introdus nu există.' });
    }

    if (!user.parola) {
      return res.status(500).json({ message: 'Utilizatorul nu are o parolă definită.' });
    }

    const validPassword = await bcrypt.compare(password, user.parola);

    if (!validPassword) {
      return res.status(401).json({ message: 'Parolă incorectă.' });
    }

    const token = jwt.sign({ email: user.email, rol: user.rol }, secret, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Eroare la autentificare. Te rugăm să încerci din nou mai târziu.' });
  }
});

module.exports = router;
