import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormViewerService } from '../../servicios/form-viewer.service';
import { DataUsuariosService, Usuario } from '../../servicios/data-usuarios.service';
import { LoaderService } from '../../servicios/loader.service';
import { TipoUsuario } from '../../enumerables/tipo-usuario';
import Swal from 'sweetalert2'
import { RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/login.service';
import { RecaptchaModule } from "ng-recaptcha";
import { StorageService } from '../../servicios/storage.service';
import { SesionService } from '../../servicios/sesion.service';

@Component({
  selector: 'app-formulario-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RecaptchaModule],
  templateUrl: './formulario-paciente.component.html',
  styleUrl: './formulario-paciente.component.css'
})
export class FormularioPacienteComponent {
  altaPersona!: FormGroup;
  botonSeleccionado: string = '';
  captchaResponse : string | null=null;
  foto1! : File;
  foto2! : File;

  @Output() loadingChange = new EventEmitter<boolean>();

  constructor(public servicioForm: FormViewerService, private dataUsuarios: DataUsuariosService, private servicioLoader: LoaderService, private servicioLogin: LoginService, private servicioStorage: StorageService, public sesion: SesionService) {

  }

  ngOnInit() {
    this.altaPersona = new FormGroup({
      apellido: new FormControl('', [Validators.required, Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      nombre: new FormControl('', [Validators.required, Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      dni : new FormControl('',[Validators.required,Validators.pattern(this.servicioForm.numeroRegex),  Validators.min(11111)]),
      edad : new FormControl('',[Validators.pattern(this.servicioForm.numeroRegex), Validators.required,Validators.min(0), Validators.max(100)]),
      obraSocial: new FormControl('', [Validators.required, Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.servicioForm.emailRegex)]),
      pwd: new FormControl('', [Validators.required, Validators.minLength(6)]),

    })
  }


  cargarPersona() {

    if (this.altaPersona.valid) {
      const email = this.altaPersona.get('email')?.value;
      const pwd = this.altaPersona.get('pwd')?.value;
      this.loadingChange.emit(true);

      this.servicioLogin.registrar(email, pwd)
        .then((res) => {
          if(!res.errorFlag){
            this.cargarUsuarioBD();
          }
        })

        .then((id) => {
          console.log('Usuario creado con ID:', id);

          
          Swal.fire({
            title: "¡Paciente registrado con éxito!",
            showClass: {
              popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
              popup: `animate__animated animate__fadeOutDown animate__faster`
            }
          });

          this.loadingChange.emit(false);
          // this.altaPersona.reset();
          
        })
        .catch(error => {
          console.error('Error al crear usuario:', error);
          // Swal.fire({
          //   title: 'Error al registrar el paciente',
          //   text: 'No se pudo crear el usuario. Por favor, intenta de nuevo.',
          //   icon: 'error'
          // });
          
          this.loadingChange.emit(false);

        });
    } else {
      console.error('Formulario inválido');
    }


  }

  async cargarUsuarioBD(){
    if(this.altaPersona.valid){
      const usuario: Usuario = {
        nombre: this.altaPersona.get('nombre')?.value,
        apellido: this.altaPersona.get('apellido')?.value,
        edad: this.altaPersona.get('edad')?.value,
        dni: this.altaPersona.get('dni')?.value,
        mail: this.altaPersona.get('email')?.value,
        tipo: TipoUsuario.paciente,
        obraSocial: this.altaPersona.value.obraSocial,
        imagenPerfil1: await this.subirFoto(this.foto1, "1"),
        imagenPerfil2: await this.subirFoto(this.foto2, "2"),
        habilitado : null,
        especialidad : null
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
    const fileInput = document.getElementById('foto1') as HTMLInputElement;
    const fileInput2 = document.getElementById('foto2') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
    if (fileInput2) {
      fileInput2.value = ''; 
    }
    
  }
  subirFotoClick() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: Event, foto: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      
      if (foto === 'foto1') {
        this.foto1 = input.files[0];
      } else if (foto === 'foto2') {
        this.foto2 = input.files[0];
      }
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


  seleccionarUsuario(usuario: string) {
    this.altaPersona.reset();
    this.botonSeleccionado = usuario;
  }
  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse;

  }


}
