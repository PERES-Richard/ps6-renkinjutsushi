import {Etudiant} from "../../models/Etudiant";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Degre} from "../../models/Degre";

@Injectable(
  // {providedIn: 'root'}
)

export class StatistiquesService {

  etudiantURL = 'http://localhost:3000/getData';

  etudiant: Etudiant[];

  constructor(private http: HttpClient) {
  }

  getNumberStudents() {
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/numbersucceed');
    return rep;
  }

  getPieChart(promotion: string){
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/piechart/' + promotion);
    return rep;
  }

  getNumberSucceed(annee: string){
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/numbersucceed/' + annee);
    return rep;
  }

}
