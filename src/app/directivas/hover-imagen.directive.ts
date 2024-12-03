import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverImagen]',
  standalone: true
})
export class HoverImagenDirective {

  @Input() imagen2: string | null = null; 

  constructor(private el: ElementRef, private renderer: Renderer2) {}


  @HostListener('mouseenter') onMouseEnter() {
    if (this.imagen2) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.imagen2);
    }
  }


  @HostListener('mouseleave') onMouseLeave() {
    const imagenOriginal = this.el.nativeElement.getAttribute('data-original-src');
    this.renderer.setAttribute(this.el.nativeElement, 'src', imagenOriginal);
  }


  ngOnInit() {
    const imagenOriginal = this.el.nativeElement.getAttribute('src');
    this.renderer.setAttribute(this.el.nativeElement, 'data-original-src', imagenOriginal);
  }

}
