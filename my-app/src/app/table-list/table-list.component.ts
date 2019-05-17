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


@Component({
  selector: 'app-table-list',
  providers: [TableListService],
  templateUrl: './table-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./table-list.component.css']
})

export class TableListComponent implements OnInit {

  etudiant: Etudiant[];
  error: any;
  headers: string[];
  file: File;
  text: string;
  bol: boolean;

  displayedColumns: string[] = [
    'photo',
    'nom',
    'prenom',
    'promo',
    'specialite',
    'etat',
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

  ngOnInit() {

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
      item.semainesRestantes.toString(),
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

  edit(etu: Etudiant) {
    this.router.navigate(['user-profile', { idEtudiant: etu.idEtudiant }]);
  }

  constructor(private tableListService: TableListService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private router: Router) { }


  fileChange(file) {
    this.file = file.target.files[0];
    if(this.file.name.substr(-4) != ".csv"){
      document.getElementById("para").innerHTML = "Le fichier "+this.file.name+" n'est pas un fichier .csv";
    }
    else{
      this.verifyCSV()
      if(this.bol){
        document.getElementById("para").innerHTML = this.file.name+" est valide";
      }
      else{
        document.getElementById("para").innerHTML = this.file.name+" est invalide";
      }
    }
  }

   verifyCSV(){
    var reader = new FileReader();
    reader.onload = (event: Event) => {
      let text = reader.result as string;
      var allTextLines = text.split(/\r\n|\n/);
      for(var i = 0; i<allTextLines.length; i++){
        let entries = allTextLines[i].split(',');
        if(typeof(entries[0])!= "string" || typeof(entries[1])!= "string" || typeof(entries[2])!= "string" || typeof(entries[3])!= "number" || typeof(entries[4])!= "string" || typeof(entries[5])!= "number" || typeof(entries[6])!= "number" || typeof(entries[7])!= "number" || typeof(entries[8])!= "string" || typeof(entries[9])!= "number" || typeof(entries[10])!= "number"){
          this.bol = false;
          return
        }
      }
      this.bol = true;
      return;
    };
    reader.readAsText(this.file);
  }
}
