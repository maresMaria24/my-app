const { adaugaCurs, actualizeazaCurs, stergeCurs, getCursuri } = require('./database/Controller/cursController.js');
const { adaugaLectie, actualizeazaLectie, stergeLectie, getLectii } = require('./database/Controller/lectieController.js');
const { adaugaArticol, actualizeazaArticol, stergeArticol, getArticole } = require('./database/Controller/articolController.js');
const { adaugaCont, actualizeazaCont, stergeCont, getConturi } = require('./database/Controller/contController.js');

const Curs = require('./database/Model/curs.js');
const Lectie = require('./database/Model/lectie.js');
const Articol = require('./database/Model/articol.js');
const Cont = require('./database/Model/cont.js');
const User = require('./database/Model/cont.js');

async function test() {
  // Testare adăugare curs
  const cursAdaugatId = await adaugaCurs(new Curs("Nume curs", "Descriere curs", "Nivel 1", "Autor curs"));
  console.log("Cursul a fost adăugat cu ID-ul:", cursAdaugatId);

  // Testare adăugare lectie
  const lectieAdaugataId = await adaugaLectie(new Lectie("Titlu lectie", "Descriere lectie", "Nivel 2", "Autor lectie"));
  console.log("Lectia a fost adăugată cu ID-ul:", lectieAdaugataId);

  // Testare adăugare articol
  const articolAdaugatId = await adaugaArticol(new Articol("Titlu articol", "Continut articol", "Autor articol"));
  console.log("Articolul a fost adăugat cu ID-ul:", articolAdaugatId);

  // Testare adăugare cont
  const contAdaugatId = await adaugaCont(new Cont("Utilizator", "email@example.com", "parola123"));
  console.log("Contul a fost adăugat cu ID-ul:", contAdaugatId);

  const user = await User.findOne('email@example.com');
  
  console.log(user);

  // Obținere cursuri
  // const cursuri = await getCursuri();
  // console.log("Cursurile din baza de date sunt:", cursuri);

  // Actualizare curs
  // const cursActualizatId = await actualizeazaCurs(cursAdaugatId, { nume: "Nume curs actualizat" });
  // console.log("Cursul cu ID-ul", cursAdaugatId, "a fost actualizat");

  // Ștergere curs
  // const cursSters = await stergeCurs(cursAdaugatId);
  // console.log("Cursul cu ID-ul", cursAdaugatId, "a fost șters");
}

// Apelarea funcției de test
test().catch(console.error);
