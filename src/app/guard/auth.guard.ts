// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
// import { AuthService } from '../services/auth_service';

// export class AuthGuard implements CanActivate{
//   constructor(private _authService:AuthService ){}
//   canActivate(
//     route:ActivatedRouteSnapshot,
//     state:RouterStateSnapshot){
//       return this._authService.IsAuthenticated();
//     }
// };
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth_service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Consente l'accesso se l'utente è autenticato
    } else {
      this.router.navigate(['login']); // Reindirizza alla pagina di login se l'utente non è autenticato
      return false; // Blocca l'accesso alla route
    }
  }
}
