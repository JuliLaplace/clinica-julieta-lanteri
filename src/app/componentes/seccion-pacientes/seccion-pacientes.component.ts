import { Component, OnInit } from '@angular/core';
import { DataTurnosService, HistorialClinico, Turno } from '../../servicios/data-turnos.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DataUsuariosService, Usuario } from '../../servicios/data-usuarios.service';
import { CambiarImagenDirective } from '../../directivas/cambiar-imagen.directive';
import { MatCardModule } from '@angular/material/card';
import { FormatoHoraPipe } from '../../pipes/formato-hora.pipe';
import { SesionService } from '../../servicios/sesion.service';
import { EstadoTurno } from '../../enumerables/estado-turno';
import { FormatoVacioPipe } from '../../pipes/formato-vacio.pipe';
@Component({
  selector: 'app-seccion-pacientes',
  standalone: true,
  imports: [CommonModule, MatTableModule, CambiarImagenDirective, MatCardModule, FormatoHoraPipe, FormatoVacioPipe],
  templateUrl: './seccion-pacientes.component.html',
  styleUrl: './seccion-pacientes.component.css'
})
export class SeccionPacientesComponent implements OnInit {
  usuariosAtendidos: Usuario[] = [];
  popUp: boolean = false;
  turnosUsuario : Turno[] | null = null;
  turnosUsuario1 : Turno[] | null = null;
  displayedColumns: string[] = [
    'altura', 
    'peso', 
    'temperatura', 
    'presion', 
    'datoDinamico1', 
    'datoDinamico2', 
    'datoDinamico3'
  ];
  
  constructor(public dataTurnos: DataTurnosService, public dataUsuarios : DataUsuariosService, public sesion: SesionService){
    
  }

  async ngOnInit(): Promise<void> {
    // const emails = this.dataTurnos.obtenerUsuariosAtendidos();
    // this.usuariosAtendidos = await this.obtenerUsuariosPorEmail(emails);
    const emails = this.dataTurnos.obtenerUsuariosAtendidos();
    this.usuariosAtendidos = await this.obtenerUsuariosPorEmail(emails);
    console.log('Usuarios atendidos:', this.usuariosAtendidos);
  }


  async obtenerUsuariosPorEmail(emails: string[]): Promise<Usuario[]> {
    const usuarios: Usuario[] = [];
    
    for (let email of emails) {
      const usuario = await this.dataUsuarios.obtenerUsuarioPorEmail(email);
      if (usuario) {
        usuarios.push(usuario);
      }
    }

    return usuarios;
  }

  obtenerUltimosTurnos(usuario: Usuario): Turno[] {
    const turnosDelUsuario = this.dataTurnos.coleccionTurnos.filter(turno => turno.usuario === usuario.mail && turno.especialista === this.sesion.getUsuario() && turno.estado == EstadoTurno.finalizado);
    this.turnosUsuario = turnosDelUsuario.sort((a, b) => new Date(b.fechaTurno).getTime() - new Date(a.fechaTurno).getTime());
    return this.turnosUsuario.slice(0, 3);
  }
  verHistorialClinico(paciente: Usuario): void {
    this.turnosUsuario1 = this.obtenerUltimosTurnos(paciente);
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
