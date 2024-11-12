import { Component, OnInit } from '@angular/core';
import { FormViewerService } from '../../servicios/form-viewer.service';
import { DataUsuariosService, Usuario } from '../../servicios/data-usuarios.service';
import { LoaderService } from '../../servicios/loader.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoUsuario } from '../../enumerables/tipo-usuario';
import { StorageService } from '../../servicios/storage.service';
import { RecaptchaModule } from "ng-recaptcha";
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DataEspecialidadesService } from '../../servicios/data-especialidades.service';
import { LoginService } from '../../servicios/login.service';
import { SesionService } from '../../servicios/sesion.service';

@Component({
  selector: 'app-formulario-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RecaptchaModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './formulario-especialista.component.html',
  styleUrl: './formulario-especialista.component.css'
})
export class FormularioEspecialistaComponent implements OnInit{

  altaPersona!: FormGroup;
  botonSeleccionado: string = '';
  loading: boolean = false;
  captchaResponse : string | null=null;
  foto1! : File;
  especialidadesBD: string [] = [];

  constructor(public servicioForm : FormViewerService, private dataUsuarios : DataUsuariosService, private servicioLoader: LoaderService, private servicioStorage: StorageService, public dataEspecialidades : DataEspecialidadesService, private servicioLogin: LoginService, public sesion : SesionService){

  }

  ngOnInit() {
    this.altaPersona = new FormGroup({
      apellido : new FormControl('', [Validators.required,Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      nombre : new FormControl('', [Validators.required,Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      dni : new FormControl('',[Validators.pattern(this.servicioForm.numeroRegex), Validators.required, Validators.min(11111)]),
      edad : new FormControl('',[Validators.pattern(this.servicioForm.numeroRegex), Validators.required,Validators.min(22), Validators.max(85)]),
      especialidad : new FormControl('',[Validators.required]),
      email : new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.servicioForm.emailRegex)]),
      pwd : new FormControl('',[Validators.required, Validators.minLength(6)]),
      // nuevaEspecialidad: new FormControl('', [Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3), Validators.maxLength(20)]),
      
    })
  }
  cargarPersona(){   
      
      const email = this.altaPersona.get('email')?.value;
      const pwd = this.altaPersona.get('pwd')?.value;
      this.servicioLoader.setLoading(true); 
      this.loading = this.servicioLoader.getLoading();

      this.servicioLogin.registrar(email, pwd)
      .then((res) => {
        if(!res.errorFlag){
          this.cargarUsuarioBD();
        }
      })
        .then(id => {
          console.log('Paciente creado con ID:', id);
          // this.servicioLoader.setLoading(false);

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
          // this.altaPersona.reset();
        })
        .catch(error => {
          console.error('Error al crear usuario:', error);
          
        });
    
  }



  async cargarUsuarioBD(){
    if(this.altaPersona.valid){
      const usuario: Usuario = {
        nombre: this.altaPersona.get('nombre')?.value,
        apellido: this.altaPersona.get('apellido')?.value,
        edad: this.altaPersona.get('edad')?.value,
        dni: this.altaPersona.get('dni')?.value,
        mail: this.altaPersona.get('email')?.value,
        tipo: TipoUsuario.especialista,
        especialidad : this.altaPersona.get('especialidad')?.value,
        obraSocial: null,
        imagenPerfil1: await this.subirFoto(this.foto1, "1"),
        imagenPerfil2 : null,
        habilitado : false,
      }
      this.dataUsuarios.crearRegistro(usuario)
      .then((id)=>{
        usuario.id =  id;
        this.limpiarDatos()
      });
    }
  }
  limpiarDatos() {
    // this.errorFlag=false;
    this.altaPersona.reset();
  }
  subirFotoClick() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }
  onFileSelected(event: Event, foto: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto1 = input.files[0];
      console.log('Foto seleccionada:', this.foto1); // Para verificación
    }
  }
  async  subirFoto(foto: File, numero: string)  {
    let respuesta = '';
    let email = this.altaPersona.get('email')?.value;
    if (foto) {
      return await this.servicioStorage.upload(`${email}-${numero}`, foto);
    } 
    return respuesta;
  }

  seleccionarUsuario(usuario:string){
    this.altaPersona.reset();
    this.botonSeleccionado = usuario;
  }

  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse;
    console.log("Captcha resuelto:", this.captchaResponse); // Para verificación

  }
  agregarEspecialidad() {
    const nuevaEspecialidad = this.altaPersona.get('nuevaEspecialidad')?.value;
    if (nuevaEspecialidad) {
      this.dataEspecialidades.crearRegistro(nuevaEspecialidad);
      this.altaPersona.get('nuevaEspecialidad')?.reset(); 
    }
  }


 
}
