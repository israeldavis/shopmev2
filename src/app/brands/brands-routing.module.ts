import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { BrandsListComponent } from "./brands-list/brands-list.component"
import { BrandsUpdateComponent } from "./brands-update/brands-update.component"
import { BrandsComponent } from "./brands.component"

const routes: Routes = [
  {
    path: '', // /brands
    component: BrandsComponent,
    children: [
      {
        path: '', // /brands -> /brands/list
        pathMatch: 'full',
        redirectTo: '/brands/page/1'
      },
      {
        path: 'list', // /brands/list
        component: BrandsListComponent,
      },
      {
        path: 'page/:pageNum', // /brands/page/1
        component: BrandsListComponent
      },
      {
        path: 'edit/:id', // /brands/edit/1
        component: BrandsUpdateComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule {}
