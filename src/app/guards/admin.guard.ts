import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../servicios/sesion.service';
import { DataUsuariosService } from '../servicios/data-usuarios.service';
import { TipoUsuario } from '../enumerables/tipo-usuario';

export const adminGuard: CanActivateFn = (route, state) => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  const dataUsuarios = inject(DataUsuariosService);

  const email = sesion.getUsuario();

  if (email) {
    // Llama al método sin await
    dataUsuarios.obtenerTipoUsuarioPorEmail(email).then(tipoUsuario => {
      if (tipoUsuario === TipoUsuario.administrador) {
        console.log("Entró admin");
        return true; // Permite la navegación
      } else {
        console.log("No entró, no es admin");
        router.navigate(['']); // Redirige si no es admin
        return false; // Bloquea la navegación
      }
    });
  } else {
    console.log("No entró, no hay usuario");
    router.navigate(['']);
    return false; // Bloquea la navegación si no hay usuario
  }
  return false;
};
