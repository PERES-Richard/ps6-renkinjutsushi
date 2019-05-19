const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');


module.exports = new BaseModel('Specialite',{
  idSpecialite: Joi.number().required(),
  nomSpecialite: Joi.string().required(),
  envisagee: Joi.boolean().required(),
});
