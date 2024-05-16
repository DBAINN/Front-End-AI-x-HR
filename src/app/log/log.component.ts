import { Component, OnInit,ViewChild,PLATFORM_ID,Inject,ElementRef } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormField } from '@angular/material/form-field';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogUserWindowComponent } from '../dialog-user-window/dialog-user-window.component';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth_service';
import { MatDrawer } from '@angular/material/sidenav';
import { LogServices } from '../services/log.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter,MatNativeDateModule,DateAdapter} from '@angular/material/core';
import { FormsModule, NgForm } from '@angular/forms';
import { tap } from 'rxjs';


import{
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,MatButtonModule,MatSidenavModule,MatListModule,MatFormFieldModule,MatInputModule,MatTableModule, MatSortModule, MatPaginatorModule,MatFormField,MatPaginator,MatDialogModule,MatFormField,MatPaginator,MatDialogModule,MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,MatMenuModule,MatDatepickerModule,MatNativeDateModule,FormsModule],
  templateUrl: './log.component.html',
  providers:[provideNativeDateAdapter()],
  
  styleUrl: './log.component.css'
})
export class LogComponent implements OnInit{
  // @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sidenav') sidenav: MatDrawer | undefined;
  logoutTimestamp: number | null = null; // Inizializza la variabile per il timestamp del logout
  username: string | null = null; // Inizializza la variabile per il nome utente
  displayedColumns: string[] = [
    'id',  
   'Nome',
   'Cognome',
   'TimeStamp_Login',
   'TimeStamp_Logout',
   'Nome_ZIP',
   'Nome_PDF',
   'Nome_PDF_POS'
  ];
   dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor( private router:Router, @Inject(PLATFORM_ID) private platformId: Object,private _getdatabase:LogServices,private dateAdapter: DateAdapter<Date>,private _log:LogServices){
    this.dateAdapter.setLocale('it-IT'); //dd/MM/yyyy
  }
  
ngOnInit():void{
  // console.log(this._boolean.isAuthenticated());
  // Verifica se il codice viene eseguito lato client
  if (isPlatformBrowser(this.platformId)) {
    // Registra il gestore per l'evento beforeunload solo se siamo lato client
    // Verifica se il nome utente è memorizzato in sessionStorage
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername; // Imposta il nome utente se è presente in sessionStorage
    }
  }
  this.getLogList();
}

Closeside(): void {
  if (this.sidenav) {
    this.sidenav.close();
  }
}
logout1(): void {
 this.router.navigate(['login']);
}
getLogList(){
  this._getdatabase.getLogList().subscribe({next:(res)=>{
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.sort=this.sort;
    this.dataSource.paginator=this.paginator;


  },
  error:(err)=>{
    console.log(err)
  }
    });
}
returnhome() :void{
  this.router.navigate(['welcome-page']);
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
applyDateFilter(): void {
  // Assicurati che entrambi gli input delle date esistano prima di accedere alle loro proprietà value
  if (!this.startDateInput || !this.startDateInput.nativeElement || !this.startDateInput.nativeElement.value ||
      !this.endDateInput || !this.endDateInput.nativeElement || !this.endDateInput.nativeElement.value) {
    console.log('Uno o entrambi gli input delle date sono vuoti');
    return;
  }

  const startDateInputValue = this.startDateInput.nativeElement.value;
  const endDateInputValue = this.endDateInput.nativeElement.value;

  const startDate = this.parseDate(startDateInputValue);
  const endDate = this.parseDate(endDateInputValue);
  // console.log('startDate: ', startDate);
  // console.log('endDate: ', endDate);

  // Controlla che le date siano valide prima di applicare il filtro
  if (!startDate || !endDate) {
    console.log('Una o entrambe le date non sono valide');
    return;
  }

  // Applica il filtro di intervallo di date
  this.dataSource.filterPredicate = (data: any) => {
    const rowDataStartDate = this.parseDate(data.TimeStamp_Login); // Converti la data della riga in formato corretto
    // console.log('rowDataStartDate:', rowDataStartDate);
  
    // Verifica se la data della riga non è nulla
    if (!rowDataStartDate) {
      return false; // Se la data è nulla, la riga non corrisponde ai criteri del filtro
    }
    if (endDate==startDate) {
      return true; // Se la data è nulla, la riga non corrisponde ai criteri del filtro
    }
  
    // Confronta solo le parti della data
    return rowDataStartDate >= startDate && rowDataStartDate <= endDate;
  };

  this.dataSource.filter = 'activate'; // Attiva il filtro
}

// Metodo per analizzare la data da una stringa
private parseDate(dateString: string): string | null {
  if (!dateString) {
    return null; // Restituisci null se la stringa è vuota o indefinita
  }
  
  const [day, month, year] = dateString.split('/');
  return `${day}/${month}/${year}`;
}
clearDateFilter(form:NgForm): void {
  this.dataSource.filter = ''; // Assegna una stringa vuota per ripristinare la visualizzazione completa dei dati
  form.reset();
  window.location.reload();
}

}