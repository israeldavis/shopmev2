import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Brand } from 'src/app/model/brand.model';
import { Category } from 'src/app/model/category.model';
import { BrandsService } from 'src/app/services/brands.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-brands-update',
  templateUrl: './brands-update.component.html',
  styleUrls: ['./brands-update.component.css']
})
export class BrandsUpdateComponent implements OnInit {

  pageTitle = '';
  form: FormGroup;
  brand: Brand;
  profileImage: File;

  imagePath;
  imgURL: any;
  logoMessage: string;
  listCategories: Category[] = [];
  selectedCategories: string[] = [];

  //Mensajes para validaciones
  nameMessage: string;

  private nameValidationMessages = {
    required: "Please enter brand's name",
    maxlength: "Please enter brand's name at most 45 characters long.",
    minlength: "Please enter brand's name at least 2 characters long."
  }

  constructor(private formBuilder: FormBuilder,
              private brandsService: BrandsService,
              private categoriesService: CategoriesService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
      this.form = this.formBuilder.group({
        'name': ['', [Validators.minLength(2), Validators.maxLength(45), Validators.required]],
        'categories': [''],
        'logo': ['']
      });

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        let id = params.get('id');
        if(id) {
          this.getBrand(+id);
          this.getListCategories();
        }
      }
    );

    const nameControl = this.form.get('name');
    nameControl.valueChanges.subscribe(
      value => this.setNameMessage(nameControl)
    );

    const categoriesControl = this.form.get('categories');
    categoriesControl.valueChanges.subscribe(
      value => {
        console.log(value);
        this.selectedCategories = [];
        value?.forEach(element => {
          let catego = this.listCategories.find(cat => cat.id == element)
          console.log("Nombre de la categoria: " + catego?.name);
          this.selectedCategories.push(catego?.name.replace(/-/g, ""))
        });
      }
    )
  }

  setNameMessage(c: AbstractControl): void {
    this.nameMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.nameMessage = Object.keys(c.errors).map(
        key => this.nameMessage += this.nameValidationMessages[key]
      ).join(' ');
    }
  }

  preview(files) {
    var fileSize = files[0].size;
    if(files.length === 0) {
      return;
    }

    if(fileSize > 1048576) {
      this.logoMessage = "You must choose an image less than 1MB!!!";
      return;
    } else {
      this.logoMessage = "";
      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result
      }

      const file = files[0];
      this.form.get('logo').setValue(file);
    }
  }

  getBrand(id: number) {
    this.brandsService.getBrand(id).subscribe(
      (brand: Brand) => {
        this.displayBrand(brand)
      }
    )
  }

  getListCategories() {
    this.categoriesService.getListCategories().subscribe(
      response => {
        this.listCategories = response;
        this.settearCategories()
      }
    )
  }

  displayBrand(brand: Brand) {
    if(this.form) {
      this.form.reset();
    }

    this.brand = brand;
    console.log('Brand in displayBrand: ', this.brand);

    if(this.brand.id === 0 ) {
      this.pageTitle = 'Create New Brand';
    } else {
      this.pageTitle = `Edit Brand: (ID: ${this.brand.id})`
    }

    this.form.patchValue({
      name: this.brand.name
    });
  }

  submit() {
    if(this.form.valid) {
      if(this.form.dirty) {
        const brand = {...this.brand, ...this.form.value};

        if(brand.id == 0) {

          this.brandsService.checkUnique(brand.id, brand.name).subscribe(
            response => {
              console.log("Respuesta NameDuplicated: " + response);
              if(!response) {
                this.modalService.abrirBrandModal();
                return;
              } else {
                const formData = this.brandsService.createBrandFormData(brand, this.form.get('logo').value)
                this.brandsService.saveBrand(formData).subscribe({
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

          this.brandsService.checkUnique(brand.id, brand.name).subscribe(
            (response) => {
              console.log("Respuesta check_unique: " + response);
              if(!response) {
                this.modalService.abrirBrandModal();
                return;
              } else {
                const formData = this.brandsService.createBrandFormData(brand, this.form.get('logo').value);
                this.brandsService.updateBrand(formData).subscribe({
                  next: response => {
                    this.onUpdateComplete(response)
                  },
                  error: (errorResponse: HttpErrorResponse) => {
                    console.log(errorResponse)
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
    this.router.navigate(['/brands/list']);
  }

  onUpdateComplete(brand: Brand) {
    this.form.reset();
    this.router.navigate(['/brands/list']);
  }

  settearCategories() {

    var categoriesIds = [];

    this.brand.categories.forEach(element => {
      categoriesIds.push(element.id);
      this.selectedCategories.push(element.name);
    });

    this.form.get('categories').setValue(categoriesIds);
  }

}
