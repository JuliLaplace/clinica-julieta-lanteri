import { Component } from '@angular/core';
import { CardPerfilComponent } from '../componentes/card-perfil/card-perfil.component';
import { SesionService } from '../servicios/sesion.service';
import { DataUsuariosService, Usuario } from '../servicios/data-usuarios.service';
import { CommonModule } from '@angular/common';
import { HorariosEspecialistaComponent } from '../componentes/horarios-especialista/horarios-especialista.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagina-mi-perfil',
  standalone: true,
  imports: [CardPerfilComponent, CommonModule, HorariosEspecialistaComponent, FormsModule],
  templateUrl: './pagina-mi-perfil.component.html',
  styleUrl: './pagina-mi-perfil.component.css'
})
export class PaginaMiPerfilComponent {
  
  usuario : any = undefined;
  constructor(public sesion : SesionService, public dataUsuario: DataUsuariosService){
    
  }
  ngOnInit() {
    const email = this.sesion.getUsuario(); 
    if (email) {
      this.dataUsuario.obtenerUsuarioPorEmail(email)
      .then((usuario) => {
          this.usuario = usuario; 
        },
        (error) => {
          console.error('Error obteniendo usuario:', error);
        }
      );
    }
  }
}
