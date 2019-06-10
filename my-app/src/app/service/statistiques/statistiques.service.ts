import { Etudiant } from '../../models/Etudiant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Degre } from '../../models/Degre';
import { TupleNameNumber } from '../../models/TupleNameNumber';

@Injectable(
  // {providedIn: 'root'}
)

export class StatistiquesService {

  etudiantURL = 'http://localhost:3000/getData';

  etudiant: Etudiant[];

  constructor(private http: HttpClient) {
  }

  getNumberStudents(etat: string, promo: string, specialite: string) {
  console.log(promo);
  console.log(specialite);
    const rep = this.http.get<TupleNameNumber[]>(this.etudiantURL + '/numberstudents/' + etat + "&" + promo + "&" + specialite);
    return rep;
  }

  getNumberStudentsWithCountry(country: string, etat: string,promo: string,specialite: string) {
    const rep = this.http.get<TupleNameNumber[]>(this.etudiantURL + '/numberstudentswithcountry/' + country + '&' + etat + "&" + promo + "&" + specialite);
    return rep;
  }

  getPieChart(promotion: string) {
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/piechart/' + promotion);
    return rep;
  }

  getPieChartNonValide() {
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/piechartnonValide/');
    return rep;
  }

  getNumberSucceed(annee: string) {
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/numbersucceed/' + annee);
    return rep;
  }

  getNumberSucceedCountry(pays: string) {
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/numbersucceedcountry/' + pays);
    return rep;
  }



}
