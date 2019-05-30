import { Component, OnInit, ViewChild, ViewEncapsulation, Output } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSortable, MatDialog } from '@angular/material';
import { TableListService } from '../service/table-list/table-list.service';
import { filter } from 'rxjs-compat/operator/filter';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { Etudiant } from '../models/Etudiant';
import { EtudiantSimp } from '../models/EtudiantSimp';
import * as Chartist from 'chartist';
import { StatistiquesService } from '../service/statistiques/statistiques.service';
import * as $ from 'jquery';
import 'bootstrap-notify';
import { Favoris } from 'app/models/Favoris';
import { HttpParams } from '@angular/common/http';
import { FavPopupComponent } from 'app/fav-popup/fav-popup.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';



@Component({
  selector: 'app-etudiant-non-valide',
  providers: [TableListService, StatistiquesService],
  templateUrl: './etudiant-non-valide.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./etudiant-non-valide.component.css']
})

export class EtudiantNonValideComponent implements OnInit {

  etudiant: Etudiant[];
  noResult: Boolean;
  error: any;
  headers: string[];

  displayedColumns: string[] = [
    'photo',
    'nom',
    'prenom',
    'promo',
    'specialite',
    'etat',
    'semainesRestantes',
    'commentaire',
    'annee',
    'actions'
  ];
  dataSource = new MatTableDataSource<Etudiant>();

  filtreForm = new FormGroup({
    promo: new FormGroup({
      SI3: new FormControl(''),
      SI4: new FormControl(''),
      SI5: new FormControl('')
    }),
    specialite: new FormGroup({
      IHM: new FormControl(''),
      CS: new FormControl(''),
      STRAW: new FormControl(''),
      AL: new FormControl(''),
      IAM: new FormControl('')
    }),
    etat: new FormGroup({
      NonValide: new FormControl(''),
      DossierEnCours: new FormControl(''),
      DossierAnnule: new FormControl(''),
      EnAttenteDuDossier: new FormControl('')
    }),
    semainesRestantes: new FormControl(''),
    annee: new FormControl('')
  });

  opened: boolean;
  fav: Favoris[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    this.initPieChart();

    this.tableListService.getEtudiantObs(this.route.snapshot.queryParams).subscribe(rep => {

      this.opened = false;

      this.setFormGrp();


      this.fav = JSON.parse(localStorage.getItem('favorisENV'));

      if (this.fav == null) {
        this.fav = []
      }

      const etuS: EtudiantSimp[] = rep;

      if (etuS == null || etuS === undefined || etuS.length === 0) {
        this.noResult = true;
      } else {
        this.noResult = false;
      }
      this.etudiant = [];

      const spePromise = this.tableListService.getSpecialiteObs().toPromise();
      const paysPromise = this.tableListService.getPaysObs().toPromise();
      const etatPromise = this.tableListService.getEtatObs().toPromise();

      Promise.all([spePromise, paysPromise, etatPromise]).then((values) => {
        const spe = values[0];
        const pays = values[1];
        const etat = values[2];

        etuS.forEach(etu => {

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

          // console.log(etudiant);
          this.etudiant.push(etudiant);
        });

        this.dataSource = new MatTableDataSource<Etudiant>(this.etudiant);
        // this.dataSource = this.etudiant
        this.dataSource.sort = this.sort;

        this.dataSource.sortingDataAccessor = (item, property) => {

          // console.log(item, property);
          // return new Date(item.date);

          switch (property) {
            case 'specialite': {
              return item.specialite.nomSpecialite;
            }
            case 'etat': {
              return item.etat.nomEtat;
            }
            case 'pays': {
              return item.pays.nomPays;
            }
            default: {
              return item[property];
            }
          }
        };

        this.paginator._intl.itemsPerPageLabel = 'Nombre d\'étudiants par page';
        this.paginator._intl.getRangeLabel = function (page, pageSize, length) {
          if (length === 0 || pageSize === 0) {
            return '0 sur ' + length;
          }
          length = Math.max(length, 0);
          const startIndex = page * pageSize;
          const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
          return startIndex + 1 + ' - ' + endIndex + ' sur ' + length;
        };

        this.dataSource.paginator = this.paginator;
      })
    });
  }


  buildPhoto(data: Array<number>): SafeUrl {

    const base64String = btoa(new Uint8Array(data).reduce(function (data2, byte) {
      return data2 + String.fromCharCode(byte);
    }, ''));

    return this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (item, filtre) => {
      const str: string[] = [item.nom,
      item.prenom,
      item.commentaire,
      item.promo,
      item.annee.toString(),
      item.semainesRestantes.toString(),
      item.specialite.nomSpecialite,
      item.etat.nomEtat];

      // console.log(str);

      let matched = false;
      str.forEach(strT => {
        strT = strT.replace(/null/g, '').trim().toLowerCase();
        if (strT.match(filtre.trim().toLocaleLowerCase())) {
          matched = true;
        }
      });
      return matched;
    }
  }

  edit(etu: Etudiant) {
    this.router.navigate(['user-profile', { idEtudiant: etu.idEtudiant }]);
  }


  /** FAVORIS **/
  toggleNav() {
    if (this.opened) {
      document.getElementById('mySidebar').style.width = '0';
      document.getElementById('main').style.marginLeft = '0';
    } else {
      document.getElementById('mySidebar').style.width = '240px';
      document.getElementById('main').style.marginLeft = '225px';
    }
    this.opened = !this.opened;
  }

  onSubmit() {
    const params = this.getParams();

    console.log('params', params);

    this.router.navigateByUrl('/etudiant-non-valide?' + params.toString()).then(state => {
      window.location.reload();
    });
  }

  setFormGrp() {

    const promo = this.route.snapshot.queryParamMap.getAll('promo');
    if (promo != null) {
      // console.log('promo : ', promo);
      const self = this;
      promo.forEach(function (value) {
        self.filtreForm.get('promo').get(value).setValue(true);
      })
    }

    const nomEtat = this.route.snapshot.queryParamMap.getAll('etat');

    for (let i = 0; i < Object.keys(nomEtat).length; i++) {
      const values = Object.keys(nomEtat).map(key => nomEtat[key]);
        switch (values[i]) {
          case 'Non validé': {
            this.filtreForm.get('etat').get('NonValide').setValue(true)
            break;
          }

          case 'Dossier en cours': {
            this.filtreForm.get('etat').get('DossierEnCours').setValue(true)
            break;
          }

          case 'Dossier annulé': {
            this.filtreForm.get('etat').get('DossierAnnule').setValue(true)
            break;
          }

          case 'En attente du dossier': {
            this.filtreForm.get('etat').get('EnAttenteDuDossier').setValue(true)
            break;
          }
      }
    }

    const spe = this.route.snapshot.queryParamMap.getAll('specialite');
    if (spe != null) {
      const self = this;
      spe.forEach(function (value) {
        self.filtreForm.get('specialite').get(value).setValue(true)
      })
    }

    const semainesRestantes = this.route.snapshot.queryParamMap.getAll('semainesRestantes');
    if (semainesRestantes != null) {
      this.filtreForm.get('semainesRestantes').setValue(semainesRestantes)
    }

    const annee = this.route.snapshot.queryParamMap.getAll('annee');
    if (annee != null) {
      this.filtreForm.get('annee').setValue(annee)
    }

  }

  getParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('degre', '2');
    params = params.append('degre', '3');
    params = params.append('degre', '4');

    let promo = []
    promo = this.filtreForm.get('promo').value;
    // console.log('params init', params);
    for (let i = 0; i < Object.keys(promo).length; i++) {
      const values = Object.keys(promo).map(key => promo[key])
      if (values[i]) {
        params = params.append('promo', Object.keys(promo)[i]);
      }
    }

    let specialite = []
    specialite = this.filtreForm.get('specialite').value;
    for (let i = 0; i < Object.keys(specialite).length; i++) {
      const values = Object.keys(specialite).map(key => specialite[key])
      if (values[i]) {
        params = params.append('specialite', Object.keys(specialite)[i]);
      }
    }

    let nomEtat = []
    nomEtat = this.filtreForm.get('etat').value;
    for (let i = 0; i < Object.keys(nomEtat).length; i++) {
      const key = Object.keys(nomEtat)[i];
      if (Object.keys(nomEtat).map(keyy => nomEtat[keyy])[i]) {
        switch (key) {
          case 'NonValide': {
            params = params.append('etat', 'Non validé');
            break;
          }

          case 'DossierEnCours': {
            params = params.append('etat', 'Dossier En Cours');
            break;
          }

          case 'DossierAnnule': {
            params = params.append('etat', 'Dossier annulé');
            break;
          }

          case 'EnAttenteDuDossier': {
            params = params.append('etat', 'En attente du dossier');
            break;
          }
        }
      }
    }

    let semainesRestantes = [];
    semainesRestantes = this.filtreForm.get('semainesRestantes').value;
    for (let i = 0; i < Object.keys(semainesRestantes).length; i++) {
      const values = Object.keys(semainesRestantes).map(key => semainesRestantes[key])
      params = params.append('semainesRestantes', values[i]);
    }

    let annee = [];
    annee = this.filtreForm.get('annee').value;
    for (let i = 0; i < Object.keys(annee).length; i++) {
      const values = Object.keys(annee).map(key => annee[key])
      params = params.append('annee', values[i]);
    }

    return params;
  }

  deleteFav(favori: Favoris) {
    const index = this.fav.indexOf(favori);
    this.fav.splice(index, 1);
    localStorage.setItem('favorisENV', JSON.stringify(this.fav));
  }

  addFav() {
    const params = this.getParams();
    const url = 'etudiant-non-valide?' + params.toString();

    const dialogRef = this.dialog.open(FavPopupComponent, {
      height: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        if (Array.isArray(result)) {
          this.fav.push({ nom: result[0], url: url, memo: result[1] })
        } else {
          this.fav.push({ nom: result, url: url })
        }

        localStorage.setItem('favorisENV', JSON.stringify(this.fav));
        console.log('fav2', this.fav);
        $.notify({
          icon: 'success',
          message: 'Le favoris a bien été ajouté à votre espace !'
        },
          {
            type: 'success',
            timer: 4000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
      }
    });

  }

  /** END FAVORIS **/



  /**
   *   Succeed Graph Init
   */
  initPieChart() {
    const promotionPro = this.statistiquesService.getPieChartNonValide().toPromise();
    const tab: number[] = [0, 0, 0, 0];
    promotionPro.then((value) => {

      if (value.length !== 4) {
        for (const i of value) {

          if (i.etatdegre === 1) {
            tab[0] = i.degre;
          } else {
            tab[0] = 0;
          }

          console.log(i);
          tab[i.etatdegre - 3] = i.degre
        }
      } else {

        for (let j = 0; j < value.length; j++) {
          tab[j] = value[j].degre;
        }
      }

      const validationDonut = new Chartist.Pie('#ct-chart-pie', {

        series: [tab[1], tab[0], tab[3], tab[2]]
      }, {
          startAngle: 270,
          showLabel: true
        });
    });
  }


  constructor(private tableListService: TableListService, private statistiquesService: StatistiquesService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog) { }

}
