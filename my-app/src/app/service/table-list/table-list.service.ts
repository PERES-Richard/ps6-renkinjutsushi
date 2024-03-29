import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { template } from '@angular/core/src/render3';
import { ParamMap, Params } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Pays } from '../../models/Pays';
import { Etudiant } from '../../models/Etudiant';
import { EtudiantSimp } from '../../models/EtudiantSimp';
import { Specialite } from '../../models/Specialite';
import { Etat } from '../../models/Etat';


@Injectable(
  // {providedIn: 'root'}
)
export class TableListService {

  etudiantURL = 'http://localhost:3000/getData'
  etudiantURLP= 'http://localhost:3000/postData'
  specialiteURL = 'http://localhost:3000/getData/specialite'
  etatURL = 'http://localhost:3000/getData/etat'
  paysURL = 'http://localhost:3000/getData/pays'

  etudiant: Etudiant[];

  constructor(private http: HttpClient) { }

  getEtudiantObs(params?: Params) {
    const rep = this.http.get<EtudiantSimp[]>(this.etudiantURL, { params: params });
    // const rep = from(fetch(this.etudiantURL));
    return rep;
  }

  getSpecialiteObs() {
    const rep = this.http.get<Specialite[]>(this.specialiteURL);
    // const rep = from(fetch(this.specialiteURL + idSpe));
    return rep;
  }

  getEtatObs() {
    const rep = this.http.get<Etat[]>(this.etatURL);
    // const rep = from(fetch(this.specialiteURL + idSpe));
    return rep;
  }

  getPaysObs() {
    const rep = this.http.get<Pays[]>(this.paysURL);
    // const rep = from(fetch(this.specialiteURL + idSpe));
    return rep;
  }

  postEtu(etudiant: Etudiant){
    return this.http.post(this.etudiantURLP,etudiant).subscribe();
    //"nom="+etudiant.nom +"&prenom="+etudiant.prenom +"&promo="+etudiant.promo +"&specialite="+etudiant.specialite +"&commentaire="+etudiant.commentaire +"&etat="+etudiant.etat +"&semainesRestantes="+etudiant.semainesRestantes +"&pays="+etudiant.pays +"&obtenuVia="+etudiant.obtenuVia +"&annee="+etudiant.annee
  }

  // setEtu(etudiantSimp: EtudiantSimp[]): Etudiant[] {
  //   if (etudiantSimp === null) {
  //     return null;
  //   }

  //   const etudiant = []

  //   for (let i = 0; i < etudiantSimp.length; i++) {
  //     const etu: Etudiant = {
  //       idEtudiant: etudiantSimp[i].idEtudiant,
  //       nom: etudiantSimp[i].nom,
  //       prenom: etudiantSimp[i].prenom,
  //       filiere: etudiantSimp[i].filiere,
  //       specialite: this.getSpecialite(etudiantSimp[i].specialite),
  //       commentaire: etudiantSimp[i].commentaire,
  //       etat: etudiantSimp[i].etat,
  //       semestresRestants: etudiantSimp[i].semestresRestants,
  //       dateDebut: etudiantSimp[i].dateDebut,
  //       dateFin: etudiantSimp[i].dateFin,
  //       pays: etudiantSimp[i].pays,
  //       obtenuVia: etudiantSimp[i].obtenuVia
  //     }
  //     console.log(etu)
  //     etudiant.push(etu);
  //   }

  //   this.etudiant = etudiant;
  //   return etudiant;

  // }

  // getSpecialite(idSpe: number): Specialite {

  //   let spec: Specialite = null;

  //   // this.getSpecialiteObs(idSpe).subscribe(resp => {
  //     // const specRep = resp;
  //     // // console.log(specRep)

  //     // spec = {
  //     //   idSpecialite: specRep[0].idSpecialite,
  //     //   nomSpecialite: specRep[0].nomSpecialite,
  //     //   envisagee: specRep[0].envisagee === 1,
  //     // }

  //     spec = resp;
  //   });

  //   return spec;
  // }

}

