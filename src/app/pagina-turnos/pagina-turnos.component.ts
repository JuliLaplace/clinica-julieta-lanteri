import { Component } from '@angular/core';
import { Comentario, DataTurnosService, Turno } from '../servicios/data-turnos.service';
import { EstadoTurno } from '../enumerables/estado-turno';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataUsuariosService } from '../servicios/data-usuarios.service';
import { FormatoHoraPipe } from '../pipes/formato-hora.pipe';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-pagina-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatoHoraPipe],
  templateUrl: './pagina-turnos.component.html',
  styleUrl: './pagina-turnos.component.css'
})
export class PaginaTurnosComponent {

 
  comentarioVisible: boolean = false;
  comentario: string = '';
  turnoSeleccionado: Turno | null = null;
  buscador : string ='';
  estadoTurno= EstadoTurno;

  constructor(public turnosService : DataTurnosService, public dataUsuarios: DataUsuariosService, private sesion: SesionService) { }


  obtenerTurnosFiltrados(): Turno[]{
    let buscador = this.buscador.toLowerCase();
    return this.turnosService.coleccionTurnos.filter((t)=>{
      return t.especialistaNombre.toLowerCase().includes(buscador) || t.especialidad.toLowerCase().includes(buscador);
    })
  }

  mostrarComentario(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.comentarioVisible = true;
  }

  cancelarTurno() {
    if (this.turnoSeleccionado && this.comentario) {
      let comentario : Comentario ={
        comentario: this.comentario,
        usuario: this.sesion.usuarioBD?.nombre! + ' ' + this.sesion.usuarioBD?.apellido,
        tipoUsuario : this.sesion.usuarioBD?.tipo!,
        accion: this.estadoTurno.cancelado
      }
      this.turnosService.cambiarEstadoCancelado(this.turnoSeleccionado, comentario);
      this.comentarioVisible = false;
    }
  }

  cerrar() {
    this.comentarioVisible = false;
    this.comentario = '';
  }


}
