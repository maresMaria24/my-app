const { connectToDatabase, closeDatabaseConnection, insertDocument, searchDocument, updateDocument, getCollection, ObjectId } = require('../mongodb.js');
const QuizResult = require('../Model/test.js');
  
  async function getToateEvaluarile() {
    let client;
    try {
      client = await connectToDatabase();
      const collection = getCollection(client, 'quizResults');
      const results = await collection.find({}).toArray();
      return results;
    } catch (error) {
      throw error;
    } finally {
      if (client) await closeDatabaseConnection(client);
    }
  }
  
  async function getEvaluariPentruStudent(studentId) {
    let client;
    try {
      client = await connectToDatabase();
      const collection = getCollection(client, 'quizResults');
      const results = await collection.find({ studentId: new ObjectId(studentId) }).toArray();
      return results;
    } catch (error) {
      throw error;
    } finally {
      if (client) await closeDatabaseConnection(client);
    }
  }
  
async function salveazaQuizResult(data) {
  let client;
  try {
    client = await connectToDatabase();
    const rezultat = new QuizResult(
      data.studentId,
      data.studentName,
      data.studentEmail,
      data.quizTitle,
      data.lessonId,
      data.lessonTitle,
      data.answers,
      '',
      null
    );

    const result = await insertDocument(client, 'quizResults', rezultat);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function getQuizResults() {
  let client;
  try {
    client = await connectToDatabase();
    const collection = getCollection(client, 'quizResults');
    const results = await collection.find({}).toArray();
    return results;
  } catch (error) {
    throw error;
  } finally {
    if (client) await closeDatabaseConnection(client);
  }
}

async function evalueazaQuiz(id, comentariu, nota) {
    let client;
    try {
      client = await connectToDatabase();
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          comentariu,
          nota,
          evaluat: true,
          evaluatLa: new Date()
        }
      };
      const result = await updateDocument(client, 'quizResults', filter, update);
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (client) await closeDatabaseConnection(client);
    }
  }

module.exports = {
  salveazaQuizResult,
  getQuizResults,
  evalueazaQuiz,
};
