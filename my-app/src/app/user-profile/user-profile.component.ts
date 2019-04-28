import { Component, OnInit, Input } from '@angular/core';
import { Etudiant, TableListService, EtudiantSimp } from 'app/table-list/table-list.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  providers: [TableListService],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  etudiant: Etudiant;
  loaded: Promise<boolean>;

  constructor(private tableListService: TableListService,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('idEtudiant');
    console.log(id);

    this.tableListService.getEtudiantObs(this.route.snapshot.params).subscribe(rep => {
      const etu: EtudiantSimp = rep[0];


      this.tableListService.getSpecialiteObs().subscribe(spe => {

        this.tableListService.getPaysObs().subscribe(pays => {

          this.tableListService.getEtatObs().subscribe(etat => {
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
                semainesRestantes: etu.semainesRestantes,
                dateDebut: etu.dateDebut === null ? null : new Date(etu.dateDebut.toString()),
                dateFin: etu.dateFin === null ? null : new Date(etu.dateFin.toString()),
                pays: pays.find(function (element) {
                  return element.idPays === etu.pays;
                }),
                obtenuVia: etu.obtenuVia,
                mail: etu.mail,
                annee: etu.annee
              }

              if (etudiant.pays === undefined) {
                etudiant.pays = {
                  idPays: null,
                  nomPays: null
                };
              }

              console.log(etudiant);
              this.etudiant = etudiant;
              this.loaded = Promise.resolve(true); // Setting the Promise as resolved after I have the needed data
            });
        });
      });

    });

    // TODO faire les champs
  }

  buildPhoto(data: Array<number>): SafeUrl {

    const base64String = btoa(new Uint8Array(data).reduce(function (data2, byte) {
      return data2 + String.fromCharCode(byte);
    }, ''));

    return this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
  }

}
