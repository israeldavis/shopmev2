import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  queryForm: FormGroup;

  listCategories: Category[] = [];
  categorySeleccionada: Category;
  pageNum: number;
  paginador: any;
  sortField: string;
  sortDir: string;
  reverseSortDir: string = 'desc';
  keyword: string;

  constructor(private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService
              ) {
      this.queryForm = this.formBuilder.group({
        'keyword': [''],
        'sortField': [''],
        'sortDir': ['']
      });
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(
      (params) => {
        this.sortDir = params.get('sortDir') ? params.get('sortDir') : 'asc';
        this.reverseSortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        this.getCategories(this.sortDir);
      }
    )
  }

  getCategories(sortDir: string) {
    this.categoriesService.getCategories(sortDir).subscribe(
      res => {
        this.listCategories = res;
        console.log("Todas las categories", this.listCategories);
      }
    );
  }

  getCategoriesByPage(pageNum: number, sortField: string, sortDir: string, keyword: string) {
    this.categoriesService.getCategoriesByPage(pageNum, sortField, sortDir, keyword).subscribe(
      res => {
        this.listCategories = res.content;
        this.paginador = res;
        console.log("Todas las categories: ", this.listCategories);
      }
    )
  }

  search() {
    console.log("Dentro de search: ", this.queryForm.value.keyword);
    if(this.queryForm.value.keyword !== ''){
      this.keyword = this.queryForm.value.keyword;
      this.router.navigate(['/categories/page/1'],
            {queryParams: {sortField: this.sortField, sortDir: this.sortDir, keyword: this.keyword} });
    } else {
      this.router.navigate(['/categories/page/1'],
            {queryParams: {sortField: this.sortField, sortDir: this.sortDir} });
    }
  }

  reset() {
    console.log("Dentro de reset");
    this.router.navigate(['/categories/page/1'],
            {queryParams: {sortField: this.sortField, sortDir: this.sortDir} });
  }

  updateEnabledStatus(id: number, status: boolean) {
    this.categoriesService.updateCategoryEnabledStatus(id, status).subscribe(
      response => {
        this.getCategories('asc');
        this.router.navigate(['/categories/list']);
      }
    )
  }

  abrirModal(category: Category) {
    this.categorySeleccionada = category;
    this.modalService.abrirDelete();
  }

  borrar(id: number) {
    this.categoriesService.deleteCategory(id).subscribe(
      respuesta => {
        this.getCategories('asc');
        this.router.navigate(['/categories/list']);
      }
    )
  }

}
