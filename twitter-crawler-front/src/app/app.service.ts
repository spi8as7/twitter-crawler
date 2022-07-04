import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '';

  getSearches() {
    return this.http.get(this.rootURL + '/search');
  }

  addSearch(search: any) {
    // convert to format ?
    return this.http.post(this.rootURL + '/search',{
      "keyword": search.keyword,
      "start_time": search.start_time,
      "end_time": search.end_time
  });
  }

  getSearch(search_id: string) {
    return this.http.get(this.rootURL + '/search/' + search_id);
  }

}
