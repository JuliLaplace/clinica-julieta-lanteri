import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormularioPacienteComponent } from '../formulario-paciente/formulario-paciente.component';
import { FormularioAdministradorComponent } from '../formulario-administrador/formulario-administrador.component';
import { FormularioEspecialistaComponent } from '../formulario-especialista/formulario-especialista.component';
import { TablaUsuariosComponent } from '../tabla-usuarios/tabla-usuarios.component';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { DataUsuariosService } from '../../servicios/data-usuarios.service';


@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [MatTabsModule, FormularioPacienteComponent, FormularioAdministradorComponent, FormularioEspecialistaComponent, TablaUsuariosComponent, CommonModule],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css'
})
export class SeccionUsuariosComponent {
  agregarUsuario : boolean= false;


  constructor(private dataUsuarios: DataUsuariosService){}
  mostrarFormularios(){
    this.agregarUsuario = !this.agregarUsuario;
  }

  descargarExcel() {
    const usuariosOrdenados = this.dataUsuarios.coleccionUsuarios.map(usuario => ({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.mail,
      tipo: usuario.tipo,
      edad: usuario.edad,
      dni: usuario.dni,
      OS: usuario.obraSocial,
      imagen1: usuario.imagenPerfil1,
      imagen2: usuario.imagenPerfil2 ? usuario.imagenPerfil2 : 'Sin imagen',
      obraSocial: usuario.obraSocial ? usuario.obraSocial : '',
      especialidad: usuario.especialidad ? usuario.especialidad.join(', ') : '--',

    }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(usuariosOrdenados);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
      XLSX.writeFile(wb, 'usuarios.xlsx');
  }
}
