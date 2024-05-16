import { Component,Inject, OnInit, PLATFORM_ID,ViewChild,ElementRef,OnDestroy,HostListener} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth_service';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { MatCard } from '@angular/material/card';
import { ApiService } from '../users-admin/API/api.service';
import { CommonModule } from '@angular/common';
import { LogServices } from '../services/log.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-documentazione',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MatMenuModule,MatDrawer,MatProgressSpinnerModule,MatStepperModule,MatCard,CommonModule],
  templateUrl: './documentazione.component.html',
  styleUrl: './documentazione.component.css'
})
export class DocumentazioneComponent implements OnInit {
  userdata:any;
  thirdStepEditable:boolean=false;
  firstStepCompleted: boolean = false;
  fileListPDF: File | undefined;
  fileListZIP: File | undefined;
  submitting:boolean=false;
  @ViewChild('sidenav')sidenav: MatDrawer | undefined;
  @ViewChild(MatStepper) stepper: MatStepper | undefined;
  fileSelected: boolean = false;
  username: string | null = null; // Inizializza la variabile per il nome utente
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  fileList: HTMLElement | null = null;
  numOfFiles: HTMLElement | null = null;
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private _boolean: AuthService,private api:ApiService,private _log:LogServices){}
  ngOnInit(): void {
    this.fileList = document.querySelector<HTMLUListElement>("#files-list");
    this.numOfFiles = document.querySelector<HTMLDivElement>("#num-of-files");
     // Verifica se il codice viene eseguito lato client
     if (isPlatformBrowser(this.platformId)) {
      // Registra il gestore per l'evento beforeunload solo se siamo lato client
      // window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
      // Verifica se il nome utente è memorizzato in sessionStorage
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername; // Imposta il nome utente se è presente in sessionStorage
      }
    
  }
}
onFileSelected(event: any): void {
  const files = event.target.files;

  // Verifica se sono stati selezionati più di un file
  if (files.length > 1) {
    alert('Puoi selezionare solo un file.');
    return;
  }

  const file = files[0];

  // Verifica se è stato selezionato un file
  if (!file) return;

  console.log(file);

  // Ottieni il riferimento agli elementi HTML
  this.fileListPDF = file;
  this.fileList = document.querySelector<HTMLUListElement>("#files-list-doc");
  this.numOfFiles = document.querySelector<HTMLDivElement>("#num-of-files");

  // Verifica se gli elementi sono stati trovati prima di procedere
  if (!this.fileList || !this.numOfFiles) return;

  // Pulisci la lista dei file e aggiorna il numero di file selezionati
  this.fileList.innerHTML = "";

  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  // Verifica se il file ha un'estensione e se è un file PDF
  if (fileExtension === 'pdf') {
    // Crea un elemento <li> per il file e aggiungilo alla lista
    const listItem = document.createElement("li");
    listItem.textContent = file.name;
    listItem.style.fontWeight = '500';
    listItem.style.color = '#151516';
    listItem.style.backgroundColor = '#eff5ff';
    listItem.style.borderRadius = '0.3em';
    listItem.style.alignContent = 'center';
    listItem.style.textAlign = 'center';
    listItem.style.height = '35px';
    listItem.style.width = '92%';

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-check";
    icon.style.marginLeft = "15px";
    icon.style.color = "#1de32c73";
    listItem.appendChild(icon);
    this.fileList.appendChild(listItem);
    
    // Imposta firstStepCompleted a true poiché è stato selezionato un file PDF
    this.firstStepCompleted = true;

    // Aggiorna il numero di file selezionati nella lista
    this.numOfFiles.textContent = `1 File Selezionato`;
  } else {
    // Se il file non è nel formato PDF, mostra un avviso e non aggiungerlo alla lista
    alert(`Il file "${file.name}" non è nel formato PDF e verrà ignorato.`);
  }
}

onZIPSelected(event: any): void {
  const files = event.target.files;

  // Verifica se sono stati selezionati più di un file
  if (files.length > 1) {
    alert('Puoi selezionare solo un file.');
    return;
  }

  const file = files[0];

  // Verifica se è stato selezionato un file
  if (!file) return;

  console.log(file);
  // Rimuovi gli spazi dal nome del file
  const fileNameWithoutSpaces = file.name.replace(/\s/g, '_');
  console.log(fileNameWithoutSpaces)
  // Ottieni il riferimento agli elementi HTML
  this.fileListZIP = file;
  this.fileList = document.querySelector<HTMLUListElement>("#files-list-zip");
  this.numOfFiles = document.querySelector<HTMLDivElement>("#num-of-files-zip");

  // Verifica se gli elementi sono stati trovati prima di procedere
  if (!this.fileList || !this.numOfFiles) return;

  // Pulisci la lista dei file e aggiorna il numero di file selezionati
  this.fileList.innerHTML = "";

  const fileExtension = fileNameWithoutSpaces.split('.').pop()?.toLowerCase();

  // Verifica se il file ha un'estensione e se è un file ZIP
  if (fileExtension === 'zip') {
    // Crea un elemento <li> per il file e aggiungilo alla lista
    const listItem = document.createElement("li");
    listItem.textContent = file.name;
    listItem.style.fontWeight = '500';
    listItem.style.color = '#151516';
    listItem.style.backgroundColor = '#eff5ff';
    listItem.style.borderRadius = '0.3em';
    listItem.style.alignContent = 'center';
    listItem.style.textAlign = 'center';
    listItem.style.height = '35px';
    listItem.style.width = '92%';

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-check";
    icon.style.marginLeft = "15px";
    icon.style.color = "#1de32c73";
    listItem.appendChild(icon);
    this.fileList.appendChild(listItem);
    
    // Aggiorna il numero di file selezionati nella lista
    this.numOfFiles.textContent = `1 File Selezionato`;
  } else {
    // Se il file non è nel formato ZIP, mostra un avviso e non aggiungerlo alla lista
    alert(`Il file "${file.name}" non è nel formato ZIP e verrà ignorato.`);
  }
}

onSubmit(event: Event): void {
  event.preventDefault();
  // Ottieni i dati dell'utente dal sessionStorage
  const userDataString = sessionStorage.getItem('userData');
  if (!userDataString) {
    console.error('Dati dell\'utente non trovati nel sessionStorage.');
    return;
  }
  const Nome_PDF = this.fileListPDF!.name;
  const Nome_ZIP = this.fileListZIP!.name;
  this.userdata = JSON.parse(userDataString);
  if (!this.fileListPDF || !this.fileListZIP || !this.fileListPDF.name || !this.fileListZIP.name) {
    console.error('Devi selezionare sia un file PDF che un file ZIP.');
    return;
  }

  // Invia la richiesta POST al backend
  this.submitting = true; // Imposta la variabile per visualizzare il caricamento
  this.api.uploadFolder(this.fileListPDF, this.fileListZIP).subscribe(
    response => {
      sessionStorage.setItem('filepath',response.file_path);
      const TimeStamp_Login = new Date().toLocaleString('it-IT', { hour12: false }); // Ottieni il timestamp corrente
        sessionStorage.setItem('TimeStamp_Login', TimeStamp_Login);
      this._log.logDocumentation(this.userdata.Nome, this.userdata.Cognome, TimeStamp_Login,Nome_PDF,Nome_ZIP);
      console.log('Risposta dal backend:', response);
      this._log.getLastLogId().subscribe(lastId => {
        if (lastId !== null) {
          // Utilizza l'ID appena ottenuto
          console.log('Ultimo ID creato:', lastId);
          sessionStorage.setItem('lastId', lastId);
          
        } else {
          console.log('Nessun ID disponibile.');
          // Gestisci il caso in cui non ci sia nessun ID disponibile
        }
        
      });      
      // Gestisci la risposta dal backend qui...
      this.submitting = false; // Nasconde il caricamento
      this.thirdStepEditable=true;
      if (this.stepper) {
        this.stepper.next();
      }
    },
    error => {
      console.error('Errore durante la richiesta al backend:', error);
      // Gestisci l'errore qui...
      this.submitting = false; // Nasconde il caricamento anche in caso di errore
    }
  );
}
// @HostListener('window:beforeunload', ['$event'])
//   beforeUnloadHandler() {
//     // Esegui le operazioni di logout o salvataggio prima che l'utente lasci il sito
//     this.performLogout();
//   }

//   performLogout() {
//     // Esegui le operazioni di logout qui, ad esempio chiamando un servizio
//     console.log('Eseguito logout prima della chiusura della finestra del browser');
//     // Assicurati di completare tutte le operazioni necessarie prima di ritornare
//     // Nota: non è possibile effettuare operazioni asincrone qui
//   }


logout(): void {
                  // Effettua la navigazione verso la pagina di login quando viene premuto il pulsante "Logout"
        sessionStorage.clear(); // Svuota le informazioni salvate in session storage
        this.router.navigate(['login']);
              }
// private onBeforeUnload(event: BeforeUnloadEvent): void {
//   // Verifica se l'evento di logout è già stato gestito
//   if (!this.logoutTimestamp) {
//     // Salva il timestamp del logout
//     this.logoutTimestamp = Date.now();

//     // Effettua la registrazione del logout sul server
//     const formattedTimestamp = new Date(this.logoutTimestamp).toLocaleString();
//     console.log('Timestamp del logout (beforeunload):', formattedTimestamp);
    
//     // Recupera l'ID memorizzato nel session storage
//     const lastId = sessionStorage.getItem('lastId');
//     if (lastId !== null) {
//       // Recupera tutti i dati relativi all'utente
//       this._log.getLogById(lastId).subscribe(user => {
//         if (user !== null) {
//           // Aggiorna tutti i dati dell'utente
//           user.TimeStamp_Logout = formattedTimestamp;
//           // Effettua la chiamata per aggiornare i dati dell'utente sul server
//           this._log.updatelogUser(lastId, user).pipe(
//             tap(() => console.log('Dati dell\'utente aggiornati sul server'))
//           ).subscribe(() => {});
//         }
//       });
//     } else {
//       console.log('Nessun ID disponibile.');
//       sessionStorage.clear();
//       this.router.navigate(['login']);
//       // Gestisci il caso in cui non ci sia nessun ID disponibile
//     }
//   }
// @HostListener('window:beforeunload', ['$event'])
// async onBeforeUnload(event: BeforeUnloadEvent): Promise<void> {
//   // Evita che la finestra di dialogo di conferma predefinita venga mostrata
//   event.preventDefault();
  
  
//   // Effettua il logout e attendi che l'operazione sia completata prima di consentire alla finestra di chiudersi
//   await this.logoutAndCloseWindow();
  
// }

isAdmin(): boolean {
  // Implementa la logica per controllare se l'utente ha il ruolo di amministratore
  return this._boolean.isAdmintoken();
}
Closeside():void{
  if (this.sidenav) {
    this.sidenav.close();
}
}
returnhome():void{
  this.router.navigate(['welcome-page']);
}
downloadZIP(): void {
  if (!this.fileListZIP) {
    console.error('File non definito.');
    return;
  }
  
  let filename = sessionStorage.getItem('filepath');
  // Verifica se il nome del file è null
  if (filename === null) {
    console.error('Il nome del file è null.');
    return;
  }
  // Rimuovi gli spazi dal nome del file per il download
  const fileNameWithoutSpaces = filename.replace(/\s/g, '_');

  this.api.downloadZipFile(fileNameWithoutSpaces).subscribe(
    (blob: Blob) => {
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = fileNameWithoutSpaces;
      downloadLink.click();
    },
    error => {
      console.error('Errore durante il download del file:', error);
      // Gestisci eventuali errori qui
    }
  );
}
backtostart():void{
  window.location.reload();
}
nextStep(): void {
  // Verifica se il passo corrente è completato
  const currentStepCompleted = this.firstStepCompleted

  // Verifica se il passo corrente è completato prima di passare al passo successivo
  if (currentStepCompleted) {
    // Passa al passo successivo
    this.stepper?.next();
  } else {
    console.log('Il passo corrente non è completato.');
    // Aggiungi qui la logica per gestire il passo non completato
  }
}
}
