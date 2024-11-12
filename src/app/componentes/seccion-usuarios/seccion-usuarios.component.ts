import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormularioPacienteComponent } from '../formulario-paciente/formulario-paciente.component';
import { FormularioAdministradorComponent } from '../formulario-administrador/formulario-administrador.component';
import { FormularioEspecialistaComponent } from '../formulario-especialista/formulario-especialista.component';
import { TablaUsuariosComponent } from '../tabla-usuarios/tabla-usuarios.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [MatTabsModule, FormularioPacienteComponent, FormularioAdministradorComponent, FormularioEspecialistaComponent, TablaUsuariosComponent, CommonModule],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css'
})
export class SeccionUsuariosComponent {
  agregarUsuario : boolean= false;



  mostrarFormularios(){
    this.agregarUsuario = !this.agregarUsuario;
  }
}
