import { Component, OnInit } from '@angular/core';
import { User } from './model/user.model';
import { SecurityUserAuth } from './security/security-user-auth';
import { LoginService } from './services/login.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shopmev2';

  securityObject: SecurityUserAuth = null;
  //userLogedIn: User;

  constructor( private loginService: LoginService){

  }

  ngOnInit(): void {
    this.loginService.securityObjectChanges$.subscribe(
      resSecurityObject => {
        this.securityObject = resSecurityObject;
        console.log("******************SecurityObject en AppComponent: ", this.securityObject);
        if(resSecurityObject == null){
          this.securityObject = this.loginService.securityObjectBack;
        }
      }
    );
  }

  logout(): void {
    this.loginService.logout();
  }

  isAdmin(): boolean {
    return this.securityObject?.role == 'Admin';
  }

  isSalesperson(): boolean {
    return this.securityObject?.role == 'Salesperson';
  }

  isEditor(): boolean {
    return this.securityObject?.role == 'Editor';
  }

  isShipper(): boolean {
    return this.securityObject?.role == 'Shipper';
  }

  isAssistant(): boolean {
    return this.securityObject?.role == 'Assistant';
  }
}
