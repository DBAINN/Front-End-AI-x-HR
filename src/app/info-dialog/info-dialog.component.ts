import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports:[MatButtonModule,MatDialogModule],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.css'
})
export class InfoDialogComponent{
  constructor(private _dialog_Ref: MatDialogRef<InfoDialogComponent>){}
  // Metodo per chiudere il dialogo
  closeDialog(): void {
    this._dialog_Ref.close();
  }
}
