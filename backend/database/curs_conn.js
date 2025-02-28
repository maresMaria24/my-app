// db.js

const { MongoClient } = require('./mongodb.js');
const Curs = require('./Model/curs.js');

const uri = "mongodb+srv://maresmaria21:<db_password>@brainit.iuj2zxy.mongodb.net/?retryWrites=true&w=majority&appName=BrainIT";
async function connectAndInsertDocuments() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();

    // Get the database
    const database = client.db("Brain");

    // Get or create a collection
    const collection = database.collection("Cursuri");

    // Definirea documentelor
    const documents = [
      new Curs("Cursul 1", "Descrierea cursului 1", "Nivelul 1", "Autorul Cursului 1"),
      new Curs("Cursul 2", "Descrierea cursului 2", "Nivelul 2", "Autorul Cursului 2")
    ];

    
    // Insert documents into the collection
    await collection.insertMany(documents);

    console.log("Documents inserted successfully!");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

module.exports = { connectAndInsertDocuments };
