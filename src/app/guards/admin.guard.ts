import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SesionService } from '../servicios/sesion.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const sesion = inject(SesionService);

  return sesion.esAdmin();
};
