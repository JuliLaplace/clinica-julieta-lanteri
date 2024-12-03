import { Component } from '@angular/core';
import { LoggerService } from '../../servicios/logger.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {

  constructor( public servicioLogger: LoggerService){

  }
}
