import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { CategoriesRoutingModule } from "./categories-routing.module";
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesComponent } from "./categories.component";
import { CategoriesUpdateComponent } from './categories-update/categories-update.component';
import { UniqueNameDialogComponent } from './unique-name-dialog/unique-name-dialog.component';
import { ConfirmDeleteCategoryComponent } from './confirm-delete-category/confirm-delete-category.component';


@NgModule({
  declarations: [
    CategoriesComponent,
    CategoriesListComponent,
    CategoriesUpdateComponent,
    UniqueNameDialogComponent,
    ConfirmDeleteCategoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule {}
