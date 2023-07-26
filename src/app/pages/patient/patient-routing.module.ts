import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientPageAccessGuard } from 'src/app/guards';
import { PatientComponent } from './patient.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PatientPageAccessGuard],
    component: PatientComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
