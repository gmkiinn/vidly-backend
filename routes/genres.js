const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// routes

// create genre
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  const savedGenre = await genre.save();
  res.status(201).json(savedGenre);
});

// get all genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.status(200).json(genres);
});

//get genre
router.get('/:id', async (req, res) => {
  let genre;
  if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
    genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre is not found with given id');
  } else {
    return res.status(400).send('Please send valid Genre Id');
  }

  res.status(200).json(genre);
});

// update genre
router.put('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Genre Id');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true }
    );
    res.status(200).send(updatedGenre);
  } catch (ex) {
    return res.status(500).send('Something went wrong');
  }
});

// delete genre
router.delete('/:id', [auth, admin], async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Genre Id');
  try {
    const deletedGenre = await Genre.findByIdAndRemove(req.params.id);
    return res.status(200).send(deletedGenre);
  } catch (ex) {
    return res.status(500).send('Something went wrong');
  }
});

// exports
module.exports = router;
