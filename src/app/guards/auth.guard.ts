import { inject } from "@angular/core";
import { Router } from "@angular/router";


export const AuthGuard = () => {
  const router = inject(Router);
  const isAuthenticated = sessionStorage.length
  if (isAuthenticated) {
    return true;
  }
  // Redirect to the login page
  return router.parseUrl('/auth/login');
};