import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ITableData, IDropdownOption } from '../interfaces/table.interface';
import { uploadService } from '../service/cloudinaryService';

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
  expandedStates: Map<string, boolean> = new Map();
  showTooltip = false;

  ngOnInit(): void {
    this.imageUrl = String(this.rowData['image']);
    this.rowDataHolder = this.deepCopy(this.rowData);
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
      this.imageUrl = URL.createObjectURL(this.selectedFile);
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
  expand(element: EventTarget | null, identifier: string) {
    if (element instanceof HTMLElement) {
      const currentHeight = element.clientHeight;
      const scrollHeight = element.scrollHeight;
  
      const isCurrentlyExpanded = this.expandedStates.get(identifier) || false;
  
      if ((scrollHeight > currentHeight && !isCurrentlyExpanded) || isCurrentlyExpanded) {
        this.expandedStates.set(identifier, !isCurrentlyExpanded);
      }
    }
  }
  
  
  isElementExpanded(identifier: string): boolean {
    return this.expandedStates.get(identifier) || false;
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

