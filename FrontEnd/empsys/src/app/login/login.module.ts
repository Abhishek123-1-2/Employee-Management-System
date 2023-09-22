import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,LoginRoutingModule,ReactiveFormsModule,FormsModule
    
  ]
})
export class LoginModule { }
