import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Brand } from '../model/brand.model';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  private url: string = 'http://localhost:8080/TiendaAdmin';

  constructor(private http:HttpClient) { }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.url}/brands`);
  }

  getBrandsByPage(pageNum: number, sortField: string, sortDir: string, keyword: string): Observable<any> {
    const query = `sortField=${sortField}&sortDir=${sortDir}&keyword=${keyword}`;

    const options = {
      params: new HttpParams({
        fromString: query
      })
    }
    return this.http.get<any>(`${this.url}/brands/page/${pageNum}`, options);
  }

  getBrand(id: number): Observable<Brand> {
    if(id==0){
      return of(this.initializeBrand());
    }
    return this.http.get<Brand>(`${this.url}/brands/${id}`)
  }

  getListCAtegories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/categories/new`);
  }

  private initializeBrand(): Brand {
    return {
      id: 0,
      name: '',
      logo: '',
      categories: [],
      logoImagePath: ''
    }
  }

  deleteBrand(id: number) {
    return this.http.delete(`${this.url}/brands/delete/${id}`);
  }

  saveBrand(formData: FormData): Observable<Brand> {
    return this.http.post<Brand>(`${this.url}/brands/save`, formData);
  }

  updateBrand(formData: FormData): Observable<Brand> {
    return this.http.put<Brand>(`${this.url}/brands/update/${formData.get('id')}`, formData);
  }

  createBrandFormData(brand: Brand, logo: File): FormData {
    const formData = new FormData();

    var categoriesIds = '';

    brand.categories.forEach( category => {
      categoriesIds += category + " "
    });

    formData.append('id', brand.id ? brand.id + '' : '0');
    formData.append('name', brand.name);
    formData.append('logo', logo);
    formData.append('categories', categoriesIds);

    return formData;
  }

  getLogo(id: number, fileName: string) {
    return this.http.get<any>(`${this.url}/brands/logo/${id}/${fileName}`).pipe(
      tap(response => console.log(response))
    )
  }

  checkUnique(id: number, name: string): Observable<boolean> {
    const query =  `id=${id}&name=${name}`;

    const options = {
      params: new HttpParams({
        fromString: query
      })
    }

    return this.http.get<boolean>(`${this.url}/brands/check_unique`, options);
  }

}
