import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlDirective, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-update',
  templateUrl: './users-update.component.html',
  styleUrls: ['./users-update.component.css']
})
export class UsersUpdateComponent implements OnInit {

  pageTitle = '';
  form: FormGroup;
  rolesData = [];
  user: User;
  profileImage: File;

  public imagePath;
  imgURL: any;
  photoMessage: string;
  isEditing: boolean = false;

  // mensajes para validaciones
  emailMessage: string;
  firstNameMessage: string;
  lastNameMessage: string;

  private emailValidationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
    maxlength: 'Please enter email at most 128 characters long.'
  }

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
              private router: Router,
              private modalService: ModalService) {
    this.form = this.formBuilder.group({
      'email': ['', [Validators.minLength(8), Validators.maxLength(128), Validators.required]],
      'firstName': ['', [Validators.minLength(2), Validators.maxLength(45), Validators.required]],
      'lastName': ['', [Validators.minLength(2), Validators.maxLength(45), Validators.required]],
      'password': ['', [Validators.minLength(2), Validators.maxLength(45)]],
      'enabled': '',
      'image': [''],
      'roles': new FormArray([])
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

    const emailControl = this.form.get('email');
    emailControl.valueChanges.subscribe(
      value => this.setEmailMessage(emailControl)
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

  setEmailMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.emailValidationMessages[key]
      ).join(' ');
    }
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

  getUser(id: number) {
    this.usersService.getUser(id).subscribe(
      (user: User) => {
        this.displayUser(user);
        this.getRoles();
      }
    );
  }

  displayUser(user: User): void {
    if(this.form) {
      this.form.reset();
    }

    this.user = user;
    console.log("User en display User: ", this.user);

    if(this.user.id == 0) {
      this.pageTitle = 'Create New User';
    } else {
      this.pageTitle = `Edit User: (ID: ${this.user.id})`;
      //this.imgURL = this.usersService.getProfileImage(user.id, user.photos);
    }

    this.form.patchValue({
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      enabled: this.user.enabled
    });
  }

  getRoles() {
    this.usersService.getRoles().subscribe(
      roles => {
        this.rolesData = roles;
        this.addCheckboxes();
      }
    );
  }

  get rolesFormArray() {
    return this.form.controls["roles"] as FormArray;
  }

  private addCheckboxes() {
    const userRoles = this.user.roles;
    this.rolesData.forEach((elemento, index) =>{

      let coinciden = false;

      for (let d = 0; d < userRoles.length; d++) {
        if(elemento.id == userRoles[d].id){
          coinciden = true;
          break;
        }
      }

      if(coinciden) {
        this.rolesFormArray.push(new FormControl(true))
      } else {
        this.rolesFormArray.push(new FormControl(false))
      }
    });
  }

  submit() {
    const selectedRoleIds = this.form.value.roles
          .map((checked, i) => checked ?  this.rolesData[i] : null)
          .filter(v => v !== null);

          console.log(selectedRoleIds);

          if(this.form.valid) {
            if(this.form.dirty) {
              const usr = {...this.user, ...this.form.value};
              usr.roles = selectedRoleIds;

              if(usr.id == 0) {

                this.usersService.checkDuplicateEmail(usr.id, this.form.value.email).subscribe(
                  (response) => {
                    console.log("Respuesta duplicated_email: ", response);
                    if(!response) {
                      this.modalService.abrirModal();
                      return;
                    } else {
                      const formData = this.usersService.createUserFormData(usr, this.form.get('image').value);
                      this.usersService.saveUser(formData).subscribe({
                        next: (response) => {
                          this.onSaveComplete();
                        },
                        error: (errorResponse: HttpErrorResponse) => {

                        }
                      });
                    }
                  }
                )
              } else {

                this.usersService.checkDuplicateEmail(usr.id, this.form.value.email).subscribe(
                  (response) => {
                    console.log("Respuesta duplicated_email: ", response);
                    if(!response) {
                      this.modalService.abrirModal();
                      return;
                    } else {
                      const formData = this.usersService.createUserFormData(usr, this.form.get('image').value);
                      this.usersService.updateUser(formData).subscribe({
                        next: (response) => {
                          this.onUpdateComplete(usr);
                        },
                        error: (errorResponse: HttpErrorResponse) => {

                        }
                      });
                    }
                  }
                )
              }
            }
          }
  }

  onSaveComplete() {
    this.form.reset();
    this.router.navigate(['/users/list']);
  }

  onUpdateComplete(usr: User) {
    this.form.reset();
    var firstPartOfEmail = usr.email.split('@')[0];
    this.router.navigate(['/users/page/1'], {queryParams: {sortField: 'id', sortDir: 'asc', keyword: firstPartOfEmail} });
  }
}
