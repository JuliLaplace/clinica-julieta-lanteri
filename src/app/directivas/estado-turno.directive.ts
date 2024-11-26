import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { EstadoTurno } from '../enumerables/estado-turno';
@Directive({
  selector: '[appEstadoTurno]',
  standalone: true
})
export class EstadoTurnoDirective implements OnChanges {

  @Input('appEstadoTurno') estado: EstadoTurno = EstadoTurno.pendiente;

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  
  ngOnChanges(): void {
    this.setColor();
  }

  private setColor(): void {
    let color = '';

    switch (this.estado) {
      case EstadoTurno.pendiente:
        color = 'blue';
        break;
      case EstadoTurno.cancelado:
      case EstadoTurno.rechazado:
        color = 'red';
        break;
      case EstadoTurno.finalizado:
        color = 'green';
        break;
      case EstadoTurno.aceptado:
        color = 'violet';
        break;
      default:
        color = 'black'; 
    }
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', '800');


  }
}
