import { Component,OnInit, PLATFORM_ID,ViewChild,Inject,HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth_service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; // Importa MatInputModule
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../data.service';
import { PdfService } from '../pdf.service';
import { ApiService } from '../users-admin/API/api.service';
import { tap } from 'rxjs';
import { LogServices } from '../services/log.service';








@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MatMenuModule, CommonModule, MatFormFieldModule, MatCard, MatInputModule, MatDividerModule,FormsModule,ReactiveFormsModule,MatTableModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  responseData: any | null = null;
  displayedColumns: string[] = ['Data','Comune','Latitudine','Longitudine','Foglio', 'Particella'];
   // Dati di esempio da visualizzare nella tabella
   dataSource: any[]=[];
  @ViewChild('sidenav')sidenav: MatDrawer | undefined;
  logoutTimestamp: number | null = null; // Inizializza la variabile per il timestamp del logout
  username: string | null = null; // Inizializza la variabile per il nome utente
  success_response: boolean=false;
  constructor( @Inject(PLATFORM_ID) private platformId: Object,private _boolean: AuthService,private router: Router, private dataService:DataService, public response:PdfService,private api:ApiService,private _log:LogServices){}
  ngOnInit() {
    this.dataService.responseData$.subscribe((data) => {
      this.responseData =  data;}
    );
    // Verifica se il codice viene eseguito lato client
    if (isPlatformBrowser(this.platformId)) {
      // Registra il gestore per l'evento beforeunload solo se siamo lato client
      window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
      // Verifica se il nome utente è memorizzato in sessionStorage
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername; // Imposta il nome utente se è presente in sessionStorage
      }
    }
  }
  get boolean_res(): boolean {
    return this.response.getSuccessRequest();
  }
  updateTableData(response: any): void {
    // Aggiorna la sorgente dati della tabella con i dati ricevuti dal backend
    this.dataSource = [response]; // Se il backend restituisce un singolo oggetto, altrimenti sostituisci con response.data se restituisce un array di oggetti
}
  Closeside():void{
    if (this.sidenav) {
      this.sidenav.close();
  }
}
logout(): void {
  // Salva il timestamp del logout
  this.logoutTimestamp = Date.now();
 
  // Visualizza il timestamp del logout nella console
  const formattedTimestamp = new Date(this.logoutTimestamp).toLocaleString();
  console.log('Timestamp del logout:', formattedTimestamp);
  
  // Recupera l'ID memorizzato nel session storage
  const lastId = sessionStorage.getItem('lastId');
  if (lastId !== null) {
      // Recupera tutti i dati relativi all'utente
      this._log.getLogById(lastId).subscribe(user => {
          if (user !== null) {
              // Aggiorna solo il campo TimeStamp_Logout
              user.TimeStamp_Logout = formattedTimestamp;
              
              // Effettua la chiamata per aggiornare i dati dell'utente sul server
              this._log.updatelogUser(lastId, user).pipe(
                  tap(() => console.log('Timestamp di logout aggiornato sul server'))
              ).subscribe(() => {
                  // Effettua la navigazione verso la pagina di login quando viene premuto il pulsante "Logout"
                  sessionStorage.clear(); // Svuota le informazioni salvate in session storage
                  this.router.navigate(['login']);
              });
          } else {
              console.log('Nessun utente trovato con l\'ID:', lastId);
              this.router.navigate(['login']);
          }
      });
  } else {
      console.log('Nessun ID disponibile.');
      sessionStorage.clear();
      this.router.navigate(['login']);
      // Gestisci il caso in cui non ci sia nessun ID disponibile
  }
}

@HostListener('window:beforeunload', ['$event'])
async onBeforeUnload(event: BeforeUnloadEvent): Promise<void> {
  // Evita che la finestra di dialogo di conferma predefinita venga mostrata
  event.preventDefault();

  // Effettua il logout e attendi che l'operazione sia completata prima di consentire alla finestra di chiudersi
  await this.logoutAndCloseWindow();
  
}

async logoutAndCloseWindow(): Promise<void> {
  // Effettua il logout e attendi che l'operazione sia completata
  await this.logout_async();

  // Consente alla finestra di chiudersi
  window.close();
}
async logout_async():Promise<void>{
// Salva il timestamp del logout
this.logoutTimestamp = Date.now();
 
// Visualizza il timestamp del logout nella console
const formattedTimestamp = new Date(this.logoutTimestamp).toLocaleString();
console.log('Timestamp del logout:', formattedTimestamp);

// Recupera l'ID memorizzato nel session storage
const lastId = sessionStorage.getItem('lastId');
if (lastId !== null) {
    // Recupera tutti i dati relativi all'utente
    this._log.getLogById(lastId).subscribe(user => {
        if (user !== null) {
            // Aggiorna solo il campo TimeStamp_Logout
            user.TimeStamp_Logout = formattedTimestamp;              
            // Effettua la chiamata per aggiornare i dati dell'utente sul server
            this._log.updatelogUser(lastId, user).pipe(
                tap(() => console.log('Timestamp di logout aggiornato sul server'))
            ).subscribe(() => {
            });
        } else {
            console.log('Nessun utente trovato con l\'ID:', lastId);
            
        }
    });
} else {
    console.log('Nessun ID disponibile.');
    // Gestisci il caso in cui non ci sia nessun ID disponibile
}
}
isAdmin(): boolean {
  // Implementa la logica per controllare se l'utente ha il ruolo di amministratore
  return this._boolean.isAdmintoken();
}
returnhome():void{
  this.router.navigate(['welcome-page']);
}
onClickDownload(): void {
  this.api.downloadAnswers();
}
onBack():void{
  this.router.navigate(['page-toolbar']);
}

}
