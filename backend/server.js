const express = require('express');
const path=require('path')
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = 5000;
const client = require('./db/db');

const dataBase = client
dataBase.on('error', console.error.bind(console, 'MongoDB connection error:'));
dataBase.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const authRout=require('./API/route/Auth')
const userRout=require('./API/route/Users')
const projectRout=require('./API/route/Projects')
const checkinRout=require('./API/route/CheckIn')
const activityRout=require('./API/route/Activities')

app.use('/api/auth',authRout)
app.use('/api/users',userRout)
app.use('/api/projects',projectRout)
app.use('/api/checkins',checkinRout)
app.use('/api/activities',activityRout)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});