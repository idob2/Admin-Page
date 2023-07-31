import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableData } from '../interfaces/table.interface';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss']
})
export class TableRowComponent implements OnInit {

  @Input() rowData: ITableData = {};
  @Input() headerTitles: string[] = [];
  @Input() rowKey: string = "";
  @Output() dataSaved: EventEmitter<{ data: ITableData, id: string }> = new EventEmitter<{ data: ITableData, id: string }>();
  @Output() dataDeleted: EventEmitter<{id: string}> = new EventEmitter<{id: string}>();

  editMode: boolean = false;
  showConfirmation: boolean = false;
  deleted: boolean = false;
  ngOnInit(): void {
  }

  edit(): void {
    this.editMode = !this.editMode;  
  }

  delete(): void {
    this.showConfirmation = true;
  }

  confirmDelete(): void {
    this.dataDeleted.emit({ id: this.rowKey });
    this.showConfirmation = false;
    this.deleted = true;
  }

  cancelDelete(): void {
    this.showConfirmation = false;
  }

  save(): void{
    this.editMode = !this.editMode;
    this.dataSaved.emit({ data: this.rowData, id: this.rowKey });
  }

}
