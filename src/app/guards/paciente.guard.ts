import { CanActivateFn } from '@angular/router';

export const pacienteGuard: CanActivateFn = (route, state) => {
  return true;
};
