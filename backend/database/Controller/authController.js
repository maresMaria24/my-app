const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { adaugaCont, emailExists } = require('./contController');

const register = async (req, res) => {
  const { username, email, password, rol } = req.body;
  const acces = false;

  if (await emailExists(email)) {
    return res.status(400).json({ message: 'Email-ul a fost deja folosit!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const cont = new Cont(username, email, hashedPassword, rol, acces);
  await adaugaCont(cont);
  res.status(201).json({ message: 'Cont adăugat cu succes!' });
};

const login = async (req, res) => {
  // Logică pentru autentificare
};

module.exports = { register, login };
