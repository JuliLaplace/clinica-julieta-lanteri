import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

import { CommonModule } from '@angular/common';
import { EstadisticasService } from '../../../servicios/estadisticas.service';
import { DataTurnosService, Turno } from '../../../servicios/data-turnos.service';




@Component({
  selector: 'app-pie-animada',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './pie-animada.component.html',
  styleUrl: './pie-animada.component.css'
})
export class PieAnimadaComponent{

 
  

  constructor(public dataEstadisticas: EstadisticasService, public dataTurnos: DataTurnosService){
    this.dataTurnos.obtenerDatosObservable().subscribe((res: Turno[])=>{
      let dataSet = dataEstadisticas.crearDataSetTurnosPorDia(res);
      this.crearOpciones(dataSet);
      this.animarPie(this.pieAnimada);
    });
  }

 

  pieAnimada: typeof Highcharts = Highcharts;
  opcionesPieAnimada!: Highcharts.Options;

  crearOpciones(data:any){
    this.opcionesPieAnimada={
      title: {
        text: 'Cantidad de turnos por día',
        align: 'left'
      },
      
      series: [{
        name: 'Cantidad de turnos',
        animation: {
          duration: 3000
      },
        data: data,
        type: 'pie',
        
      }],
    }
  }
  animarPie(H: any) {
    H.seriesTypes.pie.prototype.animate = function (init: any) {
      const series = this,
        chart = series.chart,
        points = series.points,
        {
          animation
        } = series.options,
        {
          startAngleRad
        } = series;

      function fanAnimate(point: any, startAngleRad: any) {
        const graphic = point.graphic,
          args = point.shapeArgs;

        if (graphic && args) {

          graphic
            // Set inital animation values
            .attr({
              start: startAngleRad,
              end: startAngleRad,
              opacity: 1
            })
            // Animate to the final position
            .animate({
              start: args.start,
              end: args.end
            }, {
              duration: animation.duration / points.length
            }, function () {
              // On complete, start animating the next point
              if (points[point.index + 1]) {
                fanAnimate(points[point.index + 1], args.end);
              }
              // On the last point, fade in the data labels, then
              // apply the inner size
              if (point.index === series.points.length - 1) {
                series.dataLabelsGroup.animate({
                  opacity: 1
                },
                  void 0,
                  function () {
                    points.forEach((point: any) => {
                      point.opacity = 1;
                    });
                    series.update({
                      enableMouseTracking: true
                    }, false);
                    chart.update({
                      plotOptions: {
                        pie: {
                          innerSize: '40%',
                          borderRadius: 8
                        }
                      }
                    });
                  });
              }
            });
        }
      }

      if (init) {
        // Hide points on init
        points.forEach((point: any) => {
          point.opacity = 0;
        });
      } else {
        fanAnimate(points[0], startAngleRad);
      }
    };
  };

}
