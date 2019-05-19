const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');


module.exports = new BaseModel('Pays',{
  idPays: Joi.number().required(),
  nomPays: Joi.string().required()
});
