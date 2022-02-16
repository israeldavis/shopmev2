import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { SecurityUserAuth } from './security-user-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnInit {

  securityObject: SecurityUserAuth = null;

  constructor(private loginService: LoginService,
              private router: Router ) {}

  ngOnInit(): void {
    this.loginService.securityObjectChanges$.subscribe(
      resSecurityObject => this.securityObject = resSecurityObject
    )
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let roleType: string = route.data["roleType"];

    if(this.securityObject.authenticated){
        return true;
    } else {
        this.router.navigate(['/login'],
          {queryParams: {returnUrl: state.url }});
        return false;
    }
  }

}
