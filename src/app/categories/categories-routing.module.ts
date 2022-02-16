import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriesListComponent } from "./categories-list/categories-list.component";
import { CategoriesUpdateComponent } from "./categories-update/categories-update.component";
import { CategoriesComponent } from "./categories.component";

const routes: Routes = [
  {
    path: '', // /categories
    component: CategoriesComponent,
    children: [
      {
        path: '', // /categories -> /categories/list
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list', // /categories/list
        component: CategoriesListComponent
      },
      {
        path: 'page/:pageNum',
        component: CategoriesListComponent
      },
      {
        path: 'edit/:id', // /categories/edit/1
        component: CategoriesUpdateComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}
