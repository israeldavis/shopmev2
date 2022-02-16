import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../security/auth.guard";
import { AccountComponent } from "./account/account.component";

import { UsersComponent } from "./users.component";
import { UsersEditComponent } from "./usersEdit/users-edit.component";
import { UsersListComponent } from "./usersList/users-list.component";
import { UsersUpdateComponent } from "./usersUpdate/users-update.component";

const routes: Routes = [
  {
    path: '', // /users
    component: UsersComponent,
    //canActivate: [AuthGuard],
    data: { roleType: 'Admin'},
    children: [
      {
        path: '', // /users/ -> /users/list
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'export/csv',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list', // /users/list
        component: UsersListComponent
      },
      {
        path: 'page/:pageNum',
        component: UsersListComponent
      },
       {
         path: 'edit/:id', // /users/edit/1
         component: UsersUpdateComponent
       },
       {
        path: 'account/:id', // /users/account/1
        component: AccountComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
