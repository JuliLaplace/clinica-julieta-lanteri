import { Component } from '@angular/core';
import { CardPerfilComponent } from '../componentes/card-perfil/card-perfil.component';
import { SesionService } from '../servicios/sesion.service';
import { DataUsuariosService, Usuario } from '../servicios/data-usuarios.service';
import { CommonModule } from '@angular/common';
import { HorariosEspecialistaComponent } from '../componentes/horarios-especialista/horarios-especialista.component';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { DataTurnosService, Turno } from '../servicios/data-turnos.service';
import { EstadoTurno } from '../enumerables/estado-turno';
import { AtencionesPacienteComponent } from '../componentes/atenciones-paciente/atenciones-paciente.component';


@Component({
  selector: 'app-pagina-mi-perfil',
  standalone: true,
  imports: [CardPerfilComponent, CommonModule, HorariosEspecialistaComponent, FormsModule, AtencionesPacienteComponent],
  templateUrl: './pagina-mi-perfil.component.html',
  styleUrl: './pagina-mi-perfil.component.css'
})
export class PaginaMiPerfilComponent {
  
  usuario! : Usuario;
  logoBase64: string = '';
  turnosPaciente : Turno[] | null = null;
  constructor(public sesion : SesionService, public dataUsuario: DataUsuariosService, public dataTurnos: DataTurnosService){
    this.loadLogo();
  }
  ngOnInit() {
    // cambiar para isar el sesiom.usuariobd
    const email = this.sesion.getUsuario(); 
    if (email) {
      this.dataUsuario.obtenerUsuarioPorEmail(email)
      .then((usuario) => {
        if(usuario){
          this.usuario = usuario; 
        }
        },
        (error) => {
          console.error('Error obteniendo usuario:', error);
        }
      );
    }
  }

  obtenerUltimosTurnos(): Turno[] {
    this.turnosPaciente = this.dataTurnos.coleccionTurnos.filter(turno => turno.usuario === this.sesion.usuarioBD?.mail);
    this.turnosPaciente = this.turnosPaciente.sort((a, b) => new Date(b.fechaTurno).getTime() - new Date(a.fechaTurno).getTime());
    return this.turnosPaciente;
  }

  
  descargarPDF() {
    this.obtenerUltimosTurnos();
  
    
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
    doc.setFontSize(18);
    doc.text(title, titleX, titleY);
  
    // centro la fecha 
    const dateText = 'Fecha de emisión: ' + new Date().toLocaleDateString();
    const dateWidth = doc.getTextWidth(dateText); 
    const dateX = (docWidth - dateWidth) / 2; 
    const dateY = titleY + 10; 
    doc.setFontSize(12);
    doc.text(dateText, dateX, dateY);
  
    
    const startY = dateY + 20;
    doc.setFontSize(12);
    doc.text('Turnos del paciente: ' + this.sesion.usuarioBD?.nombre + ' ' + this.sesion.usuarioBD?.apellido, 10, startY);
  
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
