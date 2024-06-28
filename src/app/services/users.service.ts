import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersServices {

  private apiUrl = 'http://localhost:3000/users';
  private loginUrl = 'http://localhost:3000/login';

  constructor(private _http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  login(email: string, password: string): Observable<any> {
    return this._http.post(this.loginUrl, { email, password });
  }

  addUser(data: any): Observable<any> {
    return this._http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateUser(id: number, data: any): Observable<any> {
    return this._http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  getUsersList(): Observable<any> {
    return this._http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  deleteUsersList(id: string): Observable<any> {
    return this._http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getUsers(): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  logLogin(Nome: string, Cognome: string, timeStamp: string): void {
    // Registra l'accesso dell'utente
    console.log(`L'utente ${Nome} ${Cognome} ha effettuato l'accesso il ${timeStamp}`);
  }

  logLogout(userName: string, timeStamp: Date): void {
    // Registra il logout dell'utente
    console.log(`Utente ${userName} ha effettuato il logout il ${timeStamp}`);
  }
}
