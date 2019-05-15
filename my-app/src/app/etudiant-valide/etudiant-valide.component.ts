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

    Promise.all([countryPro]).then((value) => {

      const country1 = value[0][0].pays;
      const country2 = value[0][1].pays;
      const country3 = value[0][2].pays;

      // console.log("country1" + country1);
      // console.log("country2" + country2);
      // console.log("country3" + country3);

      const country11Pro = this.statistiquesService.getNumberStudentsWithCountry(country1,'0').toPromise();
      const country22Pro = this.statistiquesService.getNumberStudentsWithCountry(country2,'0').toPromise();
      const country33Pro = this.statistiquesService.getNumberStudentsWithCountry(country3,'0').toPromise();

      Promise.all([country11Pro, country22Pro, country33Pro]).then((values) => {

        console.log("values "+values[2]);

        values[0].sort(this.sortByName);
        values[1].sort(this.sortByName);
        values[2].sort(this.sortByName);


        const country11 = [values[0][0],values[0][1],values[0][2]];
        const country22 = [values[1][0],values[1][1],values[1][2]];
        const country33 = [values[2][0],values[2][1],values[2][2]];

        console.log("values",country11[0], country11[1], country11[2]);
        console.log("values",country22[0]);
        console.log("values",country33[0]);

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
            labelInterpolationFnc: function (value) {
              return value
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
