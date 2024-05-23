import { CanActivateChildFn, Router } from '@angular/router';
import { AccesoService } from '../services/acceso.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const accesoService = inject(AccesoService);
  const router = inject(Router);
  return accesoService.getRole().pipe(
    map((isAdmin) => {
      if (!isAdmin) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};