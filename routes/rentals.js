const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = express.Router();
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

// routes
// create rental
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Movie not found with given id');

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send('Customer not found with given id');

  if (movie.numberInStock === 0)
    return res.status(404).send('Movie not in stock');
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const task = Fawn.Task();

  task
    .save('rentals', rental)
    .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
    .run()
    .then(function (results) {
      return res.status(201).send(rental);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500).send('Something went wrong');
    });

  //   rental = await rental.save();
  //   movie.numberInStock--;
  //   movie = await movie.save();
  //   res.status(201).send(rental);
});

// get rentals
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  return res.status(200).send(rentals);
});

// get rental
router.get('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Id');

  const rental = await Rental.findById(req.params.id);
  return res.status(200).send(rental);
});

// update router
router.put('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Id');

  const rental = await Rental.findById(req.params.id);
  return res.status(200).send(rental);
});

// export router
module.exports = router;
