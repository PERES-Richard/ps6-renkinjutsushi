import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TableListService } from '../service/table-list/table-list.service';
import { Etudiant } from '../models/Etudiant';
import { EtudiantSimp } from '../models/EtudiantSimp';
import { UserProfileService } from 'app/service/user-profile/user-profile.service';
import { NgModel } from '@angular/forms';
import { Specialite } from 'app/models/Specialite';
import { Pays } from 'app/models/Pays';
import { Etat } from 'app/models/Etat';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { Location } from '@angular/common';



@Component({
  selector: 'app-user-profile',
  providers: [TableListService, UserProfileService],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  etudiant: Etudiant;
  loaded: Promise<boolean>;

  specialites: Specialite[];
  pays: Pays[];
  etats: Etat[];
  planModel: any = { dpd: Date, dpf: Date };


  constructor(private tableListService: TableListService, private userProfileService: UserProfileService,
    private domSanitizer: DomSanitizer, private dateAdapter: DateAdapter<Date>, private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');

    const id = this.route.snapshot.paramMap.get('idEtudiant');
    // console.log(id);

    this.tableListService.getEtudiantObs(this.route.snapshot.params).subscribe(rep => {
      const etu: EtudiantSimp = rep[0];


      this.tableListService.getSpecialiteObs().subscribe(spe => {
        this.specialites = spe;
        // console.log(this.specialites);

        this.tableListService.getPaysObs().subscribe(pays => {
          this.pays = pays;

          this.tableListService.getEtatObs().subscribe(etat => {

            this.etats = etat;

            const etudiant: Etudiant = {
              idEtudiant: etu.idEtudiant,
              nom: etu.nom,
              prenom: etu.prenom,
              photo: etu.photo === null ? './assets/img/faces/no_pic.gif' : this.buildPhoto(etu.photo.data),
              promo: etu.promo,
              specialite: spe.find(function (element) {
                return element.idSpecialite === etu.specialite;
              }),
              commentaire: etu.commentaire,
              etat: etat.find(function (element) {
                return element.idEtat === etu.etat;
              }),
              typeValidation: etu.typeValidation,
              semainesRestantes: etu.semainesRestantes,
              dateDebut: etu.dateDebut === null ? null : new Date(etu.dateDebut.toString()),
              dateFin: etu.dateFin === null ? null : new Date(etu.dateFin.toString()),
              pays: pays.find(function (element) {
                return element.idPays === etu.pays;
              }),
              obtenuVia: etu.obtenuVia,
              mail: etu.mail.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
              annee: etu.annee
            }

            if (etudiant.pays === undefined) {
              etudiant.pays = {
                idPays: null,
                nomPays: null
              };
            }

            this.planModel.dpd = etudiant.dateDebut;
            this.planModel.dpf = etudiant.dateFin;

            console.log(etudiant);
            this.etudiant = etudiant;
            this.loaded = Promise.resolve(true); // Setting the Promise as resolved after I have the needed data
          });
        });
      });

    });

  }

  buildPhoto(data: Array<number>): SafeUrl {

    const base64String = btoa(new Uint8Array(data).reduce(function (data2, byte) {
      return data2 + String.fromCharCode(byte);
    }, ''));

    return this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
  }

  updateStudent() {
    this.etudiant.photo = 'photo';
    console.log('spe  ' + this.etudiant.specialite.nomSpecialite);
    const idCountryPro = this.userProfileService.getIdCountry(this.etudiant.pays.nomPays).toPromise();
    const idSpecialityPro = this.userProfileService.getIdSpeciality(this.etudiant.specialite.nomSpecialite).toPromise();
    console.log('spe ' + this.etudiant.specialite.envisagee);
    const idEtatPro = this.userProfileService.getIdEtat(this.etudiant.etat.nomEtat).toPromise();


    Promise.all([idCountryPro, idSpecialityPro, idEtatPro]).then((values) => {

      this.etudiant.pays.idPays = values[0][0].id;
      this.etudiant.specialite.idSpecialite = values[1][1].idSpecialite;
      this.etudiant.etat.idEtat = values[2][0].idEtat;

      console.log(values);

      const postPro = this.userProfileService.postStudent(this.etudiant).toPromise();

      postPro.then((value => {
        this.location.back();
      }))
    });
  }

}
