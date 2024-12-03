import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { DataHorariosEspecialistaService } from './servicios/data-horarios-especialista.service';
import { routeAnimations } from './animations';
import { LoggerService } from './servicios/logger.service';
import { DataTurnosService } from './servicios/data-turnos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css', 
  animations: [
    routeAnimations,
  ]
})
export class AppComponent {

  constructor(private dataHorarios : DataHorariosEspecialistaService, private contexts: ChildrenOutletContexts, public servicioLogger : LoggerService, private dataTurnos: DataTurnosService){

  }
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
