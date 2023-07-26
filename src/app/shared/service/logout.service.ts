import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutRequestPayload } from 'src/app/@types';
import { setThemColor } from '../util';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private router: Router, private authService: AuthService, private snackbarService: SnackbarService) { }

  logoutUser(requestPayload: LogoutRequestPayload) {
    this.authService.logOut(requestPayload).subscribe({
      next: (data) => {
        if (data) {
          sessionStorage.clear();
          const vtDemoLocalStorage = Object.keys(localStorage);
          vtDemoLocalStorage.forEach((e) => {
            if (e.includes("vt-demo")) {
              localStorage.removeItem(e);
            }
          });
          this.router.navigate(['/auth']).then(() => {
            setThemColor(1);
            this.snackbarService.openSnackBar(data.message, "Close", "success-snackbar")
          });
        }
      },
      error: (error) => {
        console.log(error);
        this.snackbarService.openSnackBar(error.error.errorMessage, "Close", "error-snackbar");
        this.router.navigate(['/auth']).then(() => {
          setThemColor(1);
          sessionStorage.clear();
          const vtDemoLocalStorage = Object.keys(localStorage);
          vtDemoLocalStorage.forEach((e) => {
            if (e.includes("vt-demo")) {
              localStorage.removeItem(e);
            }
          });
        });
      }
    })
  }
}
