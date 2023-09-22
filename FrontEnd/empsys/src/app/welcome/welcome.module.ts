import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome.component';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,WelcomeRoutingModule,ReactiveFormsModule
  ]
})
export class WelcomeModule { }
