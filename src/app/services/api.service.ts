import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(code) {
    return this.http.get(`https://www.instagram.com/p/${code}/?__a=1`)
  }

  downloadimage(imagePath, filename) {
    return this.http
      .get(
        imagePath,
        {
          responseType: "blob"
        }
      )
      .pipe(
        map(res => {
          return {
            filename: filename,
            data: res
          };
        })
      );
  }


}
