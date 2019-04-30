import {SafeUrl} from '@angular/platform-browser';
import {Pays} from './Pays';
import {Specialite} from './Specialite';
import {Etat} from './Etat';

export interface Etudiant {
  idEtudiant: number,
  nom: string,
  prenom: string,
  photo: SafeUrl,
  promo: string,
  specialite: Specialite,
  commentaire: string,
  etat: Etat,
  semainesRestantes: number,
  typeValidation: string,
  dateDebut: Date,
  dateFin: Date,
  pays: Pays,
  obtenuVia: string,
  mail: string,
  annee: number
}
