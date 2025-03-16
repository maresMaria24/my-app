const { connectToDatabase, closeDatabaseConnection, insertDocument, updateDocument, deleteDocument, ObjectId } = require('../mongodb.js');


async function adaugaCautare(cautare) {
    let client;
    try {
      client = await connectToDatabase();
  
      const insertedId = await insertDocument(client, 'cautari', cautare);
      return insertedId;
    } catch (error) {
      throw error;
    } finally {
      if (client) await closeDatabaseConnection(client);
    }
  }

  module.exports = { adaugaCautare };
