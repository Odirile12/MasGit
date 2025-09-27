const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_SECRET}@${process.env.MONGO_CLASTER}.g6b8see.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_CLASTER}`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
module.exports = client;
// run().catch(console.dir);
