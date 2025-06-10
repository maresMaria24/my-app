const { connectToDatabase, closeDatabaseConnection, insertDocument, updateDocument, deleteDocument ,ObjectId, searchDocument} = require('../mongodb.js');
const {actualizeazaLectieArticol} = require('../Controller/lectieController.js');

const Articol = require('../Model/articol.js');

async function adaugaArticol(articol, lectieId) {
  let client;
  try {
    client = await connectToDatabase();
    const insertedId = await insertDocument(client, 'articole', articol);
    console.log("ARTICOL" + articol._id);
    await actualizeazaLectieArticol(client, lectieId,articol._id);
    return insertedId;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function actualizeazaArticol(id, articolActualizat) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: { ...articolActualizat } };
    const result = await updateDocument(client, 'articole', filter, update);

    if (result > 0) {
      console.log('Articolul a fost actualizat cu succes!');
    } else {
      console.log('Articolul nu a fost actualizat.');
    }

    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}




async function stergeArticol(id) {
  let client;
  console.log("Documentul cu ID-ul sters este: " + id);
  try {
    client = await connectToDatabase();

    const filter = { _id: new ObjectId(id) };
    const result = await deleteDocument(client, 'articole', filter);
    console.log(result);

    const filterLectii = { articole: new ObjectId(id) };
    const updateLectii = { $pull: { articole: new ObjectId(id) } };
    const resultLectii = await updateDocument(client, 'lectii', filterLectii, updateLectii);
    console.log(resultLectii);

    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}



async function getArticole() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('articole');
    const cursor = collection.find({});
    const articole = await cursor.toArray();
    return articole;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

module.exports = { adaugaArticol, actualizeazaArticol, stergeArticol, getArticole };
