import { Injectable } from '@angular/core';
import { HttpClient} from  "@angular/common/http";
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsersServices {

  constructor(private _http:HttpClient) {}
  addUser(data:any):Observable<any>{
    return this._http.post('http://localhost:3000/users',data);
  }
  updateUser(id:number,data:any):Observable<any>{
    return this._http.put(`http://localhost:3000/users/${id}`,data);
  }
  getUsersList():Observable<any>{
    return this._http.get('http://localhost:3000/users');
  }
  deleteUsersList(id:string): Observable<any> {
    return this._http.delete(`http://localhost:3000/users/${id}`);
  }
  getUsers(): Observable<any[]> {
    return this._http.get<any[]>('http://localhost:3000/users');
  }
  logLogin(Nome: string, Cognome:string, timeStamp:string): void {
    // Registra l'accesso dell'utente
    console.log(`L'utente ${Nome} ${Cognome} ha effettuato l'accesso il ${timeStamp}`);
    
    // Invia i log al server
    // this._http.post('http://localhost:3000/logs', { userName, timeStamp }).subscribe(
    //   () => console.log('Log di accesso inviato al server'),
    //   error => console.error('Errore durante l\'invio del log di accesso al server:', error)
    // );
  }

  logLogout(userName: string, timeStamp: Date): void {
    // Registra il logout dell'utente
    console.log(`Utente ${userName} ha effettuato il logout il ${timeStamp}`);
    
    // Invia i log al server
    // this._http.post('http://localhost:3000/logs', { userName, timeStamp }).subscribe(
    //   () => console.log('Log di logout inviato al server'),
    //   error => console.error('Errore durante l\'invio del log di logout al server:', error)
    // );
  }
}

