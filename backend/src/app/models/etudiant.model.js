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
  commentaire: Joi.string().required(),
  etat: Joi.object().required(),
  semainesRestantes: Joi.number().required(),
  typeValidation: Joi.string().required(),
  dateDebut: Joi.date().required(),
  dateFin: Joi.date().required(),
  pays: Joi.object().required(),
  obtenuVia: Joi.string().required(),
  mail: Joi.string().required(),
  annee: Joi.number().required()
});
