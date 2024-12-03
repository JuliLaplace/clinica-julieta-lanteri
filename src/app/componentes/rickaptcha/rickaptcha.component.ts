import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight, faArrowsRotate, faHandPointUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { CaptchaService } from '../../servicios/captcha.service';


@Component({
  selector: 'rickaptcha',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './rickaptcha.component.html',
  styleUrl: './rickaptcha.component.css',
})
export class RickaptchaComponent implements OnInit {
  @Output() resolved = new EventEmitter<boolean>();

  iconArrowRight: IconDefinition = faArrowRight;
  iconArrowLeft: IconDefinition = faArrowLeft;
  iconPoint: IconDefinition = faHandPointUp;
  iconReload: IconDefinition = faArrowsRotate;
  iconBack: IconDefinition = faArrowLeft;
  
  
  @ViewChild("directionCanvas") directionCanvas!: ElementRef;
  @ViewChild("targetCanvas") targetCanvas!: ElementRef;

  numbers: number[] = [];
  displayPopUp: boolean = false;
  captchaSuccess: boolean = false;
  captchaError: boolean = false;
  captchaErrorMsg: string = '';

  constructor(public captchaService: CaptchaService) { }

  ngOnInit(): void {
  }

  private async drawCanvasImg(canvas: HTMLCanvasElement, src: string, width: number, height: number) {
    let cx = canvas.getContext('2d');
    if (cx) {
      let image = await this.loadImage(src);
      
      canvas.width = width;
      canvas.height = height;
      
      cx.lineWidth = 3;
      cx.lineCap = 'round';
      cx.strokeStyle = '#000';
      cx.drawImage(image, 0, 0, width, height);
    }
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    const image = new Image();
    image.src = src;
    return new Promise(resolve => {
        image.onload = (ev) => {
            resolve(image);
        }
    });
  }

  previousIndex() {
    this.drawCanvasImg(this.targetCanvas.nativeElement, this.captchaService.getPreviousTarget(), 250, 250);
  }

  nextIndex() {
    this.drawCanvasImg(this.targetCanvas.nativeElement, this.captchaService.getNextTarget(), 250, 250);
  }

  back() {
    this.displayPopUp = false;
  }

  reload() {
    this.drawCanvasImg(this.directionCanvas.nativeElement, this.captchaService.getNewDirection(), 200, 200);
    this.drawCanvasImg(this.targetCanvas.nativeElement, this.captchaService.getNewTarget(), 250, 250);
    this.numbers = Array(this.captchaService.getTargetSize()).fill(0);
  }

  public async completeCaptcha() {
    this.captchaError = false;
    this.captchaErrorMsg = '';

    this.displayPopUp = false
    let success: boolean = await this.captchaService.resolveCaptcha();

    if (success) {
      this.captchaSuccess = true;
      this.resolved.emit(true);
      
      setTimeout(() => {
        this.captchaSuccess = false;
        this.captchaError = true;
        this.captchaErrorMsg = 'Verificación vencida. Completá el captcha de nuevo.';
        this.resolved.emit(false);
      }, 60 * 1000);
    } else {
      this.captchaError = true;
      this.captchaErrorMsg = 'Verificación fallada. Inténtalo de nuevo.';
      this.resolved.emit(false);
    }
  }

  showPopUp() {
    if (!this.captchaSuccess) {
      this.displayPopUp = true;
      setTimeout(() => {
        this.reload();
      }, 50);
    }
  }
}
