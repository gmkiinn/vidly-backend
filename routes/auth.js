const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const config = require('config');

// routes
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or Password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or Password');

  const token = user.generateAuthToken();

  return res.status(200).send(token);
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required().min(5).max(255),
    password: Joi.string().required().min(5).max(255),
  });
  return schema.validate(user);
}

module.exports = router;
