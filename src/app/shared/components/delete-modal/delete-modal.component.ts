import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  @Input() id: number;
  @Input() nombre: string;
  @Input() confirmationText: string;
  @Input() entity: string;

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
