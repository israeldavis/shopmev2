import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from 'src/app/model/brand.model';
import { BrandsService } from 'src/app/services/brands.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.css']
})
export class BrandsListComponent implements OnInit {

  queryForm: FormGroup;

  listBrands: Brand[] = [];
  brandSeleccionada: Brand;
  pageNum: number;
  paginador: any;
  sortField: string;
  sortDir: string;
  reverseSortDir: string = 'desc';
  keyword: string;

  constructor(private formBuilder: FormBuilder,
              private brandsService: BrandsService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {

      this.queryForm = this.formBuilder.group({
        'keyword': [''],
        'sortField': [''],
        'sortDir': ['']
      })
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(
      (params) => {
        this.sortDir = params.get('sortDir') ? params.get('sortDir') : 'asc';
        this.reverseSortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        this.keyword = params.get('keyword') ? params.get('keyword') : '';
        if(this.keyword == '') {
          if(!this.queryForm.value.keyword) {
            this.keyword = this.queryForm.value.keyword;
          }
        }

        console.log('keyword', this.keyword)

        this.route.paramMap.subscribe(
          params => {
            let pageNum = params.get('pageNum');
            console.log('pageNum: ', pageNum);
            if(pageNum) {
              this.pageNum = +pageNum;
              this.getBrandsByPage(+pageNum, 'name', this.sortDir, this.keyword);
            } else {
              this.getBrandsByPage(1, 'name', this.sortDir, this.keyword);
            }
          }
        );
      }
    );
  }

  getBrands(sortDir: string) {
    this.brandsService.getBrands().subscribe(
      res => {
        this.listBrands = res
        console.log('Todas las brands', this.listBrands)
      }
    );
  }

  getBrandsByPage(pageNum: number, sortField: string, sortDir: string, keyword: string) {
    this.brandsService.getBrandsByPage(pageNum, sortField, sortDir, keyword).subscribe(
      res => {
        this.listBrands = res.content;
        this.paginador = res;
        console.log('Todas las brands: ', this.listBrands);
      }
    )
  }

  search() {
    console.log('Dentro de search: ', this.queryForm.value.keyword);
    if(this.queryForm.value.keyword !== ''){
      this.keyword = this.queryForm.value.keyword;
      this.router.navigate(['/brands/page/1'],
        {queryParams: {sortField: this.sortField, sortDir: this.sortDir, keyword: this.keyword}});
    } else {
      this.router.navigate(['/brands/page/1'],
      {queryParams: {sortField: this.sortField, sortDir: this.sortDir}})
    }
  }

  reset() {

  }

  abrirModal(brand: Brand) {
    this.brandSeleccionada = brand;
    this.modalService.abrirDelete()
  }

  borrar(id: number) {
    this.brandsService.deleteBrand(id).subscribe(
      respuesta => {
        this.getBrands('asc');
        this.router.navigate(['/brands'])
      }
    )
  }

}
