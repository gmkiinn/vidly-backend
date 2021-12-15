const mongoose = require('mongoose');
const Joi = require('joi');

// customer schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [5, 'Must be at least 5 letters, got {VALUE}'],
    maxLength: [50, 'Must be less than 50, got {VALUE}'],
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
});

// Customer model
const Customer = mongoose.model('Customer', customerSchema);

// validation
function validateCustomer(customer) {
  const customerSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });
  return customerSchema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
