import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faClock, faLocationDot, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import {faWhatsappSquare} from '@fortawesome/free-brands-svg-icons';
import { SesionService } from '../../servicios/sesion.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../servicios/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatButtonToggleModule, FontAwesomeModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  iconoTelefono : IconDefinition = faPhoneVolume;
  iconoUbicacion : IconDefinition = faLocationDot;
  iconoReloj : IconDefinition = faClock;
  iconoWpp : IconDefinition = faWhatsappSquare;

  constructor(public sesion: SesionService, private servicioLogin: LoginService){}

  cerrarSesion(){
    this.servicioLogin.logout()
    .then(()=>{
      
    })
  }

}
