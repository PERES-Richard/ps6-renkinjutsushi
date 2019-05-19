const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');


module.exports = new BaseModel('EtudiantSimp',{
  idEtudiant: Joi.number().required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  photo: Joi.object(),
  promo: Joi.string().required(),
  specialite: Joi.number().required(),
  commentaire: Joi.string().required(),
  etat: Joi.number(),
  semainesRestantes: Joi.string().required(),
  dateDebut: Joi.date().required(),
  dateFin: Joi.date().required(),
  pays: Joi.number().required(),
  obtenuVia: Joi.string().required(),
  mail: Joi.string().required(),
  annee: Joi.number().required()
});

