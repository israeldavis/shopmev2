import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityUserAuth } from 'src/app/security/security-user-auth';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup ;
  securityObject: SecurityUserAuth = null;
  returnUrl: string;

  emailMessage: string;
  passwordMessage: string;

  private emailValidationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  private passwordValidationMessages = {
    required: 'Please enter a password',
    minlength: 'Please enter minLength password of 3'
  }

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private router: Router) {
      this.loginForm = this.fb.group({
                  "email": ['', [Validators.required, Validators.email]],
                  "password": ['', [Validators.required, Validators.minLength(3)]]
      });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.loginService.securityObjectChanges$.subscribe(
      resSecurityObject => this.securityObject = resSecurityObject
    );

    const emailControl = this.loginForm.get('email');
    emailControl.valueChanges.subscribe(
      value => this.setEmailMessage(emailControl)
    );

    const passwordControl = this.loginForm.get('password');
    passwordControl.valueChanges.subscribe(
      value => this.setPasswordMessage(passwordControl)
    )
  }

  setEmailMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.emailValidationMessages[key]
      ).join(' ');
      console.log("EmailMessage: ", this.emailMessage);
    }
  }

  setPasswordMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.passwordMessage = Object.keys(c.errors).map(
        key => this.passwordMessage += this.passwordValidationMessages[key]
      ).join(' ');
      console.log("PasswordMessage: ", this.passwordMessage);
    }
  }

  login(): void {
    const loginvalues = this.loginForm.value;

    this.loginService.login(loginvalues).subscribe(
      (res) => {
        console.log(res);

        if(this.returnUrl) {
          this.router.navigate(['/welcome']);
        } else {
          this.router.navigate(['/welcome']);
        }

    },
      // Inicializa el securityObject para desplegar el mensaje de error
      (error) => {
        console.log(error);
        this.securityObject = new SecurityUserAuth();
      }

    );
  }

}
