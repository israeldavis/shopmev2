import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  queryForm:  FormGroup;

  listUsers: User[] = [];
  usuarioSeleccionado: User;
  pageNum: number;
  paginador: any;
  sortField: string;
  sortDir: string;
  reverseSortDir: string;
  keyword: string;

  constructor(private formBuilder: FormBuilder,
              private usersService: UsersService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
      this.queryForm = this.formBuilder.group({
         'keyword': [''],
         'sortField': [''],
         'sortDir': ['']
      })
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(
      (params) => {
        this.sortField = params.get('sortField') ? params.get('sortField') : 'firstName';
        this.sortDir = params.get('sortDir') ? params.get('sortDir') : 'asc';
        this.reverseSortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        this.keyword = params.get('keyword') ? params.get('keyword') : '';
        if(this.keyword == ''){
          if(!this.queryForm.value.keyword){
            this.keyword = this.queryForm.value.keyword;
          }
        }

        console.log("keyword: ", this.keyword);

        this.route.paramMap.subscribe(
          params => {
            let pageNum = params.get('pageNum');
            console.log('pageNum: ', pageNum);
            if(pageNum) {
              this.pageNum = +pageNum;
              this.getUsersByPage(+pageNum, this.sortField, this.sortDir, this.keyword);
            } else {
              this.getUsersByPage(1, this.sortField, this.sortDir, this.keyword);
            }
          }
        )
      }
    )
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      res => {
        this.listUsers = res.content;
        console.log("Todos los usuarios: ", this.listUsers);
      }
    )
  }

  getUsersByPage(pageNum: number, sortField: string, sortDir: string, keyword: string) {
    this.usersService.getUsersByPage(pageNum, sortField, sortDir, keyword).subscribe(
      res => {
        this.listUsers = res.content;
        this.paginador = res;

        console.log("Todos los usuarios: ", this.listUsers);
      }
    )
  }

  abrirModal(usuario: User) {
    this.usuarioSeleccionado = usuario;
    this.modalService.abrirDelete();
  }

  borrar(id: number) {
    this.usersService.deleteUser(id).subscribe(
      respuesta => {
        this.getUsers();
        this.router.navigate(['/users/list']);
      }
    )
  }

  updateEnabledStatus(id: number, status: boolean) {
    this.usersService.updateUserEnabledStatus(id, status).subscribe(
      respuesta => {
        this.getUsers();
        this.router.navigate(['/users/list']);
      }
    )
  }

  search() {
    console.log("Dentro de search: ", this.queryForm.value.keyword);
    if(this.queryForm.value.keyword !== ''){
      this.keyword = this.queryForm.value.keyword;
      this.router.navigate(['/users/page/1'],
            {queryParams: {sortField: this.sortField, sortDir: this.sortDir, keyword: this.keyword} });
    } else {
      this.router.navigate(['/users/page/1'],
            {queryParams: {sortField: this.sortField, sortDir: this.sortDir} });
    }
  }

  reset() {
    console.log("Dentro de reset");
    this.router.navigate(['/users/page/1'],
            {queryParams: {sortField: this.sortField, sortDir: this.sortDir} });
  }

  exportCsv() {
    this.usersService.exportCsv().subscribe(
      data => this.downloadFile(data, 'text/csv'),
      error => {
        console.log("Error downloading the file.", error);
      },
      () => console.info('OK')
    )
  }

  exportExcel() {
    this.usersService.exportExcel().subscribe(
      data => this.downloadFile(data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
      error => {
        console.log("Error downloading the file.", error);
      },
      () => console.info('OK')
    )
  }

  exportPDF() {
    this.usersService.exportPDF().subscribe(
      data => this.downloadFile(data, "application/pdf"),
      error => console.log("Error downloading the file.", error),
      () => console.info("OK")
    )
  }

  downloadFile(data: any, type: string) {

    var fileName = this.buildFileName();

    const blob = new Blob([data], {type: type});
    const url = window.URL.createObjectURL(blob);
    //window.open(url);
    saveAs(blob, fileName);
  }

  buildFileName(): string {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth();
    var formatedMonth = '';
    if(month<10) {
      formatedMonth = '0' + (month+1);
    } else {
      formatedMonth = '' + (month + 1);
    }
    var day = date.getDate();
    var formatedDay = '';
    if(day < 10) {
      formatedDay = '0' + day;
    } else {
      formatedDay = '' +day;
    }

    var hour = date.getHours();
    var formatedHour = '';
    if(hour < 10) {
      formatedHour = '0' + hour;
    } else {
      formatedHour = '' + hour;
    }
    var min = date.getMinutes();
    var formatedMinute = '';
    if(min < 10) {
      formatedMinute = '0' + min;
    } else {
      formatedMinute = '' + min;
    }
    var sec = date.getSeconds();
    var formatedSecond = '';
    if(sec < 10) {
      formatedSecond = '0' + sec;
    } else {
      formatedSecond = '' + sec;
    }

    return 'employees_' + year + '_' + formatedMonth + '_' + formatedDay +
                    '_' + formatedHour + '_' + formatedMinute + "_" + sec;
  }

}
