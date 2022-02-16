import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-unique-name-dialog',
  templateUrl: './unique-name-dialog.component.html',
  styleUrls: ['./unique-name-dialog.component.css']
})
export class UniqueNameDialogComponent implements OnInit {

  @Input() id: number;

  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.modalService.cerrarAlias();
  }
}
