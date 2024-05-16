import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthGuard } from '../guard/auth.guard';
import { AuthService } from '../services/auth_service';
import { LogServices } from '../services/log.service';

import {
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { error } from 'console';
import { UsersServices } from '../services/users.service';
import { timestamp } from 'rxjs';
import { Token } from '@angular/compiler';



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  hide=true;
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, HttpClientModule, CommonModule,ToastrModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  public loginForm!: FormGroup;
  public matcher= new MyErrorStateMatcher();
  public hide=true;
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private _service: UsersServices, private toastr: ToastrService, private _authser:AuthService,private _log:LogServices ) {}
  userdata: any;
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required)

    })
  }
 login() {
  if (this.loginForm.valid) {
    this._service.getUsers().subscribe((users) => {
      this.userdata = users.find(user => user.Email === this.loginForm.value.email && user.Password === this.loginForm.value.password);
      // console.log(this.userdata);
      if (this.userdata && this.userdata.Ruolo==='user') {
        this._authser.IsRoleAdmin=false;
        // Genera un token temporaneo
        const temporaryToken = 'Accesso Effettuato';
        // Utente trovato, esegui l'accesso
        this.toastr.success('Login effettuato con successo!', 'Autorizzazione concessa');
        sessionStorage.setItem('token', temporaryToken);
        sessionStorage.setItem('username',this.userdata.Nome);
        sessionStorage.setItem('userData', JSON.stringify(this.userdata)); // Salva tutti i dati dell'utente

        this.loginForm.reset();
        // this._boolean.IsLogged=true;
        // console.log(this._boolean.IsLogged);
        this.router.navigate(['documentazione']);
        // const TimeStamp_Login = new Date().toLocaleDateString('it-IT'); // Ottieni il timestamp corrente
        // sessionStorage.setItem('TimeStamp_Login', TimeStamp_Login);
        // this._log.logLogin(this.userdata.Nome,this.userdata.Cognome,TimeStamp_Login)
        

      }
      else if (this.userdata && this.userdata.Ruolo === 'admin') {
        // Se l'utente ha il ruolo "admin"
        // Genera un token temporaneo
        this._authser.IsRoleAdmin=true;
        const temporaryToken = 'Accesso Effettuato';
        // Utente trovato, esegui l'accesso
        this.toastr.success('Login effettuato con successo!', 'Autorizzazione concessa');
        sessionStorage.setItem('token', temporaryToken);
        sessionStorage.setItem('username', this.userdata.Nome);
        sessionStorage.setItem('Admin',this.userdata.Ruolo);
        sessionStorage.setItem('userData', JSON.stringify(this.userdata)); // Salva tutti i dati dell'utente

        this.loginForm.reset();
        // Imposta IsRoleAdmin su true
        this._authser.IsRoleAdmin = true;
        // Naviga alla pagina-toolbar
        this.router.navigate(['documentazione']);
        const TimeStamp_Login = new Date().toLocaleString('it-IT', { hour12: false }); // Ottieni il timestamp corrente
        sessionStorage.setItem('TimeStamp_Login', TimeStamp_Login);

        this._service.logLogin(this.userdata.Nome, this.userdata.Cognome, TimeStamp_Login);
      } 
      else {
        // Utente non trovato, visualizza un messaggio di errore
        this.toastr.error('Credenziali inserite non valide!', 'Errore di autenticazione');
        // console.log(this._boolean.IsLogged);
      }
    });
  }
}
  passwordFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
}
