// contController.js
const { connectToDatabase, closeDatabaseConnection, insertDocument, updateDocument, deleteDocument,ObjectId } = require('../mongodb.js');
const Cont = require('../Model/cont.js');

async function adaugaCont(cont) {
  let client;
  try {
    client = await connectToDatabase();
    const insertedId = await insertDocument(client, 'conti', cont); // Am schimbat numele colecției în 'conti' pentru a evita conflictul cu cuvântul rezervat 'cont'
    return insertedId;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function actualizeazaCont(id, contActualizat) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: contActualizat };
    const result = await updateDocument(client, 'conti', filter, update); // Schimbare similară cu cea de mai sus
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}
async function emailCheck(email) {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('conti');
    const count = await collection.countDocuments({ email: email });
    return count > 0;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function stergeCont(id) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const result = await deleteDocument(client, 'conti', filter); // Schimbare similară cu cea de mai sus
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function getConturi() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('conti'); // Schimbare similară cu cea de mai sus
    const cursor = collection.find({});
    const conturi = await cursor.toArray();
    return conturi;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}
async function getConturiTeachers() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('conti'); // Schimbare similară cu cea de mai sus
    const cursor = collection.find({ acces: false }); // Filtru pentru acces = false
    const conturi = await cursor.toArray();
    return conturi;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}


async function getCont(email) {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('conti');
    
    const cont = await collection.findOne({ email: email });
    console.log(cont);
    return cont;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}
async function getContById(id) {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('conti');
    const cont = await collection.findOne({ _id: new ObjectId(id) });
    console.log(cont);
    return cont;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}
async function actualizeazaCursuriCont(id, cursId) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id), cursuri: { $ne: new ObjectId(cursId) } };
    const update = { $push: { cursuri: new ObjectId(cursId) } };
    const result = await updateDocument(client, 'conti', filter, update);
    console.log('DOCUMENTG' + result);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}
async function getCursuriByIdUser(id) {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('conti');
    const cont = await collection.findOne({ _id: new ObjectId(id) }, { projection: { cursuri: 1 } });
    
    if (cont && cont.cursuri) {
      const cursuriCollection = client.db().collection('cursuri');
      const cursuriIds = cont.cursuri.map(cursId => new ObjectId(cursId));
      const cursuri = await cursuriCollection.find({ _id: { $in: cursuriIds } }).toArray();
      console.log(cursuri);
      return cursuri;
    }

    return [];
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}




module.exports = { adaugaCont, actualizeazaCont, stergeCont, getConturi,getCont,getConturiTeachers,emailCheck,getContById ,actualizeazaCursuriCont,getCursuriByIdUser};
