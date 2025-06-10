const { connectToDatabase, closeDatabaseConnection, insertDocument, updateDocument, deleteDocument, ObjectId } = require('../mongodb.js');
const { actualizeazaIntrebareComentariu } = require('../Controller/intrebareController.js');

const Raspuns = require('../Model/raspuns.js');

async function adaugaRaspuns(raspuns, intrebareId) {
  let client;
  try {
    client = await connectToDatabase();
    const insertedId = await insertDocument(client, 'raspunsuri', raspuns);
    console.log("RASPUNS" + raspuns._id);
    await actualizeazaIntrebareComentariu(client, intrebareId, insertedId);
    return insertedId;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function actualizeazaRaspuns(id, raspunsActualizat) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: { ...raspunsActualizat } };
    const result = await updateDocument(client, 'raspunsuri', filter, update);

    if (result > 0) {
      console.log('Raspunsul a fost actualizat cu succes!');
    } else {
      console.log('Raspunsul nu a fost actualizat.');
    }

    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function stergeRaspuns(id) {
  let client;
  console.log("Documentul cu ID-ul sters este: " + id);
  try {
    client = await connectToDatabase();

    const filter = { _id: new ObjectId(id) };
    const result = await deleteDocument(client, 'raspunsuri', filter);
    console.log(result);

    const filterIntrebari = { raspunsuri: new ObjectId(id) };
    const updateIntrebari = { $pull: { raspunsuri: new ObjectId(id) } };
    const resultIntrebari = await updateDocument(client, 'intrebari', filterIntrebari, updateIntrebari);
    console.log(resultIntrebari);

    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function getRaspunsuri() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('raspunsuri');
    const cursor = collection.find({});
    const raspunsuri = await cursor.toArray();
    return raspunsuri;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

module.exports = { adaugaRaspuns, actualizeazaRaspuns, stergeRaspuns, getRaspunsuri };
