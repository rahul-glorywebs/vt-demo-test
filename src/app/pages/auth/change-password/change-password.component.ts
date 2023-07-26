import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { ChangePasswordRqPayload, UserLogin } from 'src/app/@types';
import { AuthService, SnackbarService } from 'src/app/shared/service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {

  public changePasswordForm: FormGroup;
  public isLoading: boolean = false;
  public isPasswordMatch: boolean = false;
  private loginResponseData: UserLogin;
  private email: string;
  private state$: any;
  @ViewChild('confirmPasswordInput', { read: ElementRef }) private confirmPasswordInput: ElementRef;
  @ViewChild('passwordInput', { read: ElementRef }) private passwordInput: ElementRef;

  constructor(private formBuilder: FormBuilder, private router: Router, private snackbarService: SnackbarService,
    private authService: AuthService, private location: Location) {
    this.state$ = this.location.getState();
    if (this.state$) {
      this.loginResponseData = this.state$.loginResponseData;
      this.email = this.state$.emailId;
    } else {
      this.router.navigate(["/auth"]);
    }
  }

  ngOnInit(): void {
    this.formInit();
  }

  ngAfterViewInit(): void {
    const passwordInputValue: any = fromEvent<any>(this.passwordInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged()
    );

    passwordInputValue.subscribe((value: string) => {
      const confirmPassword = this.changePasswordForm.controls["confirmPassword"].value;
      if (confirmPassword === value) {
        this.isPasswordMatch = true;
      } else {
        this.isPasswordMatch = false;
      }
    });

    const confirmPasswordInputValue: any = fromEvent<any>(this.confirmPasswordInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged()
    );

    confirmPasswordInputValue.subscribe((value: string) => {
      const password = this.changePasswordForm.controls["password"].value;
      if (password === value) {
        this.isPasswordMatch = true;
      } else {
        this.isPasswordMatch = false;
      }
    });
  }

  formInit() {
    this.changePasswordForm = this.formBuilder.group({
      password: ["", [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%#?&\[])[A-Za-z\d$@$!%*#?&\[\]]{8,}$/),
        Validators.minLength(8),
      ]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  updatePassword() {
    this.isLoading = true;
    if (this.changePasswordForm.valid && this.isPasswordMatch) {
      const tenantUserLoginInfo = this.loginResponseData.loginResponse[0];
      const businessKey = this.loginResponseData?.businessKey;
      let emailId;
      if (tenantUserLoginInfo) {
        emailId = tenantUserLoginInfo.emailId;
      } else {
        emailId = this.email;
      }
      const newPassword = this.changePasswordForm.controls["password"].value;
      if (businessKey && emailId && newPassword) {
        const requestPayload: ChangePasswordRqPayload = {
          businessKey: businessKey,
          email: emailId,
          newPassword: newPassword
        }
        this.authService.changePassword(requestPayload).subscribe({
          next: (data) => {
            this.isLoading = false;
            if (data.status) {
              this.snackbarService.openSnackBar(data.status, "Close", "success-snackbar");
              this.router.navigate(['/auth/login']).then(() => {
                localStorage.clear();
                sessionStorage.clear();
              })
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.log(error);
            this.snackbarService.openSnackBar(error.error.errorMessage, "Close", "error-snackbar")
          }
        });
      }
    } else {
      this.changePasswordForm.markAllAsTouched();
      this.changePasswordForm.markAsDirty();
      this.changePasswordForm.updateValueAndValidity();
    }
  }
}
