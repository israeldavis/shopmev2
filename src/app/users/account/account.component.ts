import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  pageTitle = 'Yout Account Details';

  form: FormGroup;
  rolesData: string = '';
  user: User;

  profileImage: File;

  public imagePath;
  imgURL: any;
  photoMessage: string;

  // mensajes parar validaciones
  firstNameMessage: string;
  lastNameMessage: string;
  confirmPasswordMessage: string;

  private firstNameValidationMessages = {
    required: 'Please enter your first name.',
    minlength: 'Please enter first name at least 2 characters long.',
    maxlength: 'Please enter first name at most 45 characters long.'
  }

  private lastNameValidationMessages = {
    required: 'Please enter your last name.',
    minlength: 'Please enter last name at least 2 characters long.',
    maxlength: 'Please enter last name at most 45 characters long.'
  }

  constructor(private formBuilder: FormBuilder,
              private usersService: UsersService,
              private route: ActivatedRoute,
              private router: Router) {

        this.form = this.formBuilder.group({
          'email': ['', [Validators.minLength(8), Validators.maxLength(128), Validators.required]],
          'firstName': ['', [Validators.minLength(2), Validators.maxLength(45), Validators.required]],
          'lastName': ['', [Validators.minLength(2), Validators.maxLength(45), Validators.required]],
          'password': ['', [Validators.minLength(2), Validators.maxLength(45)]],
          'confirmPassword': ['', [Validators.minLength(2), Validators.maxLength(45)]],
          'image': ['']
        });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        let id = params.get('id');
        if(id) {
          this.getUser(+id);
        }
      }
    );

    this.form.get('password').valueChanges.subscribe(
      value => console.log("Password ingresado: ", value)
    );

    const confirmPasswordControl = this.form.get('confirmPassword');
    this.form.get('confirmPassword').valueChanges.subscribe(
      value => this.setConfirmPasswordMessage(confirmPasswordControl)
    );

    const firstNameControl = this.form.get('firstName');
      firstNameControl.valueChanges.subscribe(
        value => this.setFirstNameMessage(firstNameControl)
    );

    const lastNameControl = this.form.get('lastName');
      lastNameControl.valueChanges.subscribe(
        value => this.setLastNameMessage(lastNameControl)
    );
  }

  setConfirmPasswordMessage(c: AbstractControl): void {
    this.confirmPasswordMessage = '';
    if(c.touched || c.dirty) {
      const passwordControl = this.form.get('password');
      if(c.value != passwordControl.value) {
        this.confirmPasswordMessage = 'Passwords do not match!';
      }
    }
  }

  setLastNameMessage(c: AbstractControl): void {
    this.lastNameMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.lastNameMessage = Object.keys(c.errors).map(
        key => this.lastNameMessage += this.lastNameValidationMessages[key]
      ).join(' ');
    }
  }

  setFirstNameMessage(c: AbstractControl): void {
    this.firstNameMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.firstNameMessage = Object.keys(c.errors).map(
        key => this.firstNameMessage += this.firstNameValidationMessages[key]
      ).join(' ');
    }
  }

  getUser(id: number) {
    this.usersService.getUserAccount(id).subscribe(
      (user: User) => {
        this.displayUser(user);
      }
    );
  }

  displayUser(user: User): void {
    if(this.form) {
      this.form.reset();
    }

    this.user = user;
    console.log("User en display User: ", this.user);

    //var userRoles = '';
     this.user.roles.forEach(element => {
      this.rolesData += element.name + " ";
    });
    this.rolesData = this.rolesData.trim();

    this.form.patchValue({
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
  }

  submit() {

    if(this.form.valid) {
      if(this.form.dirty) {
        const usr = {...this.user, ...this.form.value};

        const formData = this.usersService.createUserFormData(usr, this.form.get('image').value);
        this.usersService.updateAccount(formData).subscribe({
          next: (response) => {
            this.onUpdateComplete(usr);
          },
          error: (errorResponse: HttpErrorResponse) => {

          }
        });
      }
    }
  }

  onUpdateComplete(usr: User) {
    this.form.reset();
    var firstPartOfEmail = usr.email.split('@')[0];
    //this.router.navigate(['/users/account/', usr.id]);
    this.getUser(usr.id);
  }

  preview(files) {
    var fileSize = files[0].size;
    if(files.length === 0)
      return;

    if(fileSize > 1048576) {
      this.photoMessage = "You must choose an image less than 1MB!!!";
      return;
    } else {
      this.photoMessage = "";
      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result
      }

      const file = files[0];
      this.form.get('image').setValue(file);

    }
  }
}
