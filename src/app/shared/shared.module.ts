import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';



@NgModule({
  declarations: [LoginComponent, PaginatorComponent, WelcomeComponent, PageNotFoundComponent, DeleteModalComponent],
  exports: [LoginComponent, PaginatorComponent, DeleteModalComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
