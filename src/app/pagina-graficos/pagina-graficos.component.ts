import { Component, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { PieComponent } from '../componentes/graficos/turnos-por-especialidad/pie.component';
import {MatTabsModule} from '@angular/material/tabs';
import { LogsComponent } from '../componentes/logs/logs.component';
import { PieAnimadaComponent } from '../componentes/graficos/turnos-por-dia/pie-animada.component';
import { TurnosFinalizadosMedicoComponent } from '../componentes/graficos/turnos-finalizados-medico/turnos-finalizados-medico.component';
import { TurnosSolicitadosMedicoComponent } from '../componentes/graficos/turnos-solicitados-medico/turnos-solicitados-medico.component';

@Component({
  selector: 'app-pagina-graficos',
  standalone: true,
  imports: [HighchartsChartModule, PieAnimadaComponent, PieComponent, MatTabsModule, LogsComponent, TurnosFinalizadosMedicoComponent, TurnosSolicitadosMedicoComponent],
  templateUrl: './pagina-graficos.component.html',
  styleUrl: './pagina-graficos.component.css'
})
export class PaginaGraficosComponent {


  
}
