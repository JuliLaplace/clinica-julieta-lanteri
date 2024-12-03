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
import { PaginaGraficosComponent } from './pagina-graficos/pagina-graficos.component';
import { LogsComponent } from './componentes/logs/logs.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data : {animation: 'homePage'}

    },
    {
        path: 'home',
        redirectTo: '', pathMatch: "full",
        data : {animation: 'homePage'}

    },
    {
        path: 'login',
        component: LoginComponent,
        data : {animation: 'loginPage'}
    
      },
      {
        path: 'registro',
        component: RegistroComponent,
        data : {animation: 'registro'}
    
      },
      {
        path: 'seccion-usuarios',
        component: SeccionUsuariosComponent, 
        canActivate: [adminGuard],
        data : {animation: 'usuarios'}
      },
      {
        path: 'mis-turnos',
        component: PaginaMisTurnosComponent, 
        canActivate: [especialistaPacienteGuard],
        data : {animation: 'mis-turnos'}
      },
      {
        path: 'turnos',
        component: PaginaTurnosComponent, 
        canActivate: [adminGuard],
        data : {animation: 'turnos'}
      },
      {
        path: 'solicitar-turno',
        component: PaginaSolicitarTurnoComponent, 
        canActivate: [adminPacienteGuard],
        data : {animation: 'solicitar-turno'}
      },
      {
        path: 'mi-perfil',
        component: PaginaMiPerfilComponent,
        data : {animation: 'mi-perfil'}
    
      },
      {
        path: 'seccion-pacientes',
        component: SeccionPacientesComponent,
        canActivate: [especialistaGuard],
        data : {animation: 'seccion-pacientes'}
      },
      {
        path: 'graficos',
        component: PaginaGraficosComponent,
        canActivate: [adminGuard],
        data : {animation: 'graficosPage'}
      },
    
];
