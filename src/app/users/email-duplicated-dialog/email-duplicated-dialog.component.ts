import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-email-duplicated-dialog',
  templateUrl: './email-duplicated-dialog.component.html',
  styleUrls: ['./email-duplicated-dialog.component.css']
})
export class EmailDuplicatedDialogComponent implements OnInit {

  @Input() email: string;

  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.modalService.cerrarModal();
  }

}
