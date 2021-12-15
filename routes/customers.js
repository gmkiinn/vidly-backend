const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

// routes
// create customer
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });

    const savedCustomer = await customer.save();
    return res.status(201).send(savedCustomer);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

// get customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).send(customers);
  } catch (ex) {
    res.status(500).send('something went wrong');
  }
});

// get Customer
router.get('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Id');
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send('Customer not found with given id');
  return res.status(200).send(customer);
});

// update customer
router.put('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Id');
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send('Customer not found with given id');

  // update
  customer.name = req.body.name;
  customer.phone = req.body.phone;
  customer.isGold = req.body.isGold;

  const updatedCustomer = await customer.save();
  console.log(updatedCustomer);
  res.status(200).send(updatedCustomer);
});

// delete customer
router.delete('/:id', async (req, res) => {
  if (!(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)))
    return res.status(400).send('Please send valid Id');

  const customer = await Customer.findByIdAndRemove(req.params.id);
  res.status(200).send(customer);
});

//exports
module.exports = router;
