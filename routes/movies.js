const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

// routes

// create movie
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Genre Id is not valid');

  let movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });
  movie = await movie.save();
  return res.status(201).send(movie);
});

// get movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  return res.status(200).send(movies);
});

// get movie
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  return res.status(200).send(movie);
});

// update movie
router.put('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Movie Id');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Genre Id is not valid');

  let movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    },
    { new: true }
  );
  if (!movie) return res.status(404).send('Movie with given Id is not found');
  return res.status(201).send(movie);
});

//delete movie
router.delete('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Movie Id');
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send('Movie is not found with this id');
  return res.status(200).send(movie);
});

module.exports = router;
