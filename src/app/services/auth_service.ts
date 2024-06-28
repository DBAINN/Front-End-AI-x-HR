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
  isAdmintoken(): boolean {
    const role = sessionStorage.getItem('role');
    if (role === 'admin') {
      return true; // Restituisce true se il ruolo è 'admin'
    } else {
      return false; // Restituisce false in tutti gli altri casi
    }
  }
 
}
