import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorarioSemanal, HorarioDiario, DataHorariosEspecialistaService } from '../../servicios/data-horarios-especialista.service';
import { SesionService } from '../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-horarios-especialista',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './horarios-especialista.component.html',
  styleUrl: './horarios-especialista.component.css'
})
export class HorariosEspecialistaComponent implements OnInit {


  iconoTacho : IconDefinition = faTrashCan;
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horarios = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];

  // horariosEspecialista : string[] = [];
  horarioSemanal!: HorarioSemanal;
  selecciones: { dia: string, desde: string, hasta: string, especialidad: string }[] = [];


  constructor(public sesion: SesionService, private dataHorarios: DataHorariosEspecialistaService) {

  }
  ngOnInit(): void {

    setTimeout(() => {
      
      let horariosEspecialistas : HorarioSemanal[] = this.dataHorarios.coleccionHorarios.filter((h)=>{return h.mail == this.sesion.getUsuario()});
      this.horarioSemanal = {
        mail: this.sesion.getUsuario(),
        horariosDiarios: []
      }
  
      this.selecciones = this.dias.map((dia) => {
       return {
          dia: dia,
          desde : '',
          hasta: '',
          especialidad: this.sesion.usuarioBD!.especialidad![0],
        }
      });
  
      if(horariosEspecialistas.length==1){
        let horarioActual : HorarioSemanal = horariosEspecialistas[0];
        console.log(horarioActual);
        for(let i = 0; i<5; i++){
          let len = horarioActual.horariosDiarios[i].horarios.length;
          if(len>0){
            this.selecciones[i].desde = horarioActual.horariosDiarios[i].horarios[0];
            this.selecciones[i].hasta = horarioActual.horariosDiarios[i].horarios[len - 1];
            this.selecciones[i].especialidad = horarioActual.horariosDiarios[i].especialidad;
          }
        }
      }
    }, 10);

  }

  cargarHorariosEspecialista() {

    this.selecciones.forEach((seleccion, index) => {
      const dia = this.dias[index];
      const { desde, hasta } = seleccion;
      let horario : HorarioDiario = {
        dia : dia.toLowerCase(),
        especialidad : seleccion.especialidad,
        horarios : []
      }

      if (desde && hasta) {
        let indexDesde = this.horarios.findIndex((h)=>{return h==desde});
        let indexHasta = this.horarios.findIndex((h)=>{return h==hasta});
        let recorte = this.horarios.slice(indexDesde, indexHasta);
        recorte.forEach(element => {
          horario.horarios.push(element);
        });
      }
      this.horarioSemanal.horariosDiarios.push(horario);
    });
    console.log(this.horarioSemanal);
    this.dataHorarios.crearRegistro(this.horarioSemanal, this.sesion.usuarioBD!.mail)
    .then(()=>{

      Swal.fire({
        title: "Horarios asignados",
        text: "Sus horarios fueron cargados exitosamente",
        icon: "success",
        showConfirmButton: true,
        
      });
    })
    .catch(()=>{
      Swal.fire({
        title: "Error al cargar los horarios",
        icon: "error",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
    })


  }


  esSabado(horario: string, index : number){
    return index == 5 && horario > "14:00";
  }
  esHorarioValido(horarioHasta: string, horarioDesde: string | null): boolean {
    if (!horarioDesde) {
      return true;
    }
    return horarioHasta > horarioDesde;
  }

  esHorarioSeleccionado(): boolean {
    return this.selecciones.every(seleccion => {
      return (!seleccion.desde && !seleccion.hasta) || (seleccion.desde && seleccion.hasta);
    });
  }

  borrarHorariosEspecialista(){
    this.dataHorarios.deleteOne(this.sesion.getUsuario())
    .then(()=>{
      Swal.fire({
        title: "¡Horarios borrados con exito!",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
      this.selecciones = this.dias.map((dia) => {
        return {
           dia: dia,
           desde : '',
           hasta: '',
           especialidad: this.sesion.usuarioBD!.especialidad![0],
         }
       });
    });
  }


}
