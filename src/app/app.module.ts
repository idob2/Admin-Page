import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { TableRowComponent } from './table-row/table-row.component';
import { FormsModule } from '@angular/forms';
import { CloudinaryModule } from '@cloudinary/ng';


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TableRowComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CloudinaryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
