import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SesionService } from '../servicios/sesion.service';
import { DataUsuariosService, Usuario } from '../servicios/data-usuarios.service';
import { DataEspecialidadesService, Especialidad } from '../servicios/data-especialidades.service';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-pagina-solicitar-turno',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './pagina-solicitar-turno.component.html',
  styleUrl: './pagina-solicitar-turno.component.css'
})
export class PaginaSolicitarTurnoComponent implements OnInit  {

  pacienteSeleccionado: Usuario | null = null;
  especialidadSeleccionada: string | null = null;
  especialistaSeleccionado: Usuario | null = null;
  especialistasFiltrados: Usuario[] = [];

  constructor(public sesion: SesionService, public dataUsuarios : DataUsuariosService, public datosEspecialidades: DataEspecialidadesService, public especialidades: DataEspecialidadesService){

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

  console.log('Especialistas filtrados:', this.especialistasFiltrados);
  }

  seleccionarEspecialista(especialista: Usuario) {
    this.especialistaSeleccionado = especialista;
    console.log('Especialista seleccionado:', especialista);
  }
  
}
