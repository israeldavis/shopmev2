import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-unique-brand-name-dialog',
  templateUrl: './unique-brand-name-dialog.component.html',
  styleUrls: ['./unique-brand-name-dialog.component.css']
})
export class UniqueBrandNameDialogComponent implements OnInit {

  @Input() name: string;

  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.modalService.cerrarBrandModal()
  }

}
