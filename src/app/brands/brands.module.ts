import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrandsListComponent } from './brands-list/brands-list.component';
import { BrandsRoutingModule } from "./brands-routing.module";
import { BrandsComponent } from "./brands.component";
import { BrandsUpdateComponent } from './brands-update/brands-update.component';
import { SharedModule } from "../shared/shared.module";
import { UniqueBrandNameDialogComponent } from './unique-brand-name-dialog/unique-brand-name-dialog.component';

@NgModule({
  declarations:[
    BrandsComponent,
    BrandsListComponent,
    BrandsUpdateComponent,
    UniqueBrandNameDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrandsRoutingModule,
    SharedModule
  ]
})
export class BrandsModule {}
