import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {

  private backUrl: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    const isMultiTenantUser = localStorage.getItem("vt-demo-isMultiTenantUser");
    const userType = localStorage.getItem("vt-demo-userType");
    if (isMultiTenantUser) {
      if (isMultiTenantUser === "0") {
        this.backUrl = "/patients";
      } else if (isMultiTenantUser === "1") {
        this.backUrl = "/tenant-users";
      }
    } else if (userType) {
      if (userType === "Patient") {
        this.backUrl = "/dashboard";
      }
    }
  }

  goBack() {
    this.router.navigate([this.backUrl]);
  }

}
