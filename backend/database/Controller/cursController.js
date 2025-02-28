const { connectToDatabase, closeDatabaseConnection, insertDocument,getCollection, updateDocument, deleteDocument, deleteMultipleDocuments, searchDocument,ObjectId } = require('../mongodb.js');
const Curs = require('../Model/curs.js');
const { search } = require('../Routes/LoginRoute.js');


// Funcție pentru a adăuga un curs în baza de date
async function adaugaCurs(curs) {
  let client;
  try {
    client = await connectToDatabase();

    const insertedId = await insertDocument(client, 'cursuri', curs);
    return insertedId;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

// Funcție pentru a actualiza un curs existent în baza de date
async function actualizeazaCurs(id, cursActualizat) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: cursActualizat };
    const result = await updateDocument(client, 'cursuri', filter, update);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}


const actualizeazaCursLectie = async function (client, courseId, lessonId) {
  console.log(courseId + "  -  " + lessonId );
  try {
    client = await connectToDatabase();
    const courseCollection = client.db().collection('cursuri');
    const result = await courseCollection.updateOne(
      { _id: new ObjectId(courseId) },
      { $push: { lectii: new ObjectId(lessonId) } }
    );
    if (result.modifiedCount === 0) {
      throw new Error('Nu s-a putut actualiza cursul.');
    }
    return result;
  } catch (error) {
    throw error;
  }
}

async function stergeCurs(id) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };

    // Obținem cursul pentru a accesa lista de lectii și alte detalii
    const cursCollection = getCollection(client, 'cursuri');
    const curs = await cursCollection.findOne(filter);
    console.log(curs);
  
    // Verificăm dacă cursul există
    if (!curs) {
      throw new Error('Cursul nu există în baza de date.');
    }
    resulat = await updateDocument(client, 'conti', { cursuri: new ObjectId(id) }, { $pull: { cursuri: new ObjectId(id) } });
    console.log(resulat);

    // Obținem ID-urile lectiilor asociate cursului
    const lectiiIds = curs.lectii.map(lectieId => new ObjectId(lectieId));
    console.log("LectiiIds " + lectiiIds);

    const lectiiCollection = getCollection(client, 'lectii');
    const lectii = await lectiiCollection.find({ _id: { $in: lectiiIds } }).toArray();
    console.log(lectii);

    // Obținem ID-urile articolelor asociate fiecărei lectii și le ștergem
    const articoleCollection = getCollection(client, 'articole');
    for (const lectieObj of lectii) {
      const articoleIds = lectieObj.articole.map(articolId => new ObjectId(articolId)); // Obținem ID-urile articolelor
      console.log("ArticoleIds: " + articoleIds);
      
      await deleteMultipleDocuments(client, 'articole', { _id: { $in: articoleIds } });
      console.log('Articolele asociate lectiilor au fost șterse din baza de date.');
    }

    // Ștergem lectiile asociate cursului
    await deleteMultipleDocuments(client, 'lectii', { _id: { $in: lectiiIds } });
    console.log('Lecțiile asociate cursului au fost șterse din baza de date.');

    // Ștergem legăturile lectiilor cu cursul (setând lista de lectii la un array gol)
    await cursCollection.updateOne(filter, { $set: { lectii: [] } });
    console.log('Legăturile lectiilor cu cursul au fost șterse.');

    // Ștergem cursul din colecția "cursuri"
    const result = await deleteDocument(client, 'cursuri', filter);
    console.log('Cursul a fost șters din baza de date.');
    
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}


// Funcție pentru a obține toate cursurile din baza de date
async function getCursuri() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('cursuri');
    const cursor = collection.find({});
    const cursuri = await cursor.toArray();
    return cursuri;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

// Funcție pentru a obține un curs specific din baza de date bazat pe id
async function getCurs(id) {
  let client;
  console.log("CURS" + id);
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) }; // Convertim id-ul într-un obiect ObjectId
    const result = await searchDocument(client, 'cursuri', filter);
    // Afisăm rezultatul căutării înainte de a-l returna (dacă este necesar)
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}
/*
async function cautaLectiiCurs(idCurs) {
  let client;
  try {
    client = await connectToDatabase();
    const cursor = client.db().collection('cursuri').find({ _id: new ObjectId(idCurs) });
    const [curs] = await cursor.toArray();
    if (!curs) {
      throw new Error('Cursul nu a fost găsit');
    }
    return curs.lectii;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}*/
async function cautaLectiiCurs(idCurs) {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('cursuri');
    const curs = await collection.findOne({ _id: new ObjectId(idCurs) });
    if (!curs) {
      throw new Error('Cursul nu a fost găsit');
    }
   
    const lectiiIds = curs.lectii.map(lectieId =>  new ObjectId(lectieId));
    const lectiiCollection = client.db().collection('lectii');
    const lectii = await lectiiCollection.find({ _id: { $in: lectiiIds } }).toArray();

    return lectii;
  } catch (error) {
    throw error;
  } finally {
    if (client) await client.close();
  }
}




module.exports = { adaugaCurs, actualizeazaCurs, stergeCurs, getCursuri, getCurs, actualizeazaCursLectie,cautaLectiiCurs };
