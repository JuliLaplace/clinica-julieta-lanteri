import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { DataUsuariosService, Usuario } from '../../servicios/data-usuarios.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatPaginator, MatPaginatorModule],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css'
})
export class TablaUsuariosComponent {
  displayedColumns: string[] = ['nombre', 'apellido', 'edad', 'dni', 'obraSocial', 'especialidad', 'habilitado', 'imagenPerfil1', 'imagenPerfil2'];

  agregarUsuario: boolean = false;

  constructor(public dataUsuarios: DataUsuariosService) {

  }

  habilitarEspecialista(usuario: Usuario) {
    this.dataUsuarios.cambiarHabilitacionEspecialista(usuario, true)
      
  }
  deshabilitarEspecialista(usuario: Usuario) {
    this.dataUsuarios.cambiarHabilitacionEspecialista(usuario, false)
  }

}
