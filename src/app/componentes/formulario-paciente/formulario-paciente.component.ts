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
@Component({
  selector: 'app-formulario-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './formulario-paciente.component.html',
  styleUrl: './formulario-paciente.component.css'
})
export class FormularioPacienteComponent {
  altaPersona!: FormGroup;
  botonSeleccionado: string = '';
  base64: any;
  @Output() loadingChange = new EventEmitter<boolean>();

  constructor(public servicioForm: FormViewerService, private dataUsuarios: DataUsuariosService, private servicioLoader: LoaderService, private servicioLogin: LoginService) {

  }

  ngOnInit() {
    this.altaPersona = new FormGroup({
      apellido: new FormControl('', [Validators.required, Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      nombre: new FormControl('', [Validators.required, Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      dni: new FormControl([Validators.pattern(this.servicioForm.numeroRegex), Validators.required, Validators.min(0)]),
      edad: new FormControl([Validators.pattern(this.servicioForm.numeroRegex), Validators.required, Validators.min(0), Validators.max(2)]),
      obraSocial: new FormControl('', [Validators.required, Validators.pattern(this.servicioForm.nombresRegex), Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.servicioForm.emailRegex)]),
      pwd: new FormControl('', [Validators.required, Validators.minLength(6)]),
      foto1: new FormControl(""),
      foto2: new FormControl(""),
    })
  }
  cargarPersona() {

    if (this.altaPersona.valid) {
      const email = this.altaPersona.get('email')?.value;
      const pwd = this.altaPersona.get('pwd')?.value;
      this.loadingChange.emit(true);
      

      this.servicioLogin.registrar(email, pwd)
        .then(() => {

          const usuario: Usuario = {
            nombre: this.altaPersona.get('nombre')?.value,
            apellido: this.altaPersona.get('apellido')?.value,
            edad: this.altaPersona.get('edad')?.value,
            dni: this.altaPersona.get('dni')?.value,
            mail: email,
            contrasena: pwd,
            tipo: TipoUsuario.paciente,
            obraSocial: this.altaPersona.value.obraSocial,
            imagenPerfil1: "../../../assets/clinica5.jpg",
            imagenPerfil2: "../../../assets/clinica5.jpg",
          };
          // this.loadingChange.emit(false);
          return this.dataUsuarios.crearRegistro(usuario);
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

          this.altaPersona.reset();
          
        })
        .catch(error => {
          console.error('Error al crear usuario:', error);
          Swal.fire({
            title: 'Error al registrar el paciente',
            text: 'No se pudo crear el usuario. Por favor, intenta de nuevo.',
            icon: 'error'
          });
          
          this.loadingChange.emit(false);

        });
    } else {
      console.error('Formulario inválido');
    }


  }


  seleccionarUsuario(usuario: string) {
    this.altaPersona.reset();
    this.botonSeleccionado = usuario;
  }


}
