import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoaderService } from '../../servicios/loader.service';
import { FormularioEspecialistaComponent } from '../formulario-especialista/formulario-especialista.component';
import { FormularioPacienteComponent } from '../formulario-paciente/formulario-paciente.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormularioEspecialistaComponent, FormularioPacienteComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent{


  botonSeleccionado: string = '';
  loading: boolean = false;


  constructor(private servicioLoader: LoaderService){

  }
  onLoadingChange(isLoading: boolean) {
    this.loading = isLoading;
    this.servicioLoader.setLoading(isLoading);
  }

 

  seleccionarUsuario(usuario:string){
    // this.altaPersona.reset();
    console.log('Usuario seleccionado:', usuario);
    this.botonSeleccionado = usuario;
    this.onLoadingChange(false);
  }


  
}
