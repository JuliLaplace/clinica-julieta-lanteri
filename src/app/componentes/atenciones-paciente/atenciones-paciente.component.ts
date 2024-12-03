import { Component, OnInit } from '@angular/core';
import { EstadoTurnoDirective } from '../../directivas/estado-turno.directive';
import { FormatoHoraPipe } from '../../pipes/formato-hora.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTurnosService, Turno } from '../../servicios/data-turnos.service';
import { EstadoTurno } from '../../enumerables/estado-turno';
import { SesionService } from '../../servicios/sesion.service';
import { jsPDF } from 'jspdf';
import { FormatoVacioPipe } from '../../pipes/formato-vacio.pipe';

import { PrefijoEspecialistaPipe } from '../../pipes/prefijo-especialista.pipe';
import { TipoUsuario } from '../../enumerables/tipo-usuario';
import { MatTableModule } from '@angular/material/table';
import { BooleanTextoPipe } from '../../pipes/boolean-texto.pipe';
FormatoVacioPipe


@Component({
  selector: 'app-atenciones-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatoHoraPipe, EstadoTurnoDirective, FormatoVacioPipe, PrefijoEspecialistaPipe, MatTableModule, BooleanTextoPipe],
  templateUrl: './atenciones-paciente.component.html',
  styleUrl: './atenciones-paciente.component.css'
})
export class AtencionesPacienteComponent{

  tipoUsuario = TipoUsuario;
  logoBase64: string = '';
  turnoSeleccionado: Turno | null = null;
  turnosPaciente : Turno[] | null = null;
  turnosUsuario1 : Turno[] | null = null;
  estadoTurno= EstadoTurno;
  especialidades : string[] = [];
  especialidadSeleccionada : string = "Todos"

  displayedColumns: string[] = [
    'fecha',
    'especialista',
    'especialidad',
    'altura', 
    'peso', 
    'temperatura', 
    'presion', 
    'datosDinamicos', 
    // 'datoDinamico2', 
    // 'datoDinamico3',
    'otrosDatos'
  ];

  constructor(public dataTurnos: DataTurnosService, public sesion: SesionService){
    this.loadLogo();
    this.verHistorialClinico();
    this.obtenerTurnosFiltradosPaciente();
  }



  obtenerTurnosFiltradosPaciente(): Turno[]{
    this.turnosPaciente= this.dataTurnos.coleccionTurnos.filter((t)=>{
      return t.usuario == this.sesion.getUsuario();
    });

    // this.turnosPaciente.forEach(turno => {
    //   if (!this.especialidades.includes(turno.especialidad)) {
    //     this.especialidades.push(turno.especialidad);
    //   }
    // });
    this.turnosPaciente.forEach(turno => {
      if (!this.especialidades.includes(turno.especialidad) && turno.historialClinico) {
        this.especialidades.push(turno.especialidad);
      }
    });

    if (this.especialidadSeleccionada == 'Todos') {
      return this.turnosPaciente;
    }
    if(this.especialidadSeleccionada != 'Todos')
      this.turnosPaciente = this.turnosPaciente.filter(
        (turno) => turno.especialidad == this.especialidadSeleccionada
      );
    return this.turnosPaciente;
  }

  verHistorialClinico(): void {
    this.turnosUsuario1 = this.dataTurnos.coleccionTurnos.filter(turno => turno.usuario == this.sesion.getUsuario() && (turno.historialClinico));
    console.log('Turnos del paciente:', this.turnosUsuario1);
    console.log('Turnos en el modal:', this.turnosUsuario1);
  }



  descargarPDF() {
    if(this.turnosPaciente){
      this.turnosPaciente = this.turnosPaciente.sort((a, b) => new Date(b.fechaTurno).getTime() - new Date(a.fechaTurno).getTime());
    }
    
    const doc = new jsPDF();
    
    
    const docWidth = doc.internal.pageSize.getWidth();
    const docHeight = doc.internal.pageSize.getHeight();
  
    
    const logoWidth = 50; 
    const logoHeight = 50; 
    const logoX = (docWidth - logoWidth) / 2; 
    const logoY = 10; 
    doc.addImage(this.logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
  
    
    const title = 'Informe de Historia Clínica';
    const titleWidth = doc.getTextWidth(title); 
    const titleX = (docWidth - titleWidth) / 2;
    const titleY = logoY + logoHeight + 10;
    doc.setFontSize(20);
    doc.text(title, titleX, titleY);
  
    const dateText = 'Fecha de emisión: ' + new Date().toLocaleDateString();
    const dateWidth = doc.getTextWidth(dateText); 
    const dateX = (docWidth - dateWidth) / 2; 
    const dateY = titleY + 10; 
    doc.setFontSize(12);
    doc.text(dateText, dateX, dateY);
  
    
    const startY = dateY + 20;
    doc.setFontSize(12);

    doc.text('Turnos del paciente: ' + this.sesion.usuarioBD?.nombre + ' ' + this.sesion.usuarioBD?.apellido + '.', 10, startY);

    if (this.turnosPaciente) {
      this.turnosPaciente.forEach((turno, index) => {
        const yPosition = startY + 10 + index * 10;
        doc.text(
          `Dr: ${turno.especialistaNombre} - ${turno.especialidad}, Fecha: ${turno.fechaTurno}, Hora: ${turno.horaTurno}, Estado: ${turno.estado}`,
          10,
          yPosition
        );
      });
    }
  
    
    doc.save('historia_clinica_' + this.sesion.usuarioBD?.nombre + '.pdf');
  }
  

  loadLogo() {
    const logoUrl = 'assets/logo.png';  
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        this.logoBase64 = canvas.toDataURL('image/png');  
      }
    };
  }
  
}
