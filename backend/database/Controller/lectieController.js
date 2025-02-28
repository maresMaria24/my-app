// lectieController.js
const { connectToDatabase, closeDatabaseConnection, insertDocument, updateDocument, deleteDocument, searchDocument,deleteMultipleDocuments,getCollection, ObjectId} = require('../mongodb.js');
const Lectie = require('../Model/lectie.js');
const { actualizeazaCursLectie } = require('./cursController.js');

const adaugaLectie = async function (lectie, cursId) {
  let client;
  try {
    client = await connectToDatabase();
    
    // Adăugăm lecția în baza de date și obținem ID-ul lecției adăugate
    const insertedLectie = await insertDocument(client, 'lectii', lectie);
    // Actualizăm cursul pentru a include ID-ul lecției adăugate în lista de lectii
    await actualizeazaCursLectie(client, cursId, insertedLectie);
    return insertedLectie;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }

}

const getLectie = async function (id) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) }; // Convertim id-ul într-un obiect ObjectId
    const result = await searchDocument(client, 'lectii', filter); // Presupunând că colecția se numește 'lectii'
    //console.log(result); // Afisăm rezultatul căutării înainte de a-l returna (dacă este necesar)
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function cautaArticoleLectie(id) {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('lectii');
    const lectie = await collection.findOne({ _id: new ObjectId(id) });
    if (!lectie) {
      throw new Error('Lectia nu a fost găsita');
    }
   

    if (typeof lectie.articole === 'undefined' ) {
      return []; // Returnează un array gol dacă nu sunt articole
    }

    const articoleIds = lectie.articole.map(articolId => new ObjectId(articolId));
    
    const articoleCollection = client.db().collection('articole');
    const articole = await articoleCollection.find({ _id: { $in: articoleIds } }).toArray();
    
    return articole;
  } catch (error) {
    throw error;
  } finally {
    if (client) await client.close();
  }
}


// Funcție pentru a căuta ID-ul unei lecții în cursuri
async function cautaLectieInCursuri(lessonId) {
  let client;
  try {
    client = await connectToDatabase();
    const cursor = client.db().collection('cursuri').find({ lectii: ObjectId(lessonId) });
    const cursuri = await cursor.toArray();
    return cursuri;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}


const actualizeazaLectieArticol = async function (client, lessonId, articleId) {
  try {
    client = await connectToDatabase();
    const courseCollection = client.db().collection('lectii');
    const result = await courseCollection.updateOne(
      { _id: new ObjectId(lessonId) },
      { $push: { articole: new ObjectId(articleId) } }
    );
    if (result.modifiedCount === 0) {
      throw new Error('Nu s-a putut actualiza cursul.');
    }
    return result;
  } catch (error) {
    throw error;
  }
}



async function actualizeazaLectie(id, lectieActualizata) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: lectieActualizata };
    const result = await updateDocument(client, 'lectii', filter, update);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function stergeLectie(id) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) }; // Convertim id-ul într-un obiect ObjectId
    
    // Obținem lectia pentru a accesa lista de articole asociate
    const lectieCollection = getCollection(client, 'lectii');
    const lectie = await lectieCollection.findOne(filter);
    
    // Verificăm dacă lectia există
    if (lectie) {
      // Ștergem articolele asociate lectiei
      const articoleIds = lectie.articole.map(articolId => new ObjectId(articolId)); // Convertim fiecare ID în ObjectId
      const articoleFilter = { _id: { $in: articoleIds } };
      await deleteMultipleDocuments(client, 'articole', articoleFilter);
      console.log('Articolele asociate lectiei au fost șterse din baza de date.');
    }

    // Ștergem lectia din colecția "lectii"
    const result = await deleteDocument(client, 'lectii', filter);
    console.log('Lectia a fost ștersă din baza de date.');
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}



async function getLectii() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('lectii');
    const cursor = collection.find({});
    const lectii = await cursor.toArray();
    return lectii;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

module.exports = { adaugaLectie, actualizeazaLectie, stergeLectie, getLectii, getLectie, cautaArticoleLectie, actualizeazaLectieArticol };

