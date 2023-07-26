import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const ChangePasswordGuard = () => {
  const router = inject(Router);
  const isUserLoginFirstTime = localStorage.getItem("vt-demo-isUserLoginFirstTime");
  if (isUserLoginFirstTime && isUserLoginFirstTime === "1") {
    return true;
  }
  // Redirect to the login page
  return router.parseUrl('/auth/login');
};