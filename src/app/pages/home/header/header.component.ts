import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntryEntity, LogoutRequestPayload, SessionStorageData } from 'src/app/@types';
import { LogoutService } from 'src/app/shared/service';
import { convertBirthDateInAge, getDataFromSessionStorage, getPersonName } from 'src/app/shared/util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

  public loginUserName: string = "";
  public facilityName: string | undefined = "";
  private sessionStorageData: SessionStorageData;
  public patientName: string;
  public dob: string;
  public gender: string;
  public age: string;

  @Input('selectedPatient') patient: EntryEntity | null;

  public isMultiTenantUser: boolean = false;
  public isLoginUserPractitioner: boolean = false;

  constructor(private router: Router, private logoutService: LogoutService) { }

  ngOnInit(): void {
    this.sessionStorageData = getDataFromSessionStorage();
    const loginUserName = this.sessionStorageData.tenantUserLoginInfo?.firstName + " " + this.sessionStorageData.tenantUserLoginInfo?.lastName;
    this.loginUserName = loginUserName;
    this.facilityName = this.sessionStorageData.tenantUserLoginInfo?.tenantName;

    if (this.patient) {
      this.patientName = getPersonName(this.patient.resource);
      this.gender = this.patient.resource.gender;
      this.dob = this.patient.resource.birthDate;
      this.age = convertBirthDateInAge(this.patient.resource.birthDate);
    } else {
      this.patient = this.sessionStorageData.patient;
      if (this.patient) {
        this.patientName = getPersonName(this.patient.resource);
        this.gender = this.patient.resource.gender;
        this.dob = this.patient.resource.birthDate;
        this.age = convertBirthDateInAge(this.patient.resource.birthDate);
      }
    }

    const multiTenantUser = localStorage.getItem("vt-demo-isMultiTenantUser");
    if (multiTenantUser === "1") {
      this.isMultiTenantUser = true;
    } else {
      this.isMultiTenantUser = false;
    }

    const userType = localStorage.getItem("vt-demo-userType");
    if (userType === "Practitioner") {
      this.isLoginUserPractitioner = true;
    } else {
      this.isLoginUserPractitioner = false;
    }
  }

  ngOnChanges() {
  }

  chooseNewFacility() {
    if (this.isMultiTenantUser) {
      this.router.navigate(['/tenant-users']).then(() => {
        localStorage.setItem("vt-demo-previousVisitedUrl", "/tenant-users")
      });
    }
  }

  chooseNewPatient() {
    if (this.isMultiTenantUser || this.isLoginUserPractitioner) {
      this.router.navigate(['/patients']).then(() => {
        localStorage.setItem("vt-demo-previousVisitedUrl", "/patients")
      });
    }
  }

  logout() {
    const key = this.sessionStorageData.businessAndProcessDetails?.businessKey;
    if (key) {
      const requestPayload: LogoutRequestPayload = {
        businessKey: key
      }
      this.logoutService.logoutUser(requestPayload);

    }
  }
}
