
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://maria:maria22@brainit.iuj2zxy.mongodb.net/?retryWrites=true&w=majority&appName=BrainIT";

async function connectToDatabase() {
  const client = new MongoClient(uri, {
    dbName:"BrainIT",
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error("Eroare la conectarea la baza de date:", error);
    throw error;
  }
}

async function closeDatabaseConnection(client) {
  try {
    await client.close();
  } catch (error) {
    console.error("Eroare la închiderea conexiunii la baza de date:", error);
    throw error;
  }
}

function getCollection(client, collectionName) {
  return client.db().collection(collectionName);
}

async function insertDocument(client, collectionName, document) {
  try {
    const collection = getCollection(client, collectionName);
    const result = await collection.insertOne(document);
    console.log("Documentul a fost inserat cu succes:", result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error("Eroare la inserarea documentului:", error);
    throw error;
  }
}

async function updateDocument(client, collectionName, filter, update) {
  try {
    const collection = getCollection(client, collectionName);
    const result = await collection.updateOne(filter, update);
    console.log("Documentul a fost actualizat cu succes:", result.modifiedCount);
    return result.modifiedCount;
  } catch (error) {
    console.error("Eroare la actualizarea documentului:", error);
    throw error;
  }
}

async function deleteDocument(client, collectionName, filter) {
  try {
    const collection = getCollection(client, collectionName);
    const result = await collection.deleteOne(filter);
    console.log("Documentul a fost șters cu succes:", result.deletedCount);
    return result.deletedCount;
  } catch (error) {
    console.error("Eroare la ștergerea documentului:", error);
    throw error;
  }
}

async function deleteMultipleDocuments(client, collectionName, filter) {
  try {
    const collection = getCollection(client, collectionName);
    const result = await collection.deleteMany(filter);
    console.log(`${result.deletedCount} documente au fost șterse cu succes.`);
    return result.deletedCount;
  } catch (error) {
    console.error("Eroare la ștergerea documentelor:", error);
    throw error;
  }
}

async function searchDocument(client, collectionName, query) {
  try {
    const collection = getCollection(client, collectionName);
    const result = await collection.find(query).toArray();
    console.log("Documente găsite:", result.length);
    return result;
  } catch (error) {
    console.error("Eroare la căutarea documentelor:", error);
    throw error;
  }
}

module.exports = { connectToDatabase, closeDatabaseConnection, insertDocument, updateDocument, deleteDocument, deleteMultipleDocuments, searchDocument,ObjectId, getCollection };
