import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { adminGuard } from './guards/admin.guard';
import { PaginaMisTurnosComponent } from './pagina-mis-turnos/pagina-mis-turnos.component';
import { PaginaTurnosComponent } from './pagina-turnos/pagina-turnos.component';
import { PaginaSolicitarTurnoComponent } from './pagina-solicitar-turno/pagina-solicitar-turno.component';
import { PaginaMiPerfilComponent } from './pagina-mi-perfil/pagina-mi-perfil.component';
import { pacienteGuard } from './guards/paciente.guard';
import { adminPacienteGuard } from './guards/admin-paciente.guard';
import { especialistaGuard } from './guards/especialista.guard';
import { especialistaPacienteGuard } from './guards/especialista-paciente.guard';
import { SeccionPacientesComponent } from './componentes/seccion-pacientes/seccion-pacientes.component';

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
        canActivate: [adminGuard]
      },
      {
        path: 'mis-turnos',
        component: PaginaMisTurnosComponent, 
        canActivate: [especialistaPacienteGuard]
      },
      {
        path: 'turnos',
        component: PaginaTurnosComponent, 
        canActivate: [adminGuard]
      },
      {
        path: 'solicitar-turno',
        component: PaginaSolicitarTurnoComponent, 
        canActivate: [adminPacienteGuard],
      },
      {
        path: 'mi-perfil',
        component: PaginaMiPerfilComponent,
    
      },
      {
        path: 'seccion-pacientes',
        component: SeccionPacientesComponent,
        canActivate: [especialistaGuard],
      },
];
