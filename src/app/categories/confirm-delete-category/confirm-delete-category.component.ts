import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-confirm-delete-category',
  templateUrl: './confirm-delete-category.component.html',
  styleUrls: ['./confirm-delete-category.component.css']
})
export class ConfirmDeleteCategoryComponent implements OnInit {

  @Input() id: number;
  @Input() nombre: string;
  @Output() notificar: EventEmitter<number> = new EventEmitter<number>();

  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.modalService.cerrarDelete();
  }

  borrarEmit() {
    this.cerrarModal();

    this.notificar.emit(this.id);
  }

}
