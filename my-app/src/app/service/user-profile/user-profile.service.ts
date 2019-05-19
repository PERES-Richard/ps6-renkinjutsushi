import {Etudiant} from '../../models/Etudiant';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Degre} from '../../models/Degre';

@Injectable(
  // {providedIn: 'root'}
)

export class UserProfileService {

  URL = 'http://localhost:3000';

  etudiant: Etudiant[];

  constructor(private http: HttpClient) {
  }

  postStudent(student: Etudiant) {

    this.http.post<Etudiant>(this.URL + '/postData/updateStudent', student).subscribe(
      (data: any) => {
        //
      }
    );
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
