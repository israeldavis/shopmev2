import { Component, OnInit } from '@angular/core';
import { SecurityUserAuth } from 'src/app/security/security-user-auth';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  securityObject: SecurityUserAuth = null;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.securityObjectChanges$.subscribe(
      resSecurityObject => this.securityObject = resSecurityObject
    );
  }

}
