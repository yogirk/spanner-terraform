import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service'

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  API_URL: string =  environment.baseUrl;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private tokenStorage: TokenStorageService, private httpClient: HttpClient) {
  }

  postData(func, params): Observable<any> {
    return this.httpClient.post(`${this.API_URL + func}`, params, { headers: this.httpHeaders }).pipe(catchError(this.handleError));
  }

  getData(func) {
    return this.httpClient.get(`${this.API_URL + func}`, { headers: this.httpHeaders }).pipe(catchError(this.handleError));
  }

  authGetData(func) {
    return this.httpClient.get(`${this.API_URL + func}`, { headers: this.authHttpHeaders() }).pipe(catchError(this.handleError));
  }

  authPostData(func, params): Observable<any> {
    return this.httpClient.post(`${this.API_URL + func}`, params, { headers: this.authHttpHeaders() }).pipe(catchError(this.handleError));
  }

  authPutData(func, params): Observable<any> {
    return this.httpClient.put(`${this.API_URL + func}`, params, { headers: this.authHttpHeaders() }).pipe(catchError(this.handleError));
  }

  authDeleteData(param): Observable<any> {
    let API_URL = `${this.API_URL + param}`;
    return this.httpClient.delete(API_URL, { headers: this.authHttpHeaders() })
      .pipe(catchError(this.handleError));
  }

  authHttpHeaders() {
    return new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.getToken(this.tokenStorage.getToken()) });
  }

  getSessionUser() {
    let user = JSON.parse(localStorage.getItem('userInfo'))
    return user;
  }

  getToken(token) {
    if (token == null)
      token = localStorage.getItem('authToken')
    return token
  }

  logOut() {
    localStorage.removeItem('userInfo');
    return true;
  }

  handleError(error: HttpErrorResponse) {
    console.log(error)
    if (error.status == 401 && error.statusText == 'Unauthorized') {
      localStorage.removeItem('authToken');
      localStorage.clear();
    }
    return throwError(error);
  }
}
