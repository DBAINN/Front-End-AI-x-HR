import { Component,OnInit,ViewChild,Inject, PLATFORM_ID  } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth_service';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { LogServices } from '../services/log.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [MatDividerModule,MatProgressSpinnerModule,MatSidenavContainer,MatToolbarModule,MatIconModule,MatButtonModule,MatDrawer,MatSidenavModule,MatListModule,MatMenuModule,CommonModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent implements OnInit{
  userdata:any;
  submitting:boolean=false;
  @ViewChild('sidenav')sidenav: MatDrawer | undefined;
  logoutTimestamp: number | null = null; // Inizializza la variabile per il timestamp del logout
  username: string | null = null; // Inizializza la variabile per il nome utente
  constructor(private router:Router,private _boolean: AuthService,@Inject(PLATFORM_ID) private platformId: Object,private _log:LogServices){}
  ngOnInit(): void {
    // Verifica se il codice viene eseguito lato client
    if (isPlatformBrowser(this.platformId)) {      
      // Verifica se il nome utente è memorizzato in sessionStorage
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername; // Imposta il nome utente se è presente in sessionStorage
      }
    }
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

  isAdmin(): boolean {
    // Implementa la logica per controllare se l'utente ha il ruolo di amministratore
    return this._boolean.isAdmintoken();
  }
  GotoChecklistPOS():void{
    this.router.navigate(['page-toolbar']);
  }
  onDocumentation():void{
    this.router.navigate(['documentazione']);
  }
  gotoLog():void{
    this.router.navigate(['log']);
  }
}


