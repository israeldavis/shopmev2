import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-categories-update',
  templateUrl: './categories-update.component.html',
  styleUrls: ['./categories-update.component.css']
})
export class CategoriesUpdateComponent implements OnInit {

  pageTitle = '';
  form: FormGroup;
  category: Category;
  categoryImage: File;
  listCategories: Category[] = [];

  public imagePath;
  imgURL: any;
  imageMessage: string;

  // messages for validations
  nameMessage: string;
  aliasMessage: string;

  private nameValidationMessages = {
    required: 'Please enter category name.',
    maxlength: 'Please enter category name at most 128 characters long.',
    minlength: 'Please enter category name at least 3 characters long.'
  }

  private aliasValidationMessages = {
    required: 'Please enter category alias.',
    maxlength: 'Please enter category alias at most 128 characters long.',
    minlength: 'Please enter category alias at least 3 characters long.'
  }

  constructor(private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: ModalService) {
    this.form = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.maxLength(128), Validators.minLength(3)]],
      'alias': ['', [Validators.required, Validators.maxLength(64), Validators.minLength(3)]],
      'parent': [this.listCategories[0]],
      'enabled': [''],
      'image': ['']
    });
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      params => {
        let id = params.get('id');
        if(id) {
          this.getCategory(+id);
          this.getListCategories();
        }
      }
    );

    const nameControl = this.form.get('name');
    nameControl.valueChanges.subscribe(
      value => this.setNameMessage(nameControl)
    );

    const aliasControl = this.form.get('alias');
    aliasControl.valueChanges.subscribe(
      value => this.setAliasMessage(aliasControl)
    );
  }

  setNameMessage(c: AbstractControl): void {
    this.nameMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.nameMessage = Object.keys(c.errors).map(
        key => this.nameMessage += this.nameValidationMessages[key]
      ).join(' ');
    }
  }

  setAliasMessage(c: AbstractControl): void {
    this.aliasMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.aliasMessage = Object.keys(c.errors).map(
        key => this.aliasMessage += this.aliasValidationMessages[key]
      ).join(' ');
    }
  }

  preview(files) {
    var fileSize = files[0].size;
    if(files.length === 0) {
      return;
    }

    if(fileSize > 1048576) {
      this.imageMessage = "You must choose an image less than 1MB!!!";
      return;
    } else {
      this.imageMessage = '';
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

  getCategory(id: number) {
    this.categoriesService.getCategory(id).subscribe(
      (category: Category) => {
        this.displayCategory(category);
      }
    );
  }

  getListCategories() {
    this.categoriesService.getListCategories().subscribe(
      response => {
        this.listCategories = response
      }
    )
  }

  displayCategory(category: Category): void {
    if(this.form) {
      this.form.reset();
    }

    this.category = category;
    console.log('Category in displayCategory: ', this.category);

    if(this.category.id === 0) {
      this.pageTitle = 'Create New Category';
    } else {
      this.pageTitle = `Edit Category: (ID: ${this.category.id})`
    }

    this.form.patchValue({
      name: this.category.name,
      alias: this.category.alias,
      enabled: this.category.enabled
    });
  }

  submit() {
    if(this.form.valid) {
      if(this.form.dirty) {
        const category = {...this.category, ...this.form.value};

        if(category.id == 0) {

          this.categoriesService.checkUnique(category.id, category.name, category.alias).subscribe(
            (response) => {
              console.log("Respuesta nameOrAliasDuplicated: ", response);
              if(!response) {
                this.modalService.abrirAlias();
                return;
              } else {
                const formData = this.categoriesService.createCategoryFormData(category, this.form.get('image').value);
                this.categoriesService.saveCategory(formData).subscribe({
                  next: (response) => {
                    this.onSaveComplete();
                  },
                  error: (errorResponse: HttpErrorResponse) => {
                    console.log(errorResponse)
                  }
                })
              }
            }
          )
        } else {

          this.categoriesService.checkUnique(category.id, category.name, category.alias).subscribe(
            (response) => {
              console.log("Repuesta check_unique: ", response);
              if(!response) {
                this.modalService.abrirAlias();
                return;
              } else {
                const formData = this.categoriesService.createCategoryFormData(category, this.form.get('image').value);
                this.categoriesService.updateCategory(formData).subscribe({
                  next: (response) => {
                    this.onUpdateComplete(category);
                  },
                  error: (errorResponse: HttpErrorResponse) => {
                    console.log(errorResponse);
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
    this.router.navigate(['/categories/list']);
  }

  onUpdateComplete(category: Category) {
    this.form.reset();
    var categoryName = category.name;
    this.router.navigate(['/categories/page/1'], {queryParams: {sortField: 'id', sortDir: 'asc', keyword: categoryName}});
  }

}
