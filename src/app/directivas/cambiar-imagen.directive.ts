import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCambiarImagen]',
  standalone: true
})
export class CambiarImagenDirective {

  @Input() imagen1!: string; 
  @Input() imagen2!: string; 

  constructor(private el: ElementRef) {}


  @HostListener('mouseenter') onMouseEnter() {
    this.cambiarImagen(this.imagen2); 
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.cambiarImagen(this.imagen1); 
  }

  private cambiarImagen(imagen: string): void {
    const imgElement = this.el.nativeElement as HTMLImageElement;
    if (imgElement && imgElement.tagName === 'IMG') {
      imgElement.src = imagen;
    }
  }

}
