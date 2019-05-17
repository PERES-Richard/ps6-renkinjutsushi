import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fav-popup',
  templateUrl: './fav-popup.component.html',
  styleUrls: ['./fav-popup.component.scss']
})
export class FavPopupComponent implements OnInit {
  nom: string;
  memo = '';

  constructor(public dialogRef: MatDialogRef<FavPopupComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    if (this.memo !== '') {
      this.dialogRef.close([this.nom, this.memo]);
    } else {
      this.dialogRef.close(this.nom);
    }
  }

  ngOnInit(): void {
  }

}
