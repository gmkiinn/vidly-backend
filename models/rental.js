const mongoose = require('mongoose');
const Joi = require('joi');

// rental schema
const rentalSchema = new mongoose.Schema({
  customer: {
    required: true,
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
    }),
  },
  movie: {
    required: true,
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        maxLength: 255,
        minLength: 5,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 1000,
      },
    }),
  },
  dateOut: {
    type: Date,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental({ customerId, movieId }) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate({ customerId, movieId });
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
