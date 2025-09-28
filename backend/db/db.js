const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_SECRET}@${process.env.MONGO_CLASTER}.g6b8see.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_CLASTER}`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

mongoose.connect(uri);

const db = mongoose.connection

module.exports = db;
// run().catch(console.dir);
