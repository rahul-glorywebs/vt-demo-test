import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const FacilityPageAccessGuard = () => {
  const router = inject(Router);
  const isMultiTenantUser = localStorage.getItem("vt-demo-isMultiTenantUser");
  if (isMultiTenantUser) {
    if (isMultiTenantUser === "1") {
      return true;
    }
  }
  // Redirect to the access-denied page
  return router.parseUrl('/access-denied');
};