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
import { MatDialogModule} from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';


@Component({
  selector: 'app-documentazione',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MatMenuModule,MatDrawer,MatProgressSpinnerModule,MatStepperModule,MatCard,CommonModule,MatDialogModule],
  templateUrl: './documentazione.component.html',
  styleUrl: './documentazione.component.css'
})
export class DocumentazioneComponent implements OnInit {
  userdata:any;
  errorMessage: string | null = null;
  thirdStepEditable:boolean=false;
  firstStepCompleted: boolean = false;
  fileListZIP: File | undefined;
  submitting:boolean=false;
  @ViewChild('sidenav')sidenav: MatDrawer | undefined;
  @ViewChild(MatStepper) stepper: MatStepper | undefined;
  fileSelected: boolean = false;
  username: string | null = null; // Inizializza la variabile per il nome utente
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  fileList: HTMLElement | null = null;
  numOfFiles: HTMLElement | null = null;
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private _boolean: AuthService,private api:ApiService, private dialogRef:MatDialog){}
  
  ngOnInit(): void {
    this.fileList = document.querySelector<HTMLUListElement>("#files-list");
    this.numOfFiles = document.querySelector<HTMLDivElement>("#num-of-files");
     // Verifica se il codice viene eseguito lato client
     if (isPlatformBrowser(this.platformId)) {
      // Verifica se il nome utente è memorizzato in sessionStorage
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername; // Imposta il nome utente se è presente in sessionStorage
      }
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
    this.fileListZIP=undefined; //imposta fileListZIP come undefined in modo da mantenere disabilitato il button analizza
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
  
  const Nome_ZIP = this.fileListZIP!.name;
  this.userdata = JSON.parse(userDataString);
  if (!this.fileListZIP || !this.fileListZIP.name) {
    console.error('Devi selezionare file ZIP.');
    return;
  }
  this.errorMessage=null;
  // Invia la richiesta POST al backend
this.submitting = true; // Imposta la variabile per visualizzare il caricamento
this.api.uploadFile(this.fileListZIP).subscribe(
  response => {
    this.submitting = false; // Nasconde il caricamento
    this.thirdStepEditable = true;
    if (this.stepper) {
      this.stepper.next();
      this.fileListZIP=undefined; //l'utente deve per forza premere sul tasto home per effettuare una nuova elaborazione
    }

  },
  error => {
    console.error('Errore durante la richiesta al backend:', error);
    // Gestisci l'errore qui...
    this.submitting = false; // Nasconde il caricamento anche in caso di errore
    this.errorMessage=error.message;
  }
);
}

logout(): void {
                  // Effettua la navigazione verso la pagina di login quando viene premuto il pulsante "Logout"
        sessionStorage.clear(); // Svuota le informazioni salvate in session storage
        this.router.navigate(['login']);
              }
isAdmin(): boolean {
  // Implementa la logica per controllare se l'utente ha il ruolo di amministratore
  return this._boolean.isAdmintoken();
}
Closeside():void{
  if (this.sidenav) {
    this.sidenav.close();
}
}
backtostart():void{
  window.location.reload();
}
downloadExcel(): void {
  this.api.downloadExcel();
}

openDialog(){
  this.dialogRef.open(InfoDialogComponent)
}

}
