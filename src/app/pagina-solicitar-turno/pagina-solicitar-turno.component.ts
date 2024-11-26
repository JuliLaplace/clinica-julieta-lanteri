import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SesionService } from '../servicios/sesion.service';
import { DataUsuariosService, Usuario } from '../servicios/data-usuarios.service';
import { DataEspecialidadesService, Especialidad } from '../servicios/data-especialidades.service';
import {MatTabsModule} from '@angular/material/tabs';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { DataTurnosService, Turno } from '../servicios/data-turnos.service';
import { EstadoTurno } from '../enumerables/estado-turno';
import { DataHorariosEspecialistaService, HorarioSemanal } from '../servicios/data-horarios-especialista.service';
import { FormatoHoraPipe } from '../pipes/formato-hora.pipe';


@Component({
  selector: 'app-pagina-solicitar-turno',
  standalone: true,
  imports: [CommonModule, MatTabsModule, FormatoHoraPipe],
  templateUrl: './pagina-solicitar-turno.component.html',
  styleUrl: './pagina-solicitar-turno.component.css'
})
export class PaginaSolicitarTurnoComponent implements OnInit  {

  pacienteSeleccionado: Usuario | null = null;
  especialidadSeleccionada: string | null = null;
  especialistaSeleccionado: Usuario | null = null;
  especialistasFiltrados: Usuario[] = [];
  //
  fechaSeleccionada: Date | null = null;
  horarioSeleccionado: string | null = null;
  horariosDisponibles: string[] = ["8:00 AM - 8:30 AM", "9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM"];
  

  constructor(public sesion: SesionService, public dataUsuarios : DataUsuariosService, public datosEspecialidades: DataEspecialidadesService, public especialidades: DataEspecialidadesService, private router: Router, private dataTurnos : DataTurnosService, private datePipe : DatePipe, public dataHorarios : DataHorariosEspecialistaService){

  }
  ngOnInit(): void {
    if (this.sesion.esPaciente()) {
      this.pacienteSeleccionado = this.sesion.usuarioBD;
    }
    
  }
  seleccionarPaciente(paciente: Usuario) {
    
    this.pacienteSeleccionado = paciente;
    console.log('Paciente seleccionado:', paciente);
  }

  
  seleccionarEspecialidad(especialidad: Especialidad) {
    
    this.especialidadSeleccionada = especialidad.especialidad;
    console.log('Especialidad seleccionada:', this.especialidadSeleccionada);

    // filtro para seleccionar los especialistas segun las especialidad seleccionada
    this.especialistasFiltrados = this.dataUsuarios.coleccionEspecialistas.filter(especialista =>
      especialista.especialidad?.includes(this.especialidadSeleccionada!) //el ! es para que sepa que no le voy a pasar un null
    );
    
  }

  seleccionarEspecialista(especialista: Usuario) {
    this.especialistaSeleccionado = especialista;
    console.log('Especialista seleccionado:', especialista);
  }

  seleccionarFecha(fecha: Date) {
    this.fechaSeleccionada = fecha;
    this.horarioSeleccionado = null;
  }
  seleccionarHorario(horario: string) {
    this.horarioSeleccionado = horario;
  }

  confirmarTurno() {


    if (this.pacienteSeleccionado && this.especialistaSeleccionado && this.especialidadSeleccionada && this.fechaSeleccionada && this.horarioSeleccionado) {
    
      const turno : Turno = {
        id : '',
        usuario : this.pacienteSeleccionado?.mail,
        usuarioNombre : this.pacienteSeleccionado.nombre + ' ' + this.pacienteSeleccionado.apellido,
        especialidad: this.especialidadSeleccionada,
        especialista : this.especialistaSeleccionado.mail,
        especialistaNombre : this.especialistaSeleccionado.nombre + ' ' + this.especialistaSeleccionado.apellido,
        fechaTurno: this.datePipe.transform(this.fechaSeleccionada, 'EEEE d \'de\' MMMM ')!,
        horaTurno : this.horarioSeleccionado,
        estado : EstadoTurno.pendiente,
        comentario : null,
        resena : null,
        diagnostico: null,
        historialClinico : null
      }

      this.dataTurnos.crearRegistro(turno)
      .then((id)=>{
        turno.id =  id;
        Swal.fire({
          title: "Turno asignado",
          text: "Su turno fue confirmado. Muchas gracias",
          icon: "success",
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl('/home');
        });

      });

      
    }
    
  }


  cancelarTurno() {
    this.horarioSeleccionado = null;
  }



//BOTONES PARA VOLVER
  volverAPaciente(): void {
    this.pacienteSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;
  }
  
  volverAEspecialidad(): void {
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;

  }
  
  volverAEspecialista(): void {
    this.especialistaSeleccionado = null;

  }
  volverAFecha() {
    this.fechaSeleccionada = null;
    this.horarioSeleccionado = null;
  }
  
  //par obtener las fechas desde hoy a 15 dias
  public getNextNDays(n: number): Date[] {
    let today: Date = new Date();
    let nextNDays: Date[] = [];
  
    for (let i = 1; i <= n; i++) {
      let nextDay: Date = new Date(today);
      nextDay.setDate(today.getDate() + i);
      if(nextDay.getDay()!==0){
        nextNDays.push(nextDay);
      }
    }
  
    return nextNDays;
  }

  obtenerFechasDisponibles(): Date[]{
    let proximosDias : Date[] = [];
    let horarios : HorarioSemanal[] = this.dataHorarios.coleccionHorarios.filter((h)=>{return h.mail == this.especialistaSeleccionado!.mail});

    if(horarios.length>0){
      let horariosEspecialista : HorarioSemanal = horarios[0];
      proximosDias = this.getNextNDays(15);
      proximosDias = proximosDias.filter((fecha) => {
        let horariosDia = horariosEspecialista.horariosDiarios[fecha.getDay()-1];
        return horariosDia.horarios.length > 0 && horariosDia.especialidad == this.especialidadSeleccionada;
      });
    }
    
    return proximosDias;
  }

  obtenerHorariosDisponibles(): string[]{
    let horas : string[] = [];
    let horarios : HorarioSemanal[] = this.dataHorarios.coleccionHorarios.filter((h)=>{return h.mail == this.especialistaSeleccionado!.mail});

    if(horarios.length>0){
      let horariosEspecialista : HorarioSemanal = horarios[0];
      horas = horariosEspecialista.horariosDiarios[this.fechaSeleccionada!.getDay()-1].horarios;
      let turnosDia = this.dataTurnos.coleccionTurnos.filter((t)=>{return t.fechaTurno == this.datePipe.transform(this.fechaSeleccionada, 'EEEE d \'de\' MMMM ') && t.especialista == this.especialistaSeleccionado!.mail});


      horas = horas.filter((h)=>{
        return !turnosDia.map((t)=>{return t.horaTurno}).includes(h);
      });
    }
    
    return horas;
  }
}
