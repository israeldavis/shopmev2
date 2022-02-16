import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() paginador: any;
  @Input() sortField: string;
  @Input() sortDir: string;
  @Input() keyword: string;
  @Input() entity: string;

  totalItems: number;
  startCount: number;
  endCount: number;
  totalPages: number;
  empty: boolean;
  currentPage: number;
  previous: number;
  next: number;
  paginas: number[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
        //console.log("Paginador: " + JSON.stringify(this.paginador));
        console.log("Sort Field: ",this.sortField);
        console.log("Sort Dir: ", this.sortDir);
        console.log("Keyword dentro de paginator: ", this.keyword);

        this.totalPages = this.paginador.totalPages

        this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);

        this.currentPage = this.paginador.number + 1;
        this.previous = this.paginador.number;
        this.next = this.paginador.number + 2;
        this.totalItems = this.paginador.totalElements;
        this.startCount = (this.currentPage - 1) * this.paginador.size + 1;
        this.endCount = this.startCount + this.paginador.size - 1;
        this.empty = this.paginador.empty;
        if(this.endCount > this.paginador.totalElements) {
          this.endCount = this.paginador.totalElements
        }
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

  }

}
