import { Component, Input } from '@angular/core';
import { Usuario } from '../../servicios/data-usuarios.service';
import { faAddressCard,  faIdBadge, faPerson, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { SesionService } from '../../servicios/sesion.service';

@Component({
  selector: 'app-card-perfil',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './card-perfil.component.html',
  styleUrl: './card-perfil.component.css'
})
export class CardPerfilComponent {



  iconoPerfil : IconDefinition = faPerson;
  iconoDni : IconDefinition = faAddressCard;
  iconoEdad : IconDefinition = faIdBadge

  constructor( public sesion: SesionService){

  }
  
}
