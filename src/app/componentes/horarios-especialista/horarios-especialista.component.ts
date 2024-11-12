import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../servicios/data-usuarios.service';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-horarios-especialista',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './horarios-especialista.component.html',
  styleUrl: './horarios-especialista.component.css'
})
export class HorariosEspecialistaComponent implements OnInit {

  @Input() usuario!: Usuario;

  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horarios = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30', '15:00', '15:30','16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

  horariosEspecialista : string[] = [];

  selecciones: { dia: string, desde: string, hasta: string }[] = [];


 constructor(){
 
 }
 ngOnInit(): void {
  this.selecciones = this.dias.map(dia => ({
    dia,
    desde: '',
    hasta: ''
  }));
}

 cargarHorariosEspecialista() {
  this.horariosEspecialista = []; 
  this.selecciones.forEach((seleccion, index) => {
    const dia = this.dias[index];
    const { desde, hasta } = seleccion;

 
    if (desde && hasta) {
      this.horariosEspecialista.push(`${dia}, ${desde}-${hasta}`);
    } else {
      this.horariosEspecialista.push(`${dia}, -`);
    }
  });

  console.log(this.horariosEspecialista); 
}



  imprimirHorasFraccionadas(horaMin:number, horaMax:number){
    let numeros: string [] = [];

    for(let i = horaMin; i<=horaMax; i++){

      numeros.push(i.toString() + ':00');
      numeros.push(i.toString() + ':30');
    }
    console.log(numeros)
  }
}
