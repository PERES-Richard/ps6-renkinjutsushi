import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSortable } from '@angular/material';
import { TableListService, Etudiant, EtudiantSimp } from './table-list.service';
import { filter } from 'rxjs-compat/operator/filter';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-table-list',
  providers: [TableListService],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})


export class TableListComponent implements OnInit {

  etudiant: Etudiant[];
  error: any;
  headers: string[];

  displayedColumns: string[] = [
    'nom',
    'prenom',
    'promo',
    'specialite',
    'etat',
    'semestresRestants',
    'pays',
    'dateDebut',
    'dateFin',
    'commentaire',
    'annee'
  ];
  dataSource = new MatTableDataSource<Etudiant>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.tableListService.getEtudiantObs(this.route.snapshot.queryParams).subscribe(rep => {

      const etuS: EtudiantSimp[] = rep;
      // console.log(etuS);
      // etuS.forEach(etuST => {
      //   if (etuST.commentaire === null) {
      //     etuST.commentaire = '';
      //   }
      // })
      this.etudiant = []

      this.tableListService.getSpecialiteObs().subscribe(spe => {

        this.tableListService.getPaysObs().subscribe(pays => {

          this.tableListService.getEtatObs().subscribe(etat => {
            etuS.forEach(etu => {

              const etudiant: Etudiant = {
                idEtudiant: etu.idEtudiant,
                nom: etu.nom,
                prenom: etu.prenom,
                promo: etu.promo,
                specialite: spe.find(function (element) {
                  return element.idSpecialite === etu.specialite;
                }),
                commentaire: etu.commentaire,
                etat: etat.find(function (element) {
                  return element.idEtat === etu.etat;
                }),
                semestresRestants: etu.semestresRestants,
                dateDebut: etu.dateDebut === null ? null : new Date(etu.dateDebut.toString()),
                dateFin: etu.dateFin === null ? null : new Date(etu.dateFin.toString()),
                pays: pays.find(function (element) {
                  return element.idPays === etu.pays;
                }),
                obtenuVia: etu.obtenuVia,
                annee: etu.annee
              }

              if (etudiant.pays === undefined) {
                etudiant.pays = {
                  idPays: null,
                  nomPays: null
                };
              }
              console.log(etudiant);
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
      });

    });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (item, filtre) => {
      const str: string[] = [item.nom,
      item.prenom,
      item.commentaire,
      item.promo,
      item.semestresRestants.toString(),
      item.obtenuVia,
      item.specialite.nomSpecialite,
      item.etat.nomEtat,
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

  constructor(private tableListService: TableListService, private route: ActivatedRoute) { }

}
