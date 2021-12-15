const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

// movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  // genre: {
  //   type: new mongoose.Schema({
  //     _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  //     name: { type: String, required: true },
  //   }),
  //   required: true,
  // },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 2000,
    default: 0,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
});

//movie model
const Movie = mongoose.model('Movie', movieSchema);

//validate movie
function validateMovie(movie) {
  const movieSchema = Joi.object({
    title: Joi.string().required().min(5).max(50),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(2000),
    dailyRentalRate: Joi.number().required().min(0).max(1000),
  });
  return movieSchema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
