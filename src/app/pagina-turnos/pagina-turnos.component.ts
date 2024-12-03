import { Component } from '@angular/core';
import { Comentario, DataTurnosService, Turno } from '../servicios/data-turnos.service';
import { EstadoTurno } from '../enumerables/estado-turno';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataUsuariosService } from '../servicios/data-usuarios.service';
import { FormatoHoraPipe } from '../pipes/formato-hora.pipe';
import { SesionService } from '../servicios/sesion.service';
import { EstadoTurnoDirective } from '../directivas/estado-turno.directive';

@Component({
  selector: 'app-pagina-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatoHoraPipe, EstadoTurnoDirective],
  templateUrl: './pagina-turnos.component.html',
  styleUrl: './pagina-turnos.component.css'
})
export class PaginaTurnosComponent {

  resenaVisible : boolean = false;
  comentarioVisible: boolean = false;
  comentario: string = '';
  turnoSeleccionado: Turno | null = null;
  buscador : string ='';
  accion: string ='';
  estadoTurno= EstadoTurno;

  constructor(public dataTurnos : DataTurnosService, public dataUsuarios: DataUsuariosService, public sesion: SesionService) { }


  obtenerTurnosFiltrados(): Turno[]{
    let buscador = this.buscador.toLowerCase();
    return this.dataTurnos.coleccionTurnos.filter((t)=>{
      return t.usuarioNombre.toLowerCase().includes(buscador) || t.especialistaNombre.toLowerCase().includes(buscador) || t.especialidad.toLowerCase().includes(buscador) || this.historialClinicoContains(buscador, t) || t.fechaTurno.toLowerCase().includes(buscador) || t.horaTurno.toLowerCase().includes(buscador) || t.estado.toLowerCase().includes(buscador) || this.valoresEstaticosContains(buscador) || this.valoresDinamicosContains(buscador, t);
    });
  }

  historialClinicoContains(buscador: string, turno : Turno): boolean{
    let valor = false;

    if(buscador && turno && turno.historialClinico){
      let hc = turno.historialClinico;
      valor = hc.altura.includes(buscador) || hc.peso.includes(buscador) || hc.temperatura.includes(buscador) || hc.presion.includes(buscador) ;
    }

    return valor;
  }
  valoresEstaticosContains(buscador: string): boolean{
    let valoresEstaticos : string[] = ['altura', 'peso', 'presion', '°c', 'kg', 'mmhg', 'cm', 'temperatura']; 
    let valor = false;

    if(buscador){
      valor = valoresEstaticos.map((e)=>{return e.includes(buscador)}).includes(true);
    }

    return valor;
  }

  valoresDinamicosContains(buscador: string, turno : Turno): boolean{
    let resultado = false;
    if(buscador && turno && turno.historialClinico){
      let hc = turno.historialClinico;

      if(hc.datoDinamico1){
        resultado = hc.datoDinamico1.clave.toLowerCase().includes(buscador) || hc.datoDinamico1.valor.toLowerCase().includes(buscador)  ;
      }
      if(hc.datoDinamico2){
        resultado = hc.datoDinamico2.clave.toLowerCase().includes(buscador) || hc.datoDinamico2.valor.toLowerCase().includes(buscador) || resultado;
      }
      if(hc.datoDinamico3){
        resultado = hc.datoDinamico3.clave.toLowerCase().includes(buscador) || hc.datoDinamico3.valor.toLowerCase().includes(buscador)  || resultado;
      }
    }

    return resultado;
  }

  // mostrarComentario(turno: Turno) {
  //   this.turnoSeleccionado = turno;
  //   this.comentarioVisible = true;
  // }

  cancelarTurno() {
    if (this.turnoSeleccionado && this.comentario) {
      let comentario : Comentario ={
        comentario: this.comentario,
        usuario: this.sesion.usuarioBD?.nombre! + ' ' + this.sesion.usuarioBD?.apellido,
        tipoUsuario : this.sesion.usuarioBD?.tipo!,
        accion: this.estadoTurno.cancelado
      }
      this.dataTurnos.cambiarEstadoCancelado(this.turnoSeleccionado, comentario);
      this.comentarioVisible = false;
    }
  }

  // cerrar() {
  //   this.comentarioVisible = false;
  //   this.comentario = '';
  // }
  cerrarModal(modal: string) {

    if(modal == 'comentario'){
      this.comentarioVisible = false;
      this.comentario = '';
    }else if( modal == 'resena'){
      this.resenaVisible = false;

    }
    
  }
  mostrarResena(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.resenaVisible = true;
  }

  mostrarComentario(turno: Turno, accion: string) {
    this.turnoSeleccionado = turno;
    this.comentarioVisible = true;
    this.accion = accion;
  }

}
