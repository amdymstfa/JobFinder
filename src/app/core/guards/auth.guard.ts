import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (storageService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
