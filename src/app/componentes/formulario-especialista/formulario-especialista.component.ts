import { Component, OnInit } from '@angular/core';
import { FormViewerService } from '../../servicios/form-viewer.service';
import { DataUsuariosService, Usuario } from '../../servicios/data-usuarios.service';
import { LoaderService } from '../../servicios/loader.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoUsuario } from '../../enumerables/tipo-usuario';

@Component({
  selector: 'app-formulario-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './formulario-especialista.component.html',
  styleUrl: './formulario-especialista.component.css'
})
export class FormularioEspecialistaComponent implements OnInit{

  altaPersona!: FormGroup;
  botonSeleccionado: string = '';
  loading: boolean = false;
  base64:any;

  constructor(public servicioForm : FormViewerService, private dataUsuarios : DataUsuariosService, private servicioLoader: LoaderService){

  }

  ngOnInit() {
    this.altaPersona = new FormGroup({
      apellido : new FormControl('', [Validators.required,Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      nombre : new FormControl('', [Validators.required,Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      dni : new FormControl([Validators.pattern(this.servicioForm.numeroRegex), Validators.required, Validators.min(0)]),
      edad : new FormControl([Validators.pattern(this.servicioForm.numeroRegex), Validators.required,Validators.min(0), Validators.max(2)]),
      especialidad : new FormControl('',[Validators.required]),
      email : new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.servicioForm.emailRegex)]),
      pwd : new FormControl('',[Validators.required, Validators.minLength(6)]),
      foto1 : new FormControl(""),
    })
  }
  cargarPersona(){
    if (this.altaPersona.valid) {

      const usuario: Usuario = {
        nombre: this.altaPersona.get('nombre')?.value,
        apellido: this.altaPersona.get('apellido')?.value,
        edad: this.altaPersona.get('edad')?.value,
        dni: this.altaPersona.get('dni')?.value,
        mail: this.altaPersona.get('email')?.value,
        contrasena: this.altaPersona.get('pwd')?.value,
        tipo: TipoUsuario.especialista,
        imagenPerfil1 : "../../../assets/clinica5.jpg",
      };
  
  
      this.servicioLoader.setLoading(true); 
      this.loading = this.servicioLoader.getLoading();
      this.dataUsuarios.crearRegistro(usuario)
        .then(id => {
          console.log('Paciente creado con ID:', id);
          this.servicioLoader.setLoading(false);
          // Swal.fire("Usuario cargado con exito!");
          Swal.fire({
            title: "¡Paciente registrado con exito!",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });
          this.loading = this.servicioLoader.getLoading();
          this.altaPersona.reset();
        })
        .catch(error => console.error('Error al crear usuario:', error));
    } else {
      console.error('Formulario inválido');
    }
  }


  seleccionarUsuario(usuario:string){
    this.altaPersona.reset();
    this.botonSeleccionado = usuario;
  }


  subirFoto(){

  }


  onInputChanged(event:any){
    let targetEvent = event.target;
    let file:File = targetEvent.files[0];
    let fileReader:FileReader = new FileReader();

    fileReader.onload = (e) =>{
      this.base64 = fileReader.result;
    }

    fileReader.readAsDataURL(file);
  }
}
