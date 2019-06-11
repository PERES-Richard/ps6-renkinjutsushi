const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');
const Specialite = require('./specialite.model');
const Etat = require('./etat.model');
const Pays = require('./pays.model');


module.exports = new BaseModel('Etudiant', {
  idEtudiant: Joi.number().required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  photo: Joi.string(),
  promo: Joi.string().required(),
  specialite: Joi.object().required(),
  commentaire: Joi.string(),
  etat: Joi.object().required(),
  semainesRestantes: Joi.number().required(),
  typeValidation: Joi.string(),
  dateDebut: Joi.date(),
  dateFin: Joi.date(),
  pays: Joi.object(),
  obtenuVia: Joi.string(),
  mail: Joi.string(),
  annee: Joi.number().required()
});
