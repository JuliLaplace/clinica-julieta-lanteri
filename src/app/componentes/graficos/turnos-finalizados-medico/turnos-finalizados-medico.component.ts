import { Component } from '@angular/core';
import { DataSetPie, EstadisticasService } from '../../../servicios/estadisticas.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DataTurnosService, Turno } from '../../../servicios/data-turnos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turnos-finalizados-medico',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, FormsModule],
  templateUrl: './turnos-finalizados-medico.component.html',
  styleUrl: './turnos-finalizados-medico.component.css'
})
export class TurnosFinalizadosMedicoComponent {

  fechaTurnosSolicitadosDesde!: Date;
  fechaTurnosSolicitadosHasta!: Date;

  constructor(public dataEstadisticas: EstadisticasService, public dataTurnos: DataTurnosService){
    this.dataTurnos.obtenerDatosObservable().subscribe((res: Turno[])=>{
      let dataSet = dataEstadisticas.crearDataSetTurnosFinalizadosMedico(res);
      this.crearOpciones(dataSet);
    });
  }

  

  barra: typeof Highcharts = Highcharts;
  opcionesBarra!: Highcharts.Options;

  crearOpciones(dataSet : any){
    this.opcionesBarra={
      title: {
        text: 'Cantidad de turnos finalizados por especialista',
        align: 'left'
      },
      xAxis:{
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
              position: 'left'
          },
      }],

        animation: {
          duration: 3000
      },
        data: dataSet,
        type: 'bar',
        
        
      }],
    }
  }

  filtrarFechaTurnosSolicitados(){
    if(this.fechaTurnosSolicitadosDesde && this.fechaTurnosSolicitadosHasta){
      
    }
  }
}
