const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middlewares/auth');

// routes
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User is already registered');

  try {
    const user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    return res
      .header('x-auth-token', token)
      .status(200)
      .send(_.pick(user, ['_id', 'name', 'email']));
  } catch (ex) {
    return res.status(500).send('Something went wrong');
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return res.status(200).send(user);
});

module.exports = router;
