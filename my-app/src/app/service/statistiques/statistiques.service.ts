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

  getEnCours() {
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/piechartencours');
    return rep;
  }

  getNonValide() {
    const rep = this.http.get<Degre[]>(this.etudiantURL + '/piechartnonvalide');
    return rep;
  }

  getStudentsJapon2016() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentsjapon2016');
    return rep;
  }

  getStudentsJapon2017() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentsjapon2017');
    return rep;
  }

  getStudentsJapon2018() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentsjapon2018');
    return rep;
  }

  getStudentsCanada2016() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentscanada2016');
    return rep;
  }

  getStudentsCanada2017() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentscanada2017');
    return rep;
  }

  getStudentsCanada2018() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentscanada2018');
    return rep;
  }

  getStudentsColombie2016() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentscolombie2016');
    return rep;
  }

  getStudentsColombie2017() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentscolombie2017');
    return rep;
  }

  getStudentsColombie2018() {
    const rep = this.http.get<Number[]>(this.etudiantURL + '/numberstudentscolombie2018');
    return rep;
  }

}
