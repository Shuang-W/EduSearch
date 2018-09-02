import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchResult } from '../Model/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private SERVER_LOCATION = 'http://127.0.0.1:8080/api/';

  constructor(private httpClient: HttpClient) { }

  getFileUploadLocation() {
    return this.SERVER_LOCATION + 'upload_file/';
  }

  uploadFile(uid, name, fd) {
    const url = this.SERVER_LOCATION + 'upload_file/?user_id=' + uid + '&name=' + name;
    return this.httpClient.post(url, fd);
  }


  testRequest(val) {
    const url = this.SERVER_LOCATION + 'test/?search=' + val;

    return this.httpClient.get(url).pipe(map((data) => {
      return data;
    }));
  }

  searchRequest(query: string, type: string) {
    const url = this.SERVER_LOCATION + 'search/?query=' + query + '&type=' + type;

    return this.httpClient.get(url).pipe(map((data) => {
      return data;
    }));
  }

  chartData(user_id: string) {
    const url = this.SERVER_LOCATION + 'chart_data/?user=' + user_id;

    return this.httpClient.get(url).pipe(map((data) => {
      return data;
    }));
  }

  getUserFilenames(user_id: string) {
    const url = this.SERVER_LOCATION + 'filenames/?user_id=' + user_id;

    return this.httpClient.get(url).pipe(map((data) => {
      return data;
    }));
  }

  getFile(user_id: string, filename: string) {
    const url = this.SERVER_LOCATION + 'get_file/?user_id=' + user_id + '&filename=' + filename;

    document.location.href = url;
  }

  deleteUserFilename(user_id: string, filename:string) {
    const url = this.SERVER_LOCATION + 'delete_filename/?user_id=' + user_id + '&filename=' + filename;

    return this.httpClient.get(url).pipe(map((data) => {
      return data;
    }));
  }

  postCrawler(user_id: string, url: string) {
    const post_url = this.SERVER_LOCATION + 'crawl/?url=' + url + '&user_id=' + user_id;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.httpClient.post(post_url, {'user_id': user_id, 'url': url}, {headers: headers});
  }
}
