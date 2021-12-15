const mongoose = require('mongoose');
const Joi = require('joi');

// Genre Scheme
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [5, 'Must be at least 5 letters, got {VALUE}'],
    maxLength: [50, 'Must be less than 50, got {VALUE}'],
  },
});

// Genre Model
const Genre = mongoose.model('Genre', genreSchema);

// Validate genre input
function validateGenre(genre) {
  const genreSchema = Joi.object({
    name: Joi.string().required().min(5).max(50),
  });
  return genreSchema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validateGenre;
