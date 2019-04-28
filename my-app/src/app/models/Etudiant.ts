import {SafeUrl} from "@angular/platform-browser";
import {Pays} from "./Pays";
import {Specialite} from "./Specialite";
import {Etat} from "../service/table-list/table-list.service";

export interface Etudiant {
  idEtudiant: number,
  nom: string,
  prenom: string,
  photo: SafeUrl,
  promo: string,
  specialite: Specialite,
  // specialite: number,
  commentaire: string,
  etat: Etat,
  // etat: number,
  semainesRestantes: number,
  dateDebut: Date,
  dateFin: Date,
  pays: Pays,
  // pays: number,
  obtenuVia: string,
  mail: string,
  annee: number
}
