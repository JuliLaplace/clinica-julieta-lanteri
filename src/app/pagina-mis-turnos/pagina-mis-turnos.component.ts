import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comentario, DataTurnosService, Dato, HistorialClinico, Turno } from '../servicios/data-turnos.service';
import { EstadoTurno } from '../enumerables/estado-turno';
import { SesionService } from '../servicios/sesion.service';
import { FormatoHoraPipe } from '../pipes/formato-hora.pipe';
import { EstadoTurnoDirective } from '../directivas/estado-turno.directive';
import { FormViewerService } from '../servicios/form-viewer.service';
@Component({
  selector: 'app-pagina-mis-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatoHoraPipe, EstadoTurnoDirective, ReactiveFormsModule],
  templateUrl: './pagina-mis-turnos.component.html',
  styleUrl: './pagina-mis-turnos.component.css'
})
export class PaginaMisTurnosComponent implements OnInit{

  comentarioVisible: boolean = false;
  encuestaVisible : boolean = false;
  resenaVisible : boolean = false;
  historialVisible : boolean = false;
  accion: string ='';
  comentario: string = '';
  diagnostico: string = '';
  turnoSeleccionado: Turno | null = null;
  buscador : string ='';
  estadoTurno= EstadoTurno;
  formHistorial!: FormGroup;

  constructor(public dataTurnos: DataTurnosService, public sesion: SesionService, public formViewer: FormViewerService){

  }

  ngOnInit(): void {
    this.formHistorial = new FormGroup({
      altura: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex) ,Validators.minLength(1), Validators.maxLength(3)]),
      peso: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex),Validators.minLength(1), Validators.maxLength(3)]),
      presion: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex),Validators.minLength(1), Validators.maxLength(3)]),
      temperatura: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex),Validators.minLength(1), Validators.maxLength(2)]),
      clave1: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}|${this.formViewer.numeroRegex}`)]),
      clave2: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}|${this.formViewer.numeroRegex}`)]),
      clave3: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}|${this.formViewer.numeroRegex}`)]),
      valor1: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}|${this.formViewer.numeroRegex}`)]),
      valor2: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}|${this.formViewer.numeroRegex}`)]),
      valor3: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}|${this.formViewer.numeroRegex}`)]),
    });
  }
  obtenerMensajeErrorControl(control: string) {
    return this.formViewer.errorEnControl(this.formHistorial, control);
  }
  obtenerTurnosFiltradosPaciente(): Turno[]{
    let buscador = this.buscador.toLowerCase();
    return this.dataTurnos.coleccionTurnos.filter((t)=>{
      return t.especialistaNombre.toLowerCase().includes(buscador) || t.especialidad.toLowerCase().includes(buscador);
    })
  }

  // obtenerTurnosFiltradosEspecialista(): Turno[]{
  //   let buscador = this.buscador.toLowerCase();
  //   return this.dataTurnos.coleccionTurnos.filter((t)=>{
  //     return t.usuarioNombre.toLowerCase().includes(buscador) || t.especialidad.toLowerCase().includes(buscador);
  //   })
  // }
  obtenerTurnosFiltradosEspecialista(): Turno[] {
    const especialista = this.sesion.getUsuario(); 
    let buscador = this.buscador.toLowerCase();
    
    return this.dataTurnos.coleccionTurnos.filter((t) => {
      return t.especialista === especialista && 
             (t.usuarioNombre.toLowerCase().includes(buscador) || 
              t.especialidad.toLowerCase().includes(buscador));
    });
  }
  mostrarComentario(turno: Turno, accion: string) {
    this.turnoSeleccionado = turno;
    this.comentarioVisible = true;
    this.accion = accion;
  }
  mostrarEncuesta(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.encuestaVisible = true;
  }
  mostrarResena(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.resenaVisible = true;
  }
  mostrarHistorial(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.historialVisible = true;
  }

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
  rechazarTurno() {
    if (this.turnoSeleccionado && this.comentario) {
      let comentario : Comentario ={
        comentario: this.comentario,
        usuario: this.sesion.usuarioBD?.nombre! + ' ' + this.sesion.usuarioBD?.apellido,
        tipoUsuario : this.sesion.usuarioBD?.tipo!,
        accion: this.estadoTurno.rechazado
      }
      this.dataTurnos.cambiarEstadoRechazado(this.turnoSeleccionado, comentario);
      this.comentarioVisible = false;
    }
  }
  aceptarTurno(turno : Turno) {
    if (turno) {
      this.dataTurnos.cambiarEstadoAceptado(turno);
      console.log("entre")
    }
  }

  finalizarTurno() {
    if (this.turnoSeleccionado && this.comentario && this.diagnostico) {
      let comentario : Comentario ={
        comentario: this.comentario,
        usuario: this.sesion.usuarioBD?.nombre! + ' ' + this.sesion.usuarioBD?.apellido,
        tipoUsuario : this.sesion.usuarioBD?.tipo!,
        accion: this.estadoTurno.finalizado
      }
      
      let historial : HistorialClinico ={
        altura : this.formHistorial.get('altura')?.value,
        peso : this.formHistorial.get('peso')?.value,
        temperatura : this.formHistorial.get('temperatura')?.value,
        presion : this.formHistorial.get('presion')?.value,
        datoDinamico1: this.crearDatoDinamico('clave1', 'valor1'),
        datoDinamico2: this.crearDatoDinamico('clave2', 'valor2'),
        datoDinamico3: this.crearDatoDinamico('clave3', 'valor3'),
      };
      this.dataTurnos.cambiarEstadoFinalizado(this.turnoSeleccionado, comentario, this.diagnostico, historial);
      this.historialVisible = false;
    }
  }

  crearDatoDinamico(clave: string, valor: string): Dato | null {
    let claveValue = this.formHistorial.get(clave)?.value;
    let valorValue =  this.formHistorial.get(valor)?.value;
    claveValue = claveValue.toString();
    valorValue = valorValue.toString();
    if (claveValue && valorValue) {
      return { clave: claveValue, valor: valorValue};
    }
    return null; 
  }

  

  cerrarModal(modal: string) {

    if(modal == 'comentario'){
      this.comentarioVisible = false;
      this.comentario = '';
    }else if( modal == 'resena'){
      this.resenaVisible = false;

    }else if(modal =='historial'){
      this.historialVisible = false;
      this.formHistorial.reset();
    }
    
  }


  
}
