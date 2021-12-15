const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('config');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

// mongoose connection
mongoose
  .connect('mongodb://127.0.0.1:27017/vidly')
  .then(() => {
    console.log('successfully connected to mongoDB');
  })
  .catch((err) => console.log('mongodb is not connected', err));

Fawn.init('mongodb://127.0.0.1:27017/vidly');

// express app
const app = express();

// middlewares
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to vidly application');
});

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// specifying port number
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`app is listening at port ${PORT}`));
