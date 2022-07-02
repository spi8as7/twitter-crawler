import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '';

  getUsers() {
    return this.http.get(this.rootURL + '/search');
  }

  addUser(user: any) {
    return this.http.post(this.rootURL + '/search', {
      "keyword": "test",
      "start_time": "2022-06-28T15:00:00z",
      "end_time": "2022-06-29T15:00:00z"
  });
  }

}
