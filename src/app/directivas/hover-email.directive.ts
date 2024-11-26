import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverEmail]',
  standalone: true
})
export class HoverEmailDirective {

  @Input('appHoverEmail') email!: string;

  tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.tooltipElement = this.renderer.createElement('div');
    const text = this.renderer.createText(this.email);

    this.renderer.appendChild(this.tooltipElement, text);
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);

    this.renderer.addClass(this.tooltipElement, 'tooltip');
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

}
