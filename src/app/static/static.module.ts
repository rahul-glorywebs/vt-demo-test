import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    AccessDeniedComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StaticModule { }
