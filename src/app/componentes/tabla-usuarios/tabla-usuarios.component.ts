import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DataUsuariosService, Usuario } from '../../servicios/data-usuarios.service';
import { CommonModule } from '@angular/common';
import { FormatoVacioPipe } from '../../pipes/formato-vacio.pipe';
import { MatCardModule } from '@angular/material/card';
import { TipoUsuario } from '../../enumerables/tipo-usuario';
import { DataTurnosService, Turno } from '../../servicios/data-turnos.service';
import * as XLSX from 'xlsx';
import { HoverImagenDirective } from '../../directivas/hover-imagen.directive';
import { PrefijoEspecialistaPipe } from '../../pipes/prefijo-especialista.pipe';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatPaginatorModule, FormatoVacioPipe, MatCardModule, HoverImagenDirective, PrefijoEspecialistaPipe],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css'
})
export class TablaUsuariosComponent {
  // displayedColumns: string[] = ['nombre', 'apellido', 'edad', 'dni', 'obraSocial', 'especialidad', 'habilitado', 'imagenPerfil1', 'imagenPerfil2'];
  usuariosVisibles : Usuario[] = [];
  agregarUsuario: boolean = false;
  tipoUsuario= TipoUsuario;
  turnosUsuario1 : Turno[] | null = null;
  popUp: boolean = false;

  displayedColumns: string[] = [
    'fecha',
    'especialista',
    'especialidad',
    'altura', 
    'peso', 
    'temperatura', 
    'presion', 
    'datoDinamico1', 
    'datoDinamico2', 
    'datoDinamico3'
  ];

  constructor(public dataUsuarios: DataUsuariosService, public turnos: DataTurnosService) {
    this.usuariosVisibles = dataUsuarios.coleccionUsuarios
  }

  habilitarEspecialista(usuario: Usuario) {
    this.dataUsuarios.cambiarHabilitacionEspecialista(usuario, true)
      
  }
  deshabilitarEspecialista(usuario: Usuario) {
    this.dataUsuarios.cambiarHabilitacionEspecialista(usuario, false)
  }

  mostrarUsuarios(tipo: string): void {
    switch (tipo) {
      case 'todos':
        this.usuariosVisibles = this.dataUsuarios.coleccionUsuarios;
        break;
      case 'pacientes':
        this.usuariosVisibles = this.dataUsuarios.coleccionPacientes;
        break;
      case 'especialistas':
        this.usuariosVisibles = this.dataUsuarios.coleccionEspecialistas;
        break;
      case 'administradores':
        this.usuariosVisibles = this.dataUsuarios.coleccionAdmin;
        break;
      default:
        this.usuariosVisibles = [];
        break;
    }
  }


  descargarExcel(usuario: Usuario) {
    const turnosUsuario = this.turnos.coleccionTurnos.filter(
      (turno) => turno.usuario === usuario.mail
    );
  

    const datosExcel = turnosUsuario.map((turno) => ({
      Especialista: turno.especialistaNombre,
      Especialidad: turno.especialidad,
      Día: turno.fechaTurno,
      Hora: turno.horaTurno,
    }));
  
    if (datosExcel.length === 0) {
      Swal.fire("No hay turnos guardados para este usuario.");
      console.error('No hay turnos para este usuario.');
      return;
    }
  

    const hojaDeCalculo = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hojaDeCalculo, 'Turnos');
    const nombreArchivo = `turnos_${usuario.nombre}_${usuario.apellido}.xlsx`;
    XLSX.writeFile(libro, nombreArchivo);
  }

  verHistorialClinico(paciente: Usuario): void {
    this.turnosUsuario1 = this.turnos.coleccionTurnos.filter(turno => turno.usuario == paciente.mail && (turno.historialClinico));
    console.log('Turnos del paciente:', this.turnosUsuario1);
    console.log('Turnos en el modal:', this.turnosUsuario1);
    this.mostrarPopUp();
  }

  mostrarPopUp() {
    this.popUp=true
  }
  cerrarPopUp() {
    this.popUp = false;
  }
}
