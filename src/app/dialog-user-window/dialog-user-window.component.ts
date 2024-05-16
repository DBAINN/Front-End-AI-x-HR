import { Component,InjectionToken,NgModule, OnInit, Inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators,FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
import { error } from 'console';
import { UsersServices} from '../services/users.service';
import { CoreService } from '../core/core.service';
import { DialogRef } from '@angular/cdk/dialog';



@Component({
  selector: 'app-dialog-user-window',
  standalone: true,
  imports: [MatButtonModule,MatButtonModule,MatInputModule, MatFormFieldModule,ReactiveFormsModule, MatIconModule,MatSelectModule,MatDialogModule],
  templateUrl: './dialog-user-window.component.html',
  styleUrl: './dialog-user-window.component.css'
})
export class DialogUserWindowComponent implements OnInit{
  public signupForm !: FormGroup;
constructor(private modalService: MatDialog,private formBuilder:FormBuilder, private router:Router, private _usersService:UsersServices, @Inject(MAT_DIALOG_DATA) public data: any, private _coreService:CoreService, private _dialog_Ref:MatDialogRef<DialogUserWindowComponent>) { }
ngOnInit(): void {
  this.signupForm = this.formBuilder.group({
    Nome :this.formBuilder.control('', Validators.compose([Validators.required,Validators.minLength(3)])),
    Cognome :this.formBuilder.control('',Validators.required),
    Email :this.formBuilder.control('',Validators.compose([Validators.required,Validators.email])),
    Password :this.formBuilder.control('',Validators.compose([Validators.required,Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)])),
    Ruolo:this.formBuilder.control('',Validators.required) 
})
this.signupForm.patchValue(this.data);
}
signup(){
  if (this.signupForm.valid){
    if(this.data){
      this._usersService.updateUser(this.data.id, this.signupForm.value).subscribe({
        next:(val:any)=>{
          this._coreService.openSnackBar('Informazioni dell\'Utente modificate!', 'Chiudi');
          this._dialog_Ref.close(true);
          this._usersService.getUsersList();
        },
        error:(err:any)=>{
          console.error(err)
        }
      })

    }else{
    this._usersService.addUser(this.signupForm.value).subscribe({
      next:(val:any)=>{
        
        this._coreService.openSnackBar('Utente aggiunto con successo!', 'Chiudi');
        this._dialog_Ref.close(true);
        this._usersService.getUsersList();
      },
      error:(err:any)=>{
        console.error(err)
      }
    })
  }
}
}
// signup(){
//   this.http.post<any>("http://localhost:3000/users",this.signupForm.value)
//    .subscribe((res)=>{alert("Registrazione avvenuta con successo");
//    this.signupForm.reset();
//    this.modalService.closeAll();
//    this.router.navigate(['users-admin']);},err=>{ alert("Errore nella registrazione")
// })
// }

onClose(): void {
  this.modalService.closeAll(); // Chiude tutte le modali aperte
}
}

  


