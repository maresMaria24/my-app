const { connectToDatabase, closeDatabaseConnection, insertDocument, updateDocument, deleteDocument, searchDocument, deleteMultipleDocuments, getCollection, ObjectId } = require('../mongodb.js');
const Intrebare = require('../Model/intrebare.js');

const adaugaIntrebare = async function (intrebare) {
  let client;
  try {
    client = await connectToDatabase();
    const insertedIntrebare = await insertDocument(client, 'intrebari', intrebare);
    return insertedIntrebare;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

const getIntrebare = async function (id) {
    let client;
    try {
      client = await connectToDatabase();
      console.log(new ObjectId(id));
      const filter = { _id: new ObjectId(id) }; 
      const result = await searchDocument(client, 'intrebari', filter); // Assuming the collection is 'intrebari'
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (client) await closeDatabaseConnection(client);
    }
  };

async function cautaComentariiIntrebare(id) {
  let client;
  
  try {
    console.log(`Found comments: ${id}`);
    client = await connectToDatabase();
    const collection = client.db().collection('intrebari');
    const intrebare = await collection.findOne({ _id: new ObjectId(id) });
    if (!intrebare) {
      throw new Error('Intrebarea nu a fost găsita');
    }
    console.log(`INtrebarea + ${intrebare.comentarii}`);
    const comentariiIds = intrebare.comentarii.map(comentariuId => new ObjectId(comentariuId));
    const comentariiCollection = client.db().collection('raspunsuri');
    const comentarii = await comentariiCollection.find({ _id: { $in: comentariiIds } }).toArray();
    console.log(`ACESTA + ${comentarii}`);
    return comentarii;
  } catch (error) {
    throw error;
  } finally {
    if (client) await client.close();
  }
}

async function actualizeazaIntrebareComentariu(client, intrebare, comentariuId) {
  try {
    client = await connectToDatabase();
    const intrebareCollection = client.db().collection('intrebari');
    console.log(intrebare+ '  ' + comentariuId);
    const result = await intrebareCollection.updateOne(
      { _id: new ObjectId(intrebare) },
      { $push: { comentarii: new ObjectId(comentariuId) } }
    );
    console.log(result);
    if (result.modifiedCount === 0) {
      throw new Error('Nu s-a putut actualiza întrebarea.');
    }
    return result;
  } catch (error) {
    throw error;
  }
}

async function actualizeazaIntrebare(id, intrebareActualizata) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: intrebareActualizata };
    const result = await updateDocument(client, 'intrebari', filter, update);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function stergeIntrebare(id) {
  let client;
  try {
    client = await connectToDatabase();
    const filter = { _id: new ObjectId(id) }; 
    const intrebareCollection = getCollection(client, 'intrebari');
    const intrebare = await intrebareCollection.findOne(filter);
    
    if (intrebare) {
      const comentariiIds = intrebare.comentarii.map(comentariuId => new ObjectId(comentariuId)); // Convertim fiecare ID în ObjectId
      const comentariiFilter = { _id: { $in: comentariiIds } };
      await deleteMultipleDocuments(client, 'comentarii', comentariiFilter);
      console.log('Comentariile asociate întrebării au fost șterse din baza de date.');
    }
    const result = await deleteDocument(client, 'intrebari', filter);
    console.log('Întrebarea a fost ștersă din baza de date.');
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function getIntrebari() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = client.db().collection('intrebari');
    const cursor = collection.find({});
    const intrebari = await cursor.toArray();
    return intrebari;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

module.exports = { adaugaIntrebare, actualizeazaIntrebare, stergeIntrebare, getIntrebari, getIntrebare, cautaComentariiIntrebare, actualizeazaIntrebareComentariu };
