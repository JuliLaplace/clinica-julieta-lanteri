import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { DataUsuariosService, Usuario } from './data-usuarios.service';
import { TipoUsuario } from '../enumerables/tipo-usuario';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private usuarioActual : User | null = null;  //guardo el usuario
  public usuarioBD : Usuario | null = null;
  
  constructor(private auth: Auth, private datosUsuario: DataUsuariosService) { 
    onAuthStateChanged(auth, async(usuario)=>{
      this.usuarioActual = usuario;
      if(usuario && usuario.email){
        this.usuarioBD = await datosUsuario.obtenerUsuarioPorEmail(usuario.email);
      }else{
        this.usuarioBD = null;
      }
    });
  }

  getUsuario(): string{
    return this.usuarioActual?.email ? this.usuarioActual?.email : "";
  }

  sesionActiva(): boolean{
    return this.usuarioActual !=null;
  }

  esAdmin(): boolean{
    return (this.usuarioBD && this.usuarioBD.tipo == TipoUsuario.administrador) ? true :  false;
  }
  esPaciente(): boolean{
    return (this.usuarioBD && this.usuarioBD.tipo == TipoUsuario.paciente) ? true :  false;
  }
  esEspecialista(): boolean{
    return (this.usuarioBD && this.usuarioBD.tipo == TipoUsuario.especialista) ? true :  false;
  }
}
