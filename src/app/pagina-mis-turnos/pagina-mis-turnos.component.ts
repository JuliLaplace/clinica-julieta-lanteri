import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comentario, DataTurnosService, Dato, Encuesta, HistorialClinico, Turno } from '../servicios/data-turnos.service';
import { EstadoTurno } from '../enumerables/estado-turno';
import { SesionService } from '../servicios/sesion.service';
import { FormatoHoraPipe } from '../pipes/formato-hora.pipe';
import { EstadoTurnoDirective } from '../directivas/estado-turno.directive';
import { FormViewerService } from '../servicios/form-viewer.service';
import { BooleanTextoPipe } from '../pipes/boolean-texto.pipe';

@Component({
  selector: 'app-pagina-mis-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatoHoraPipe, EstadoTurnoDirective, ReactiveFormsModule, BooleanTextoPipe],
  templateUrl: './pagina-mis-turnos.component.html',
  styleUrl: './pagina-mis-turnos.component.css'
})
export class PaginaMisTurnosComponent implements OnInit{

  comentarioVisible: boolean = false;
  encuestaVisible : boolean = false;
  resenaVisible : boolean = false;
  historialVisible : boolean = false;
  calificacionVisible : boolean = false;
  mostrarResultadosEncuesta : boolean = false;
  mostrarModalComentario: boolean = false;
  accion: string ='';
  comentario: string = '';
  resena: string = '';
  turnoSeleccionado: Turno | null = null;
  buscador : string ='';
  estadoTurno= EstadoTurno;
  formHistorial!: FormGroup;
  formEncuesta!: FormGroup;
  rating: number = 0;

  constructor(public dataTurnos: DataTurnosService, public sesion: SesionService, public formViewer: FormViewerService){

  }

  ngOnInit(): void {
    this.formHistorial = new FormGroup({
      altura: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex) ,Validators.minLength(1), Validators.maxLength(3)]),
      peso: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex),Validators.minLength(1), Validators.maxLength(3)]),
      presion: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex),Validators.minLength(1), Validators.maxLength(3)]),
      temperatura: new FormControl('', [Validators.required, Validators.pattern(this.formViewer.numeroRegex),Validators.minLength(1), Validators.maxLength(2)]),
      clave1: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}`)]),
      clave2: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}`)]),
      clave3: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}`)]),
      valor1: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}`)]),
      valor2: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}`)]),
      valor3: new FormControl('', [Validators.pattern(`${this.formViewer.nombresRegex}`)]),
      estres: new FormControl(0),
      sintomas: new FormControl(0, [Validators.minLength(1), Validators.maxLength(2)]),
      fumador: new FormControl(false),
    });
    this.formEncuesta = new FormGroup({
      atencionPersonal: new FormControl ([null, Validators.required]),
      calificacionClinica: new FormControl ([null, Validators.required]),
      recomendacion: new FormControl ([null, Validators.required]),
    });
  }


  obtenerMensajeErrorControl(control: string) {
    return this.formViewer.errorEnControl(this.formHistorial, control);
  }

  obtenerTurnosFiltradosPaciente(): Turno[]{
    let buscador = this.buscador.toLowerCase();
    return this.dataTurnos.coleccionTurnos.filter((t)=>{
      return t.especialistaNombre.toLowerCase().includes(buscador) || t.especialidad.toLowerCase().includes(buscador) || this.historialClinicoContains(buscador, t) || t.fechaTurno.toLowerCase().includes(buscador) || t.horaTurno.toLowerCase().includes(buscador) || t.estado.toLowerCase().includes(buscador) || this.valoresEstaticosContains(buscador) || this.valoresDinamicosContains(buscador, t);
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

  
  obtenerTurnosFiltradosEspecialista(): Turno[] {
    let buscador = this.buscador.toLowerCase();
    return this.dataTurnos.coleccionTurnos.filter((t)=>{
      return t.especialista == this.sesion.getUsuario() && (t.usuarioNombre.toLowerCase().includes(buscador) || t.especialidad.toLowerCase().includes(buscador) || this.historialClinicoContains(buscador, t) || t.fechaTurno.toLowerCase().includes(buscador) || t.horaTurno.toLowerCase().includes(buscador) || t.estado.toLowerCase().includes(buscador) || this.valoresEstaticosContains(buscador) || this.valoresDinamicosContains(buscador, t));
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
  mostrarCalificacion(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.calificacionVisible = true;
    this.rating =0;
  }
  calificar(valor: number){
    this.rating = valor;
  }

  verEncuesta(turno: Turno){
    this.turnoSeleccionado = turno;
     this.mostrarResultadosEncuesta=true;
  }
  verComentario(turno: Turno){
    this.turnoSeleccionado = turno;
     this.mostrarModalComentario=true;
  }

  calificarTurno(){
    if(this.turnoSeleccionado){
      let comentario : Comentario ={
        comentario: this.comentario,
        usuario: this.sesion.usuarioBD?.nombre! + ' ' + this.sesion.usuarioBD?.apellido,
        tipoUsuario : this.sesion.usuarioBD?.tipo!,
        accion: this.estadoTurno.finalizado
      }
      this.dataTurnos.agregarCalificacion(this.turnoSeleccionado, this.rating, comentario );
    }
    console.log(this.rating);
    
    this.cerrarModal('calificacion');
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
    if (this.turnoSeleccionado && this.resena) {
      let comentario : Comentario ={
        comentario: this.resena,
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
        estres: this.formHistorial.get('estres')?.value,
        diasSintomas: this.formHistorial.get('sintomas')?.value,
        fumador: this.formHistorial.get('fumador')?.value,
      };
      this.dataTurnos.cambiarEstadoFinalizado(this.turnoSeleccionado, comentario, historial);
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
    }else if(modal == "calificacion"){
      this.calificacionVisible = false;
      this.rating=0;
    }else if(modal == "resultadoEncuesta"){
      this.mostrarResultadosEncuesta=false;
    }else if(modal=="encuesta"){
      this.encuestaVisible = false;
    }else if(modal=="comentarioModal"){
      this.mostrarModalComentario = false;
    }
    
  }

  cargarEncuesta(){
    if (this.turnoSeleccionado) {

      let encuesta : Encuesta ={
        atencionPersonal : this.formEncuesta.get('atencionPersonal')?.value,
        recomendacion : this.formEncuesta.get('recomendacion')?.value,
        calificacionClinica : this.formEncuesta.get('calificacionClinica')?.value,
      };
      this.dataTurnos.agregarEncuesta(this.turnoSeleccionado, encuesta)
      this.encuestaVisible = false;
    }
  }

  
}
