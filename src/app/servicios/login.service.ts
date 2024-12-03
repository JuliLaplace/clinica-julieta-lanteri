import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
import { SesionService } from './sesion.service';
import { DataUsuariosService } from './data-usuarios.service';
import { TipoUsuario } from '../enumerables/tipo-usuario';
import { LoggerService } from './logger.service';

export interface loginError {
  errorFlag: boolean;
  errorMsj: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: Auth, private router: Router, private sesion: SesionService, private dataUsuarios : DataUsuariosService, private logger : LoggerService) { }


  async registrar(email: string, pwd: string): Promise<loginError> {
    let esAdmin = this.sesion.esAdmin();
    let user = this.auth.currentUser;
    let error: loginError = {
      errorFlag: false,
      errorMsj: ""
    }
    

    return createUserWithEmailAndPassword(this.auth, email, pwd)
      .then((res) => {
        
        sendEmailVerification(res.user);
        
        if(!esAdmin){
          this.auth.signOut();
          this.router.navigate(['/login']);
        }
        if(esAdmin){
          this.auth.updateCurrentUser(user);
        }

        error.errorFlag = false;
        return error;
      })
      .catch((e) => {
        error.errorFlag = true;
        switch (e.code) {
          case "auth/invalid-email":
            error.errorMsj = "Ingrese un email válido";
            break;
          case "auth/email-already-in-use":
            error.errorMsj = "Email ya registrado";
            break;
          case "auth/weak-password":
            error.errorMsj = "La contraseña debe tener más de 6 caracteres";
            break;
          case "auth/missing-password":
            error.errorMsj = "Debe ingresar una contraseña";
            break;
          case "auth/missing-email":
            error.errorMsj = "Debe ingresar un email para registrarse";
            break;
          default:
            error.errorMsj = e.code
            break;
        }
        return error;
      });
  }

  async login(email: string, pwd: string): Promise<loginError> {
    let error: loginError = {
      errorFlag: false,
      errorMsj: ""
    }

    return signInWithEmailAndPassword(this.auth, email, pwd)
      .then((res) => {
        
        // if(res.user.emailVerified){
         
        //   this.router.navigate(['/home']);
        //   return error;
        // }else{
        //   error.errorFlag = true;
        //   error.errorMsj = "Cuenta no verificada."
        //   this.auth.signOut();
        //   return error;
        // }
        if (!res.user.emailVerified) { //aca me fijo si ninguno tiene la cuenta verificada
          error.errorFlag = true;
          error.errorMsj = "Cuenta no verificada.";
          this.auth.signOut();
          return error;
        }
        return this.dataUsuarios.obtenerUsuarioPorEmail(email)
        .then((usuario) => {
          if (usuario && usuario.tipo === TipoUsuario.especialista && !usuario.habilitado) {
            error.errorFlag = true;
            error.errorMsj = "Especialista no habilitado.";
            this.auth.signOut();
            return error;
          }

          this.router.navigate(['/home']);
          this.logger.crearLog();
          return error;
        });

      })
      .catch(
        (e) => {
          error.errorFlag = true;
          switch (e.code) {
            default:
              error.errorMsj = "Usuario o contraseña incorrectos."
              break;
          }
          return error;
        }
      )
  }


  async logout(): Promise<void> {
    console.log(this.auth.currentUser?.email)
    return signOut(this.auth)
      .then(() => {
        this.router.navigate(['/login']);
      });
  }

}
