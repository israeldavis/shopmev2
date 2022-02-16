import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Role } from '../model/role.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url: string = "http://localhost:8080/TiendaAdmin";

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<any> {
    return this.http.get<any>(`${this.url}/users`);
  }

  public getUsersByPage(pageNum: number, sortField: string, sortDir: string, keyword: string): Observable<any> {
   const query = `sortField=${sortField}&sortDir=${sortDir}&keyword=${keyword}`;

   const options = {
     params: new HttpParams({
       fromString: query
     })
   }

    return this.http.get<any>(`${this.url}/users/page/${pageNum}`, options);
  }

  getUserByName(name: string): Observable<User> {
    return this.http.get<User>(`${this.url}/users/getByEmail/${name}`);
  }

  getUser(id: number): Observable<User> {
    if(id == 0 ) {
      return of(this.initializeUser());
    }
    return this.http.get<User>(`${this.url}/users/${id}`);
  }

  getUserAccount(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/users/account/${id}`);
  }

  private initializeUser(): User {
    return {
      id: 0,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      photos: '',
      enabled: false,
      roles: [],
      photosImagePath: ''
    }
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.url}/users/delete/${id}`);
  }

  saveUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.url}/users/save`, formData);
  }

  updateUser(formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.url}/users/update/${formData.get('id')}`, formData);
  }

  updateAccount(formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.url}/account/update/${formData.get('id')}`, formData);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/roles`);
  }

  checkDuplicateEmail(id: number, email: string): Observable<string> {
    return this.http.post<string>(`${this.url}/users/check_email/${id}`, email);
  }

  updateUserEnabledStatus(id: number, status: boolean){
    return this.http.get<string>(`${this.url}/users/${id}/enabled/${status}`);
  }

  public createUserFormData(user: User, image: File): FormData {
    const formData = new FormData();

    var rolesIds = '';

    user.roles.forEach( role => {
      rolesIds += role.id + " "
    })

    formData.append('id',  user.id ? user.id + '' :  '0');
    formData.append('email', user.email);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('password', user.password);
    formData.append('enabled', user.enabled ? JSON.stringify(user.enabled) : 'false');
    formData.append('roles', rolesIds);
    formData.append('image', image);

    return formData;
  }

  getProfileImage(id: number, fileName: string) {
    return this.http.get<any>(`${this.url}/users/image/${id}/${fileName}`).pipe(
      tap(response => console.log(response))
    )

  }

  exportCsv(): any {
    return this.http.get(`${this.url}/users/export/csv`, { responseType: 'blob' });
  }

  exportExcel(): any {
    return this.http.get(`${this.url}/users/export/excel`, {responseType: 'blob'});
  }

  exportPDF(): any {
    return this.http.get(`${this.url}/users/export/pdf`, {responseType: 'blob'});
  }


}
