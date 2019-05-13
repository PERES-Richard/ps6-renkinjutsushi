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
    this.http.post(this.URL + '/postData/updateStudent', student).subscribe(
      (data: any) => {
        console.log(data);
      }
    );
  }



}
