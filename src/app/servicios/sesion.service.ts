import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private usuarioActual : User | null = null;  //guardo el usuario
  
  constructor(private auth: Auth) { 
    onAuthStateChanged(auth, (usuario)=>{
      this.usuarioActual = usuario;
    });
  }

  getUsuario(): string{
    return this.usuarioActual?.email ? this.usuarioActual?.email : "";
  }

  sesionActiva(): boolean{
    return this.usuarioActual !=null;
  }
}
