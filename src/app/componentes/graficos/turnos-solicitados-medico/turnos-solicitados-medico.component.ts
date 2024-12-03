import { Component } from '@angular/core';
import { EstadisticasService } from '../../../servicios/estadisticas.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule } from '@angular/common';
import { DataTurnosService, Turno } from '../../../servicios/data-turnos.service';
@Component({
  selector: 'app-turnos-solicitados-medico',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './turnos-solicitados-medico.component.html',
  styleUrl: './turnos-solicitados-medico.component.css'
})
export class TurnosSolicitadosMedicoComponent {

  fechaTurnosSolicitadosDesde!: Date;
  fechaTurnosSolicitadosHasta!: Date;

  constructor(public dataEstadisticas: EstadisticasService, public dataTurnos: DataTurnosService){
    this.dataTurnos.obtenerDatosObservable().subscribe((res: Turno[])=>{
      let dataSet = dataEstadisticas.crearDataSetTurnosSolicitadosMedico(res);
      this.crearOpciones(dataSet);
    });
  }

  ngOnInit(): void {
    
  }

  barra: typeof Highcharts = Highcharts;
  opcionesBarra!: Highcharts.Options;

  crearOpciones(dataSet : any){
    this.opcionesBarra = {
      title: {
        text: 'Cantidad de turnos solicitados por especialista',
        align: 'left'
      },
      xAxis: {
        title: {
          text: 'Especialistas'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de turnos'
        }
      },

      series: [{
        name: 'Cantidad de turnos',
        dataLabels: [{
          enabled: true,
        }, {
          enabled: true,
          format: '{point.name}',
          style: {
            fontSize: '1.2em',
            textOutline: 'none',
            opacity: 0.7,
            padding: '10em'

          },
        }],
        animation: {
          duration: 3000
        },
        data: dataSet,
        type: 'column',

      }],
    }
  }
}
