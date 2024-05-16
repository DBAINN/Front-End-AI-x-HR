import { Injectable } from '@angular/core';
import { HttpClient} from  "@angular/common/http";
import { Observable,map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LogServices {

  constructor(private _http:HttpClient) {}
  addLog(data:any):Observable<any>{
    return this._http.post('http://localhost:3001/log',data);
  }
  updatelogUser(id:string,data:any):Observable<any>{
    return this._http.put(`http://localhost:3001/log/${id}`,data);
  }
  getLogList():Observable<any>{
    return this._http.get('http://localhost:3001/log');
  }
  deleteUsersList(id:string): Observable<any> {
    return this._http.delete(`http://localhost:3001/log/${id}`);
  }
  getLog(): Observable<any[]> {
    return this._http.get<any[]>('http://localhost:3001/log');
  }
  logLogin(Nome: string, Cognome:string, TimeStamp_Login:string, Nome_PDF_POS:string): void {
    // Registra l'accesso dell'utente
    console.log(`L'utente ${Nome} ${Cognome} ha effettuato l'accesso il ${TimeStamp_Login} e il nome del file caricato è ${Nome_PDF_POS}`);
    
    // Invia i log al server
    const logData = {Nome, Cognome, TimeStamp_Login, Nome_PDF_POS}; // Dati da inviare al server
    this._http.post('http://localhost:3001/log', logData).subscribe(
    () => console.log('Log di accesso inviato al server',logData),
    error => console.error('Errore durante l\'invio del log di accesso al server:', error)
  );
  }
  logDocumentation(Nome: string, Cognome:string, TimeStamp_Login:string, Nome_PDF:string,Nome_ZIP:string): void {
    // Registra l'accesso dell'utente
    console.log(`L'utente ${Nome} ${Cognome} ha effettuato l'accesso il ${TimeStamp_Login}`);
    
    // Invia i log al server
    const logData = { Nome, Cognome, TimeStamp_Login, Nome_PDF,Nome_ZIP}; // Dati da inviare al server
    this._http.post('http://localhost:3001/log', logData).subscribe(
    () => console.log('Log di accesso inviato al server',logData),
    error => console.error('Errore durante l\'invio del log di accesso al server:', error)
  );
  }
  getLastLogId(): Observable<string | null> {
    return this._http.get<any[]>('http://localhost:3001/log').pipe(
      map(logs => {
        if (logs && logs.length > 0) {
          const lastLog = logs[logs.length - 1]; // Ottieni l'ultimo log
          return lastLog.id; // Restituisci l'id dell'ultimo log
        } else {
          return null; // Se non ci sono log, restituisci null
        }
      })
    );
  }
  getLastLog(): Observable<string | null> {
    return this._http.get<any[]>('http://localhost:3001/log').pipe(
      map(logs => {
        if (logs && logs.length > 0) {
          const lastLog = logs[logs.length - 1]; // Ottieni l'ultimo log
          return lastLog; // Restituisci l'id dell'ultimo log
        } else {
          return null; // Se non ci sono log, restituisci null
        }
      })
    );
  }
  getLogById(id: string): Observable<any> {
    return this._http.get<any>(`http://localhost:3001/log/${id}`);
  }



  logLogout(userName: string, timeStamp: String): void {
    // Registra il logout dell'utente
    console.log(`Utente ${userName} ha effettuato il logout il ${timeStamp}`);
    
    // Invia i log al server
    // this._http.post('http://localhost:3000/logs', { userName, timeStamp }).subscribe(
    //   () => console.log('Log di logout inviato al server'),
    //   error => console.error('Errore durante l\'invio del log di logout al server:', error)
    // );
  }
}

