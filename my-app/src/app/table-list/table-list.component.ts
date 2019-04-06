import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSortable } from '@angular/material';
import { TableListService, Etudiant, EtudiantSimp } from './table-list.service';


@Component({
  selector: 'app-table-list',
  providers: [TableListService],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})

// app.controller('registrosController', function($scope, $http) {
//   $http.get('/getData').then(function(data) {
//       $scope.registros = data;
//   });
// });


export class TableListComponent implements OnInit {

  etudiant: Etudiant[];
  error: any;
  headers: string[];

  displayedColumns: string[] = ['nom', 'prenom', 'promo', 'specialite', 'etat', 'pays', 'semestresRestants', 'commentaire', 'annee'];
  dataSource = new MatTableDataSource<Etudiant>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.tableListService.getEtudiantObs().subscribe(rep => {

      const etuS: EtudiantSimp[] = rep;
      this.etudiant = []

      this.tableListService.getSpecialiteObs().subscribe(spe => {

        this.tableListService.getPaysObs().subscribe(pays => {

          this.tableListService.getEtatObs().subscribe(etat => {
            etuS.forEach(etu => {

              const etudiant: Etudiant = {
                idEtudiant: etu.idEtudiant,
                nom: etu.nom,
                prenom: etu.prenom,
                filiere: etu.filiere,
                specialite: spe.find(function (element) {
                  return element.idSpecialite === etu.specialite;
                }),
                commentaire: etu.commentaire,
                etat: etat.find(function (element) {
                  return element.idEtat === etu.etat;
                }),
                semestresRestants: etu.semestresRestants,
                dateDebut: etu.dateDebut,
                dateFin: etu.dateFin,
                pays: pays.find(function (element) {
                  return element.idPays === etu.pays;
                }),
                obtenuVia: etu.obtenuVia
              }

              if (etudiant.pays === undefined) {
                etudiant.pays = {
                  idPays: null,
                  nomPays: null
                };
              }
              // console.log(etudiant);
              this.etudiant.push(etudiant);
            });

            this.dataSource = new MatTableDataSource<Etudiant>(this.etudiant);
            // this.dataSource = this.etudiant
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (data, header) => data[header];

            this.dataSource.sortingDataAccessor = (item, property) => {

              console.log(item, property);
              // return new Date(item.date);

              switch (property) {

                case 'specialite': {
                  console.log(property);
                  return item.specialite.nomSpecialite;
                }

                case 'etat': {
                  console.log(property);
                  return item.etat.nomEtat;
                }

                case 'pays': {
                  console.log(property);
                  return item.pays.nomPays;
                }

                default: {
                  return item[property];
                }
              }
            };

            this.dataSource.paginator = this.paginator;
          })
        });
      });

    });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private tableListService: TableListService) {
    //   this.tableListService.getEtudiant()
    //     .subscribe(resp => {
    //       const keys = resp.headers.keys();
    //       this.headers = keys.map(key =>
    //         `${key}: ${resp.headers.get(key)}`);

    //       this.etudiant = [ ... resp.body ];
    //       console.log(this.etudiant)

    //       this.dataSource = new MatTableDataSource<Etudiant>(this.etudiant);
    //       // this.dataSource = this.etudiant
    //     });
  }

}
