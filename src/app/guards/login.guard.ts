import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const LoginGuard = () => {
  const router = inject(Router);
  const isUserAuthenticated = localStorage.getItem("vt-demo-isUserLogin");
  const isLocalStorageNotEmpty = localStorage.length;
  const isSessionStorageNotEmpty = sessionStorage.length;
  const previousVisitedUrl = localStorage.getItem("vt-demo-previousVisitedUrl");
  if (isUserAuthenticated && isUserAuthenticated === "1" && isLocalStorageNotEmpty && isSessionStorageNotEmpty && previousVisitedUrl) {
    // Redirect to the last visited page
    return router.parseUrl(previousVisitedUrl);
  }
  return true;
};