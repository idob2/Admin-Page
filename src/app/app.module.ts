import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { TableRowComponent } from './table-row/table-row.component';
import { FormsModule } from '@angular/forms';
import { CloudinaryModule } from '@cloudinary/ng';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './service/authGuard';

const appRoutes: Routes = [
  { path: 'admin-table', component: TableComponent, canActivate: [AuthGuard]  },
  { path: 'login-page', component: LoginComponent},
  { path: '', redirectTo: 'login-page', pathMatch: 'full' },
];
@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TableRowComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CloudinaryModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/admin' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
