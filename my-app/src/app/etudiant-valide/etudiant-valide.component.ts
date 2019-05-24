import { Component, OnInit, ViewChild, ViewEncapsulation, Output } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSortable } from '@angular/material';
import { TableListService } from '../service/table-list/table-list.service';
import { filter } from 'rxjs-compat/operator/filter';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { Etudiant } from '../models/Etudiant';
import { EtudiantSimp } from '../models/EtudiantSimp';
import {StatistiquesService} from "../service/statistiques/statistiques.service";
import * as Chartist from "chartist";
import {TupleNameNumber} from "../models/TupleNameNumber";


@Component({
  selector: 'app-etudiant-valide',
  providers: [TableListService,StatistiquesService],
  templateUrl: './etudiant-valide.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./etudiant-valide.component.css']
})

export class EtudiantValideComponent implements OnInit {

  etudiant: Etudiant[];
  error: any;
  headers: string[];

  displayedColumns: string[] = [
    'photo',
    'nom',
    'prenom',
    'promo',
    'specialite',
    'typeValidation',
    'obtenuVia',
    'commentaire',
    'actions'
  ];
  dataSource = new MatTableDataSource<Etudiant>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    this.initStudentByCountry();
    //this.initPieChart('SI3');

    this.tableListService.getEtudiantObs(this.route.snapshot.queryParams).subscribe(rep => {

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
      item.obtenuVia,
      item.typeValidation,
      item.specialite.nomSpecialite];

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

  /**
   *   Number Of Students For Every Country
  */
  initStudentByCountry() {
    const countryPro = this.statistiquesService.getNumberStudents('0').toPromise();
    let tab1: number[];
    let tab2: number[];
    let tab3: number[];
    Promise.all([countryPro]).then((value) => {

      const country1Name = value[0][0].pays;
      const country2Name = value[0][1].pays;
      const country3Name = value[0][2].pays;

      // console.log("country1" + country1);
      // console.log("country2" + country2);
      // console.log("country3" + country3);

      const country1Pro = this.statistiquesService.getNumberStudentsWithCountry(country1Name, '0').toPromise();
      const country2Pro = this.statistiquesService.getNumberStudentsWithCountry(country2Name, '0').toPromise();
      const country3Pro = this.statistiquesService.getNumberStudentsWithCountry(country3Name, '0').toPromise();

      Promise.all([country1Pro, country2Pro, country3Pro]).then((values) => {



        values[0].sort(this.sortByName);
        values[1].sort(this.sortByName);
        values[2].sort(this.sortByName);

        tab1 = this.verificationOnCountryGraph(values[0]);
        tab2 = this.verificationOnCountryGraph(values[1]);
        tab3 = this.verificationOnCountryGraph(values[2]);
        console.log('values ' + values[1][0].nombre);
        console.log('values ' + values[1][1].nombre);
        console.log('values ' + values[1][2].nombre);

        const numberOfStudents = new Chartist.Bar('#numberOfStudents', {
          labels: [country1Name, country2Name, country3Name],
          series: [
            [tab1[0], tab2[0], tab3[0]],
            [tab1[1], tab2[1], tab3[1]],
            [tab1[2], tab2[2], tab3[2]]
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

  sortByName(elementOne: any, elementTwo: any){
    if (elementOne.nom_fr_fr<elementTwo.nom_fr_fr){
      return 0;
    }
    else{
      return 1;
    }
  }

  verificationOnCountryGraph(country: TupleNameNumber[]){
    let tab: number[] = [0,0,0];
    console.log("country length  "+country);
    if (country.length != 3){
      for (let i of country){
        tab[i.annee-2016] = i.nombre
      }
    }else {
      for (let j=0;j<country.length;j++){
        tab[j]=country[j].nombre;
        console.log("country "+j+ " " +country[j].nombre);
      }
    }
    return tab;
  }


  /**
   *   Succeed Graph Init
   */
  initPieChart(promo: string) {
    const promotionPro = this.statistiquesService.getPieChart(promo).toPromise();

    promotionPro.then((value) => {

      const validationDonut = new Chartist.Pie('#ct-chart-pie', {
        series: [value[0].degre, value[1].degre, value[2].degre]
      }, {
        startAngle: 270,
        showLabel: true
      });
    });
  }

  constructor(private tableListService: TableListService,private statistiquesService: StatistiquesService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private router: Router) { }
}
