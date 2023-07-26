import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacilityPageAccessGuard } from 'src/app/guards';
import { TenantUsersComponent } from './tenant-users.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [FacilityPageAccessGuard],
    component: TenantUsersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantUsersRoutingModule { }
