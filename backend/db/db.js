const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_SECRET}@${process.env.MONGO_CLASTER}.g6b8see.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_CLASTER}`;
mongoose.connect(uri);
const db = mongoose.connection
module.exports = db;

