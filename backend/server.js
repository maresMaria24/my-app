  const express = require('express');
  const cors = require('cors'); 
  const app = express();
  const config = require('./config');
  const logare = require('./database/Routes/LoginRoute.js');
  const curs = require('./database/Routes/CursRoute.js');
  const lectii = require('./database/Routes/LectieRoute.js');
  const articol = require('./database/Routes/ArticolRoute.js');
  const intrebare = require('./database/Routes/IntrebareRoute.js');
  const raspuns = require('./database/Routes/RaspunsRoute.js');
  const cont = require('./database/Routes/ContRoute.js');
  const email = require('./database/Routes/EmailRoute.js');
  const search = require('./database/Routes/searchRoute.js')
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const nodemailer = require('nodemailer');
  const bodyParser = require('body-parser');
  const PORT = config.PORT || 3001;

  const { secret } = require('./config.js'); // Secretul utilizat pentru a semna token-ul JWT


  // Utilizarea middleware-ului express.json() înainte de rutare
  app.use(express.json());
  app.use(cors());
  app.use('',curs);
  app.use('',logare);
  app.use('', lectii);
  app.use('',articol);
  app.use('',cont);
  app.use('',intrebare);
  app.use('',raspuns);
  app.use('',email);
  app.use('',search);


  app.listen(PORT, () => {
    console.log(`Serverul rulează la adresa http://localhost:${PORT}`);
  });
