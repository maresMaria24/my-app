const { connectToDatabase, closeDatabaseConnection, insertDocument,getCollection, updateDocument, deleteDocument, deleteMultipleDocuments, searchDocument,ObjectId } = require('../mongodb.js');
const Curs = require('../Model/curs.js');
const { search } = require('../Routes/LoginRoute.js');


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

    const cursCollection = getCollection(client, 'cursuri');
    const curs = await cursCollection.findOne(filter);
    console.log(curs);
  
    if (!curs) {
      throw new Error('Cursul nu există în baza de date.');
    }
    resulat = await updateDocument(client, 'conti', { cursuri: new ObjectId(id) }, { $pull: { cursuri: new ObjectId(id) } });
    console.log(resulat);

    const lectiiIds = curs.lectii.map(lectieId => new ObjectId(lectieId));
    console.log("LectiiIds " + lectiiIds);

    const lectiiCollection = getCollection(client, 'lectii');
    const lectii = await lectiiCollection.find({ _id: { $in: lectiiIds } }).toArray();
    console.log(lectii);

    const articoleCollection = getCollection(client, 'articole');
    for (const lectieObj of lectii) {
      const articoleIds = lectieObj.articole.map(articolId => new ObjectId(articolId)); // Obținem ID-urile articolelor
      
      await deleteMultipleDocuments(client, 'articole', { _id: { $in: articoleIds } });
    }
    await deleteMultipleDocuments(client, 'lectii', { _id: { $in: lectiiIds } });
    await cursCollection.updateOne(filter, { $set: { lectii: [] } });

    const result = await deleteDocument(client, 'cursuri', filter);
    console.log('Cursul a fost șters din baza de date.');
    
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}


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

async function getCurs(id) {
  let client;
  console.log("CURS" + id);
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const result = await searchDocument(client, 'cursuri', filter);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

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
