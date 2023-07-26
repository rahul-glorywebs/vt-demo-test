import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { BusinessAndProcessDetails, EntryEntity, LoginRequestPayload, LogoutRequestPayload, UserLogin } from 'src/app/@types';
import { AuthService, LogoutService, PatientService, SnackbarService } from 'src/app/shared/service';
import { setThemColor } from 'src/app/shared/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public isLoading: boolean = false;
  private unSubscriber: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,
    private patientService: PatientService, private snackbarService: SnackbarService, private logoutService: LogoutService) { }

  ngOnInit(): void {
    history.pushState(null, '');
    this.formInit();

    fromEvent(window, 'popstate')
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((_) => {
        history.pushState(null, '');
      });
  }

  formInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  logIn() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const requestPayload: LoginRequestPayload = this.loginForm.value;
      let userLogin: any = {}
      this.authService.login(requestPayload).pipe(first()).subscribe({
        next: (data: UserLogin) => {
          if (data.userLoginStatus) {
            this.isLoading = false;
            if (data.userMustChangePassword === "Yes") {
              localStorage.setItem("vt-demo-isUserLoginFirstTime", "1");
              this.router.navigateByUrl("/auth/change-password", { state: { loginResponseData: data, emailId: requestPayload.username } }).then(() => {
                localStorage.setItem("vt-demo-previousVisitedUrl", "/auth/change-password");
              });
              return;
            }
            this.loginForm.reset();
            localStorage.setItem("vt-demo-isUserLogin", "1");

            // set businessAndProcessDetails in object and storing in session storage  start //
            const businessAndProcessDetails: BusinessAndProcessDetails = {
              businessKey: data.businessKey,
              processDefinitionId: data.processDefinitionId,
              processId: data.processId,
              userEmail: requestPayload.username
            }
            sessionStorage.setItem("businessAndProcessDetails", JSON.stringify(businessAndProcessDetails));
            // set businessAndProcessDetails in object and storing in session storage end //

            if (data.loginResponse.length === 1) {
              sessionStorage.setItem("tenantUserLoginInfo", JSON.stringify(data.loginResponse[0]));
              localStorage.setItem("vt-demo-isMultiTenantUser", "0");
              this.afterUserLogin(data, data.userLoginStatus);
            } else if (data.loginResponse.length > 1) {
              userLogin['status'] = data.userLoginStatus;
              userLogin['userLoginResponse'] = data.userLoginResponse;
              userLogin['data'] = data.loginResponse;
              userLogin['userMustChangePassword'] = data.userMustChangePassword;
              sessionStorage.setItem("tenantUserList", JSON.stringify(userLogin));
              localStorage.setItem("vt-demo-isMultiTenantUser", "1");
              this.showTenantPicker();
            }
            setInterval(() => {
              this.logoutAfterSessionExpire(businessAndProcessDetails);
            }, 2 * 60 * 60 * 1000)
          }
        },
        error: (error) => {
          this.isLoading = false;
          localStorage.setItem("vt-demo-isUserLogin", "");
          console.log(error);
          this.snackbarService.openSnackBar(error.error.userLoginResponse, "Close", "error-snackbar")
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginForm.updateValueAndValidity();
    }
  }

  showTenantPicker() {
    this.router.navigate(['/tenant-users']).then(() => {
      localStorage.setItem("vt-demo-previousVisitedUrl", "/tenant-users");
      setThemColor(1);
    });
  }

  afterUserLogin(data: UserLogin, status: boolean) {
    if (status) {
      if (data.loginResponse[0].userType === 'Practitioner') {
        localStorage.setItem("vt-demo-userType", "Practitioner");
        sessionStorage.setItem("userAllMenuAccessResponse2", JSON.stringify(data.userAllMenuAccessResponse2));
        this.router.navigate(['/patients']).then(() => {
          localStorage.setItem("vt-demo-previousVisitedUrl", "/patients");
          setThemColor(data.loginResponse[0].themeId);
        });
      } else {
        localStorage.removeItem("isMultiTenantUser");
        localStorage.setItem("vt-demo-userType", "Patient");
        sessionStorage.setItem("userAllMenuAccessResponse2", JSON.stringify(data.userAllMenuAccessResponse2));
        const patient: EntryEntity = {
          fullUrl: "",
          resource: JSON.parse(data.loginResponse[0].userJson),
          search: {
            mode: ""
          }
        }
        sessionStorage.setItem("patient", JSON.stringify(patient));
        this.router.navigateByUrl('/dashboard', { state: { patient: patient } }).then(() => {
          localStorage.setItem("vt-demo-previousVisitedUrl", "/dashboard");
          setThemColor(data.loginResponse[0].themeId);
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }

  logoutAfterSessionExpire(businessAndProcessDetails: BusinessAndProcessDetails) {
    const key = businessAndProcessDetails.businessKey;
    if (key) {
      const requestPayload: LogoutRequestPayload = {
        businessKey: key
      }
      this.logoutService.logoutUser(requestPayload);
    }
  }
}
