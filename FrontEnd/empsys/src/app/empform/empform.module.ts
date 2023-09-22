import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpformComponent } from './empform.component';
import { EmpFormRoutingModule } from './empform-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EmpformComponent],
  imports: [
    CommonModule,EmpFormRoutingModule,ReactiveFormsModule
  ],providers:[],
  bootstrap:[EmpformComponent]
})
export class EmpformModule { }
