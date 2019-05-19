const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');


module.exports = new BaseModel('Etat',{
  idEtat: Joi.number().required(),
  nomEtat: Joi.string().required(),
  degre: Joi.number().required()


});
