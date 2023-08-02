import { Component, Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableData } from '../interfaces/table.interface';
import { uploadService } from '../service/cloudinaryService';

@Component({
  selector: '[appTableRow]',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss'],
})

export class TableRowComponent implements OnInit {

  @Input() rowData: ITableData = {};
  @Input() headerTitles: string[] = [];
  @Input() rowKey: string = "";
  @Output() dataSaved: EventEmitter<{ data: ITableData, id: string }> = new EventEmitter<{ data: ITableData, id: string }>();
  @Output() dataDeleted: EventEmitter<{id: string}> = new EventEmitter<{id: string}>();
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  editMode: boolean = false;
  showConfirmation: boolean = false;
  deleted: boolean = false;

  ngOnInit(): void {
    this.imageUrl = String(this.rowData['image']);
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

  async save(){
    this.editMode = !this.editMode;
    if(this.selectedFile){
      this.rowData['image'] = await this.uploadImage();
    }
    this.dataSaved.emit({ data: this.rowData, id: this.rowKey });
  }

  async onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }


  async uploadImage() {
    try {
      if(this.selectedFile){
        const result = await uploadService.uploadImg(this.selectedFile);
        return result['secure_url'];
      }
      return;
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

}
