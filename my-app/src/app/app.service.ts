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
    // convert to 
    // "start_time": "2022-06-28T15:00:00z",
    // "end_time": "2022-06-29T15:00:00z"
    return this.http.post(this.rootURL + '/search',{
      "keyword": user.keyword,
      "start_time": "2022-06-28T15:00:00z",
      "end_time": "2022-06-29T15:00:00z"
  });
  }

  getUser(user_id: string) {
    return this.http.get(this.rootURL + '/search/' + user_id);
  }

}
