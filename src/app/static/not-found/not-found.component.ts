import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit{

  private backUrl: string;
  constructor(private router: Router) {}

  ngOnInit(): void {
    const isAuthenticated = sessionStorage.length

    if (isAuthenticated !== 0) {
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
    } else {
      this.backUrl = "/auth/login"
    }
  }

  goBack() {
    this.router.navigate([this.backUrl]);
  }

}
