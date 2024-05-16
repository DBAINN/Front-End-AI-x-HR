// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   IsLogged = false;
//   IsAdmin = true;

//   constructor() { }
//   IsAuthenticated(){
//     return this.IsLogged;
//   }
//   IsRoleAdmin(){
//     return this.IsAdmin;
//   }
// }
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  IsRoleAdmin = true;

  constructor() { }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token; // Restituisce true se il token è presente, altrimenti false
  }
  isAdmin(){
    return this.IsRoleAdmin;

  }
  isAdmintoken(): boolean {
    const token = sessionStorage.getItem('Admin');
    return !!token; // Restituisce true se il token è presente, altrimenti false
  }
}
