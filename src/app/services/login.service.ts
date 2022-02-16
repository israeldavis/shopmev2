import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Login } from '../model/login.model';
import { SecurityUserAuth } from '../security/security-user-auth';

const API_URL = "http://localhost:8080/TiendaAdmin";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //securityObject: SecurityUserAuth = new SecurityUserAuth();
  private securityObjectSource = new BehaviorSubject<SecurityUserAuth | null>(null);
  securityObjectChanges$ = this.securityObjectSource.asObservable();

  securityObjectBack: SecurityUserAuth = null;

  private token: string;
  public loggedInUsername: string = '';

  constructor(private http: HttpClient) {
    this.token = '';
    this.securityObjectBack = JSON.parse(localStorage.getItem('securityObject'));
    if(this.securityObjectBack){
      this.changeSecurityObject(this.securityObjectBack);
    }
   }

   changeSecurityObject(securityObject: SecurityUserAuth | null): void {
     this.securityObjectSource.next(securityObject);
   }

  login(login: Login): Observable<SecurityUserAuth> {
    return this.http.post<SecurityUserAuth>(`${API_URL}/api/login`, login).pipe(
      tap( (resp) => {
        console.log("La respuesta: ", JSON.stringify(resp));
        const bearerToken = resp.bearerToken as string;
        localStorage.setItem("bearerToken", bearerToken);
        localStorage.setItem("securityObject", JSON.stringify(resp));
        //this.securityObject = resp;
        this.changeSecurityObject(resp);

      })
    )
  }

  logout(): void {
    this.changeSecurityObject(new SecurityUserAuth());
    this.resetSecurityObject();
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  saveUsername(username: string) {
    localStorage.setItem('username', username);
  }

  loadToken(): void {
    this.token = localStorage.getItem('bearerToken') || '';
  }

  public getToken(): string {
    return this.token;
  }

  resetSecurityObject() {

    localStorage.removeItem("bearerToken");
    localStorage.removeItem("securityObject");
  }

}
