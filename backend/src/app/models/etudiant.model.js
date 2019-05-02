const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

module.exports = new BaseModel('Etudiant', {
  idEtudiant: Joi.number().required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  photo: Joi.object(SafeUrl),
  promo: Joi.string().required(),
  specialite: Joi.object(Specialite),
  commentaire: Joi.string().required(),
  etat: Joi.object(Etat),
  semainesRestantes: Joi.string().required(),
  dateDebut: Joi.date().required(),
  dateFin: Joi.date().required(),
  pays: Joi.object(Pays),
  obtenuVia: Joi.string().required(),
  mail: Joi.string().required(),
  annee: Joi.number().required()
});