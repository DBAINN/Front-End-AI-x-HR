import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { DialogUserWindowComponent } from './dialog-user-window/dialog-user-window.component';
import { AuthGuard } from './guard/auth.guard';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { DocumentazioneComponent } from './documentazione/documentazione.component';
import { LogComponent } from './log/log.component';

export const routes: Routes = [
    {
        path: '', redirectTo:'login', pathMatch:'full' //reindirizzo alla pagina di login
    }, 
    {
        path:'login',
    component:LoginComponent    },
    {
        path:'users-admin',
    component:UsersAdminComponent, canActivate:[AuthGuard]},
    {
        path:'welcome-page',
    component:WelcomePageComponent, canActivate:[AuthGuard]},
    {
        path:'documentazione',
    component:DocumentazioneComponent},
    {
        path:'log',
    component:LogComponent, canActivate:[AuthGuard]},    
];
