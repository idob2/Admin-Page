import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ITableData, IDropdownOption } from '../interfaces/table.interface';
import { uploadService } from '../service/cloudinaryService';
import { Subscription } from 'rxjs';

@Component({
  selector: '[appTableRow]',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss'],
})
export class TableRowComponent implements OnInit {
  @Input() rowData: ITableData = {};
  @Input() headerTitles: string[] = [];
  @Input() rowKey: string = '';
  @Input() dropdownOptions: { [headerTitle: string]: IDropdownOption[] } = {};
  @Input() isEditing: boolean = false;
  @Output() dataSaved: EventEmitter<{ data: ITableData; id: string }> =
    new EventEmitter<{ data: ITableData; id: string }>();
  @Output() dataDeleted: EventEmitter<{ id: string }> = new EventEmitter<{
    id: string;
  }>();
  @Output() requestDropdownOptions: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() editModeToggled: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  rowDataHolder: ITableData = {};
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  editMode: boolean = false;
  showConfirmation: boolean = false;
  deleted: boolean = false;
  isExpanded: boolean = false;
  numbers: number[] = [];

  ngOnInit(): void {
    this.imageUrl = String(this.rowData['image']);
    this.rowDataHolder = this.deepCopy(this.rowData);
    for (let i = 0; i <= 500; i++) {
      this.numbers.push(i);
    };
  }

  edit(): void {
    this.editMode = true;
    this.editModeToggled.emit(true);

    if (this.editMode) {
      this.requestDropdownOptions.emit();
    }
  }
  cancelEdit(): void {
    this.editMode = false;
    this.editModeToggled.emit(false);
    this.rowData = this.deepCopy(this.rowDataHolder);
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

  async save() {
    this.editMode = false;
    this.editModeToggled.emit(false);
    if (this.selectedFile) {
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
      if (this.selectedFile) {
        const result = await uploadService.uploadImg(this.selectedFile);
        return result['secure_url'];
      }
      return;
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
  shouldBeInput(headerTitle: string) {
    return ![
      'restaurants_names',
      '_id',
      'dishes_names',
      'restaurant_name',
      'chef_name',
    ].includes(headerTitle.toLowerCase());
  }
  shouldShowMultiSelectDropdown(headerTitle: string) {
    return ['restaurants', 'dishes'].includes(headerTitle.toLowerCase());
  }
  shouldShowOneSelectDropdown(headerTitle: string) {
    return ['chef', 'restaurant', 'tags', 'ranking'].includes(headerTitle.toLowerCase());
  }
  expand() {
    this.isExpanded = !this.isExpanded;
  }

  deepCopy(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepCopy(item));
    }

    const copy: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = this.deepCopy(obj[key]);
      }
    }
    return copy;
  }
  
}

