import {Etudiant} from '../../models/Etudiant';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Degre} from '../../models/Degre';
import {EtudiantSimp} from "../../models/EtudiantSimp";
import {SafeUrl} from "@angular/platform-browser";
import {Specialite} from "../../models/Specialite";
import {Etat} from "../../models/Etat";
import {Pays} from "../../models/Pays";

@Injectable(
  // {providedIn: 'root'}
)

export class UserProfileService {

  URL = 'http://localhost:3000';


  constructor(private http: HttpClient) {
  }

  postStudent(student: Etudiant) {

    const rep =this.http.post<Etudiant>(this.URL + '/postData/updateStudent', student);
    return rep;
  }


  getIdCountry(countryName: string) {
    const rep=this.http.get<number>(this.URL+'/getData/getidcountry/'+countryName);
    return rep;
  }

  getIdSpeciality(speName: string) {
    const rep=this.http.get<number>(this.URL+'/getData/getidspeciality/'+speName);
    return rep;
  }

  getIdEtat(etatName: string) {
    const rep=this.http.get<number>(this.URL+'/getData/getidetat/'+etatName);
    return rep;
  }



}
