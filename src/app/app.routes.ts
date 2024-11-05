import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,

    },
    {
        path: 'home',
        redirectTo: '', pathMatch: "full",

    },
    {
        path: 'login',
        component: LoginComponent,
    
      },
      {
        path: 'registro',
        component: RegistroComponent,
    
      },
      {
        path: 'seccion-usuarios',
        component: SeccionUsuariosComponent, 
        // canActivate: [adminGuard]
      },
];
