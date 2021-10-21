const express = require('express');

const quizs = require('./routes/api/quizs');
const users = require('./routes/api/users');



const app = express();

// Bodyparser Middleware
app.use(express.json());

// Use Routes
app.use('/api/quizs', quizs);
app.use('/api/users', users);



app.listen(port, () => console.log(`Server started on port ${port}`));
