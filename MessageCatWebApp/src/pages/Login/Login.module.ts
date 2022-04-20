import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LoginComponent } from './Login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [LoginComponent]
})
export class LoginModule { }
