import { Component, AfterViewInit, ViewChild, OnInit, Inject,PLATFORM_ID,viewChild} from '@angular/core';
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
import { UsersServices } from '../services/users.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth_service';
import { MatDrawer } from '@angular/material/sidenav';
import { tap } from 'rxjs';
import { LogServices } from '../services/log.service';


import{
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreService } from '../core/core.service';
import { isEmpty } from 'rxjs';


const RUOLO:  string[] = ['Admin', 'User'];
@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,MatButtonModule,MatSidenavModule,MatListModule,MatFormFieldModule,MatInputModule,MatTableModule, MatSortModule, MatPaginatorModule,MatFormField,MatPaginator,MatDialogModule,MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,MatMenuModule],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.css'
})

export class UsersAdminComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatDrawer | undefined;
  logoutTimestamp: number | null = null; // Inizializza la variabile per il timestamp del logout
  username: string | null = null; // Inizializza la variabile per il nome utente
  displayedColumns: string[] = [
   'id',  
  'Nome',
  'Cognome',
  'Email',
  'Ruolo',
  'Azioni'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private _getdatabase:UsersServices, private _coreService:CoreService, private _dialog:MatDialog, private router:Router, @Inject(PLATFORM_ID) private platformId: Object, private _boolean:AuthService, private _log:LogServices) {

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
    this.getUsersList();
  }
  Closeside(): void {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }
  logout(): void {
   this.router.navigate(['login']);
}
  getUsersList(){
    this._getdatabase.getUsersList().subscribe({next:(res)=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;

  
    },
    error:(err)=>{
      console.log(err)
    }
      });
  }
  deleteUser(id:string){
    this._getdatabase.deleteUsersList(id).subscribe((res)=>{
    this._coreService.openSnackBar("L'utente è stato eliminato con successo!", 'Chiudi');
    this.getUsersList();  
      
    } ,
    (err)=>{console.log(err)} );
  }
  editForm(data:any){
    const dialogRef = this.dialog.open(DialogUserWindowComponent,{
      data,
      width: '500px', 
      height:'600px'
  });
  dialogRef.afterClosed().subscribe({
    next:(val)=>{
      if(val){
        this.getUsersList();
      }
    }
  })
}
  

  
    openDialog(){
      const dialogRef = this._dialog.open(DialogUserWindowComponent, {
        width: '500px', // Puoi regolare la larghezza come desideri
        height:'600px'
    });
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getUsersList();
        }
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog chiuso');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  returnhome() :void{
    this.router.navigate(['documentazione']);
  }
}



