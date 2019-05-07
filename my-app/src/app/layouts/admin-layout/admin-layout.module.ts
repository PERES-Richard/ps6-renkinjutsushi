import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { EtudiantValideComponent } from 'app/etudiant-valide/etudiant-valide.component';
import { EtudiantNonValideComponent } from 'app/etudiant-non-valide/etudiant-non-valide.component';
import { EtudiantEnCoursComponent } from 'app/etudiant-en-cours/etudiant-en-cours.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    EtudiantValideComponent,
    EtudiantNonValideComponent,
    EtudiantEnCoursComponent,
  ]
})

export class AdminLayoutModule {}
