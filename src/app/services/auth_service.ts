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
    const token = sessionStorage.getItem('Admin');
    return !!token; // Restituisce true se il token è presente, altrimenti false
  }
}
