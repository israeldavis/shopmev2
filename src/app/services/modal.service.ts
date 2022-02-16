import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  alias: boolean = false;
  modal: boolean = false;
  delete: boolean = false;
  brandModal: boolean = false;

  constructor() { }

  abrirBrandModal() {
    this.brandModal = true;
  }

  abrirModal() {
    this.modal = true;
  }

  abrirDelete() {
    this.delete = true;
  }

  abrirAlias() {
    this.alias = true;
  }

  cerrarBrandModal() {
    this.brandModal = false;
  }

  cerrarModal() {
    this.modal = false;
  }

  cerrarDelete() {
    this.delete = false;
  }

  cerrarAlias() {
    this.alias = false;
  }
}
