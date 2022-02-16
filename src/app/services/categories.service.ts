import { formatDate } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";
import { Category } from "../model/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private url: string = 'http://localhost:8080/TiendaAdmin';

  constructor(private http: HttpClient) {}

  public getCategories(sortDir: string): Observable<any> {
    return this.http.get<any>(`${this.url}/categories?sortDir=${sortDir}`);
  }

  public getCategoriesByPage(pageNum: number, sortField: string, sortDir: string, keyword: string): Observable<any> {
    const query = `sortField=${sortField}&sortDir=${sortDir}&keyword=${keyword}`;

    const options = {
      params: new HttpParams({
        fromString: query
      })
    }

    return this.http.get<any>(`${this.url}/categories/page/${pageNum}`, options);
  }

  getCategory(id: number): Observable<Category> {
    if(id==0) {
      return of(this.initializeCategory());
    }
    return this.http.get<Category>(`${this.url}/categories/${id}`);
  }

  getListCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/categories/new`);
  }

  private initializeCategory(): Category {
    return {
      id: 0,
      name: '',
      alias:'',
      enabled: false,
      image: '',
      children: [],
      parent: null,
      imagePath: '',
      hasChildren: false
    }
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.url}/categories/delete/${id}`);
  }

  saveCategory(formData: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.url}/categories/save`, formData);
  }

  updateCategory(formData: FormData): Observable<Category> {
    return this.http.put<Category>(`${this.url}/categories/update/${formData.get('id')}`, formData);
  }

  checkUnique(id: number, name: string, alias: string): Observable<string | ArrayBuffer> {

    const query = `id=${id}&name=${name}&alias=${alias}`;

    const options = {
      params: new HttpParams({
        fromString: query
      })
    }

    return this.http.get<string>(`${this.url}/categories/check_unique`, options).pipe(
      tap(response => console.log(response) )
    );
  }

  updateCategoryEnabledStatus(id: number, status: boolean) {
    return this.http.get<string>(`${this.url}/categories/${id}/enabled/${status}`);
  }

  public createCategoryFormData(category: Category, image: File): FormData {
    const formData = new FormData();


    let parentCategory;
    if(category.parent != null) {
        parentCategory = {
          "id": category.parent.id,
          "name": category.parent.name,
          "alias": category.parent.alias,
          "enabled": category.parent.enabled,
          "image": category.parent.image,
          "children": [],
          "parent": null
        }
    } else {
          parentCategory = null;
    }



    formData.append('id', category.id ? category.id + '' : '0' )
    formData.append('name', category.name);
    formData.append('alias', category.alias);
    formData.append('enabled', category.enabled ? JSON.stringify(category.enabled) : 'false');
    formData.append('parent', JSON.stringify(parentCategory));
    formData.append('image', image);

    return formData;
  }

  getImage(id: number, fileName: string) {
    return this.http.get<any>(`${this.url}/category/image/${id}/${fileName}`).pipe(
      tap(response => console.log(response))
    )
  }

  exportCsv(): any {
    return this.http.get(`${this.url}/categories/export/csv`, {responseType: 'blob'});
  }

}
