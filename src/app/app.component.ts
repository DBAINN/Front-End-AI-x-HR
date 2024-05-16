import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field'; // Importa il modulo MatFormFieldModule
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { ToastrModule } from 'ngx-toastr';
import {MatCardModule} from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';






@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    ToastrModule,
    MatCardModule,
    MatFormField,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'Geographic Portal';
}
