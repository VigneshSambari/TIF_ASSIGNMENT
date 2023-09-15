const Joi = require('joi');

const signUpValidator = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should be at least 2 characters',
    'string.empty': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email should be a valid email address',
    'string.empty': 'Email is empty',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password should be a string',
    'string.min': 'Password should be at least 6 characters',
    'string.empty': 'Password is required',
  }),
});

const signInValidator = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email should be a string',
      'string.email': 'Email should be a valid email address',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.base': 'Password should be a string',
      'string.empty': 'Password is required',
    }),
});
  
const createCommunityValidator = Joi.object({
    name: Joi.string().min(2).required().messages({
      'string.base': 'Name should be a string',
      'string.min': 'Name should be at least 2 characters',
      'string.empty': 'Name is required',
    }),
});

const addMemberValidator = Joi.object({
  community: Joi.string().required().messages({
    'string.base': 'Community should be a string',
    'string.empty': 'Community is required',
  }),
  user: Joi.string().required().messages({
    'string.base': 'User should be a string',
    'string.empty': 'User is required',
  }),
  role: Joi.string().required().messages({
    'string.base': 'Role should be a string',
    'string.empty': 'Role is required',
  }),
});


module.exports = {
  signUpValidator,
  signInValidator,
  createCommunityValidator,
  addMemberValidator,
};
