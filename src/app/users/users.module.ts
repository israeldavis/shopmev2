import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';

import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './usersList/users-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailDuplicatedDialogComponent } from './email-duplicated-dialog/email-duplicated-dialog.component';
import { UsersUpdateComponent } from './usersUpdate/users-update.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './account/account.component';



@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    EmailDuplicatedDialogComponent,
    UsersUpdateComponent,
    ConfirmDeleteDialogComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
