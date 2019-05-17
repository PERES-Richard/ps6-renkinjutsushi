import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSortable, MatDialogRef, MatDialog } from '@angular/material';
import { TableListService } from '../service/table-list/table-list.service';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Etudiant } from '../models/Etudiant';
import { EtudiantSimp } from '../models/EtudiantSimp';
import { Favoris } from '../models/Favoris';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { FavPopupComponent } from 'app/fav-popup/fav-popup.component';
import { FormArray } from '@angular/forms';
import { Specialite } from '../models/Specialite';
import { Etat } from '../models/Etat';
import { Pays } from '../models/Pays';
import { any } from 'codelyzer/util/function';
import * as Chartist from 'chartist';
import { StatistiquesService } from '../service/statistiques/statistiques.service';


@Component({
  selector: 'app-etudiant-en-cours',
  providers: [TableListService, StatistiquesService],
  templateUrl: './etudiant-en-cours.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./etudiant-en-cours.component.css']
})

export class EtudiantEnCoursComponent implements OnInit {

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
    typeValidation: new FormGroup({
      Semestre: new FormControl(''),
      Stage: new FormControl(''),
      Autre: new FormControl('')
    }),
    semainesRestantes: new FormControl(''),
    annee: new FormControl('')
  });

  etudiant: Etudiant[];
  error: any;
  headers: string[];

  opened: boolean;
  fav: Favoris[];

  dateDebutMin: Date;
  dateDebutMax: Date;

  dateDebutMin2: Date;
  dateDebutMax2: Date;

  dateFinMin: Date;
  dateFinMax: Date;

  dateFinMin2: Date;
  dateFinMax2: Date;

  displayedColumns: string[] = [
    'photo',
    'nom',
    'prenom',
    'promo',
    'specialite',
    'typeValidation',
    'semainesRestantes',
    'pays',
    'dateDebut',
    'dateFin',
    'commentaire',
    'annee',
    'actions'
  ];
  dataSource = new MatTableDataSource<Etudiant>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private file;
  bol: boolean;
  allStud: string[];
  etud: Etudiant;

  fileChange(file) {
    this.file = file.target.files[0];
    if (this.file.name.substr(-4) !== '.csv') {
      document.getElementById('para').innerHTML = 'Le fichier ' + this.file.name + ' n\'est pas un fichier .csv';
    } else {
      this.verifyCSV()
      setTimeout(() => {
        if (this.bol) {
          console.log(this.allStud[0]);
          for (let i = 0; i < this.allStud.length; i++) {
            document.getElementById('para').innerHTML = this.file.name + '';
            this.constructEtudiant(this.allStud[i]);
            console.log(this.etud.nom);
            this.tableListService.postEtu(this.etud);
          }
        } else {
          document.getElementById('para').innerHTML = this.file.name + ' est invalide';
        }
      }, 10000);

    }
  }

  constructEtudiant(str: String) {
    const etudi = str.split(';');
    this.etud.nom = etudi[0];
    this.etud.prenom = etudi[1];
    this.etud.promo = etudi[2];
    this.etud.specialite.idSpecialite = parseInt(etudi[3], 10);
    this.etud.commentaire = etudi[4];
    this.etud.etat.idEtat = parseInt(etudi[5], 10);
    this.etud.semainesRestantes = parseInt(etudi[6], 10);
    this.etud.pays.idPays = parseInt(etudi[7], 10);
    this.etud.obtenuVia = etudi[8];
    this.etud.annee = parseInt(etudi[9], 10);
    this.etud.etat.degre = parseInt(etudi[10], 10);
  }

  writeCSV() {
    let etu = '';
    for (let i = 0; i < this.etudiant.length; i++) {
      etu += this.etudiant[i].nom + ';';
      etu += this.etudiant[i].prenom + ';';
      etu += this.etudiant[i].promo + ';';
      etu += this.etudiant[i].specialite.nomSpecialite + ';';
      etu += this.etudiant[i].commentaire + ';';
      etu += this.etudiant[i].etat.nomEtat + ';'
      etu += this.etudiant[i].semainesRestantes + ';';
      etu += this.etudiant[i].pays.nomPays + ';';
      etu += this.etudiant[i].obtenuVia + ';';
      etu += this.etudiant[i].annee + ';';
      etu += this.etudiant[i].etat.degre + ';';
    }

    const a = document.createElement('a');
    const blob = new Blob([etu], { type: 'text/csv' });

    a.href = window.URL.createObjectURL(blob);
    a.download = 'myFile.csv';
    a.click();
    window.URL.revokeObjectURL(window.URL.createObjectURL(blob));
    a.remove();
  }

  verifyCSV() {
    const reader = new FileReader();
    reader.onload = (event: Event) => {
      const text = reader.result as string;
      const allTextLines = text.split(/\r\n|\n/);
      for (let i = 0; i < allTextLines.length - 2; i++) {
        const entries = allTextLines[i].split(';');
        if (typeof (entries[0]) !== 'string' || typeof (entries[1]) !== 'string'
          || typeof (entries[2]) !== 'string' || typeof (parseInt(entries[3], 10)) !==
          'number' || typeof (entries[4]) !== 'string' || typeof (parseInt(entries[5], 10))
          !== 'number' || typeof (parseInt(entries[6], 10)) !== 'number' || typeof (parseInt(entries[7], 10))
          !== 'number' || typeof (entries[8]) !== 'string' || typeof (parseInt(entries[9], 10)) !== 'number'
          || typeof (parseInt(entries[10], 10)) !== 'number') {
          this.bol = false;
          return;
        }
      }
      this.bol = true;
      this.allStud = allTextLines;
    };
    reader.readAsText(this.file);
  }

  ngOnInit() {

    this.initStudentByCountry();

    this.tableListService.getEtudiantObs(this.route.snapshot.queryParams).subscribe(rep => {

      this.initDates();
      this.opened = false;

      this.fav = JSON.parse(localStorage.getItem('favoris'));

      if (this.fav == null) {
        this.fav = []
      }

      // console.log('datemin =', this.dateDebutMin);
      // console.log('datemax =', this.dateDebutMax);


      const etuS: EtudiantSimp[] = rep;

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


  initDates() {
    this.dateDebutMin = new Date(new Date().getFullYear().toString() + '-01-01');
    this.dateDebutMax = new Date(new Date().getFullYear().toString() + '-01-30');

    const date1 = new Date(new Date().getFullYear().toString() + '-01-01');
    date1.setFullYear(date1.getFullYear() + 1);
    const date2 = new Date(new Date().getFullYear().toString() + '-01-30');
    date2.setFullYear(date2.getFullYear() + 1);

    this.dateDebutMin2 = date1;
    this.dateDebutMax2 = date2;


    this.dateFinMin = new Date(new Date().getFullYear().toString() + '-06-01');
    this.dateFinMax = new Date(new Date().getFullYear().toString() + '-06-30');

    const date3 = new Date(new Date().getFullYear().toString() + '-06-01');
    date3.setFullYear(date3.getFullYear() + 1);
    const date4 = new Date(new Date().getFullYear().toString() + '-06-30');
    date4.setFullYear(date4.getFullYear() + 1);

    this.dateFinMin2 = date3;
    this.dateFinMax2 = date4;
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
      item.semainesRestantes.toString(),
      item.typeValidation,
      item.specialite.nomSpecialite,
      item.pays.nomPays,
      item.annee.toString()];

      if (item.dateDebut != null) {
        str.push(
          item.dateDebut.toLocaleDateString());
      }
      if (item.dateFin != null) {
        str.push(
          item.dateFin.toLocaleDateString())
      }

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


  toggleNav() {
    if (this.opened) {
      document.getElementById('mySidebar').style.width = '0';
      document.getElementById('main').style.marginLeft = '0';
    } else {
      document.getElementById('mySidebar').style.width = '225px';
      document.getElementById('main').style.marginLeft = '225px';
    }
    this.opened = !this.opened;
  }

  setFilter() {
    // TODO preset les filtres
  }

  onSubmit() {
    const params = this.getParams();

    this.router.navigateByUrl('/etudiant-en-cours?' + params.toString()).then(state => {
      window.location.reload();
    }

    );
  }


  getParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('degre', '1');

    let promo = []
    promo = this.filtreForm.get('promo').value;
    // console.log('params init', params);
    for (let i = 0; i < Object.keys(promo).length; i++) {
      if (Object.values(promo)[i]) {
        params = params.append('promo', Object.keys(promo)[i]);
      }
    }

    let specialite = []
    specialite = this.filtreForm.get('specialite').value;
    for (let i = 0; i < Object.keys(specialite).length; i++) {
      if (Object.values(specialite)[i]) {
        params = params.append('specialite', Object.keys(specialite)[i]);
      }
    }

    let typeValidation = []
    typeValidation = this.filtreForm.get('typeValidation').value;
    for (let i = 0; i < Object.keys(typeValidation).length; i++) {
      if (Object.values(typeValidation)[i]) {
        params = params.append('typeValidation', Object.keys(typeValidation)[i]);
      }
    }

    let semainesRestantes = [];
    semainesRestantes = this.filtreForm.get('semainesRestantes').value;
    for (let i = 0; i < Object.keys(semainesRestantes).length; i++) {
      params = params.append('semainesRestantes', Object.values(semainesRestantes)[i]);
    }

    let annee = [];
    annee = this.filtreForm.get('annee').value;
    for (let i = 0; i < Object.keys(annee).length; i++) {
      params = params.append('annee', Object.values(annee)[i]);
    }

    return params;
  }

  deleteFav(favori: Favoris) {
    const index = this.fav.indexOf(favori);
    this.fav.splice(index, 1);
    localStorage.setItem('favoris', JSON.stringify(this.fav));
  }

  addFav() {
    const params = this.getParams();
    const url = 'etudiant-en-cours?' + params.toString();

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

        localStorage.setItem('favoris', JSON.stringify(this.fav));
        console.log('fav2', this.fav);
      }
    });

  }

  /**
   *   Number Of Students For Every Country
   */
  initStudentByCountry() {
    const countryPro = this.statistiquesService.getNumberStudents('1').toPromise();

    Promise.all([countryPro]).then((value) => {

      const country1 = value[0][0].pays;
      const country2 = value[0][1].pays;
      const country3 = value[0][2].pays;

      // console.log("country1" + country1);
      // console.log("country2" + country2);
      // console.log("country3" + country3);

      const country11Pro = this.statistiquesService.getNumberStudentsWithCountry(country1, '1').toPromise();
      const country22Pro = this.statistiquesService.getNumberStudentsWithCountry(country2, '1').toPromise();
      const country33Pro = this.statistiquesService.getNumberStudentsWithCountry(country3, '1').toPromise();

      Promise.all([country11Pro, country22Pro, country33Pro]).then((values) => {

        console.log('values ' + values[2]);

        values[0].sort(this.sortByName);
        values[1].sort(this.sortByName);
        values[2].sort(this.sortByName);


        const country11 = [values[0][0], values[0][1], values[0][2]];
        const country22 = [values[1][0], values[1][1], values[1][2]];
        const country33 = [values[2][0], values[2][1], values[2][2]];

        console.log('values', country11[0], country11[1], country11[2]);
        console.log('values', country22[0]);
        console.log('values', country33[0]);

        const numberOfStudents = new Chartist.Bar('#numberOfStudents', {
          labels: [country11[0].pays, country22[0].pays, country33[0].pays],
          series: [
            [country11[0].nombre, country22[0].nombre, country33[0].nombre],
            [country11[1].nombre, country22[1].nombre, country33[1].nombre],
            [country11[2].nombre, country22[2].nombre, country33[2].nombre]
          ]
        }, {
            seriesBarDistance: 15,
            axisX: {
              offset: 20
            },
            axisY: {
              offset: 25,
              labelInterpolationFnc: function (result) {
                return result
              },
              scaleMinSpace: 20
            }
          });
      });
    });
  }

  sortByName(elementOne: any, elementTwo: any) {
    if (elementOne.nom_fr_fr < elementTwo.nom_fr_fr) {
      return 0;
    } else {
      return 1;
    }
  }



  constructor(private tableListService: TableListService, private statistiquesService: StatistiquesService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog) { }

}
