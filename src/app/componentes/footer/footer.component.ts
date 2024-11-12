import { Component } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faClock, faLocationDot, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import {faWhatsappSquare} from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ FontAwesomeModule,],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  iconoTelefono : IconDefinition = faPhoneVolume;
  iconoUbicacion : IconDefinition = faLocationDot;
  iconoReloj : IconDefinition = faClock;
  iconoWpp : IconDefinition = faWhatsappSquare;
}
