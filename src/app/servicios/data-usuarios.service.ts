import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { SesionService } from './sesion.service';
import { TipoUsuario } from '../enumerables/tipo-usuario';
import { Observable } from 'rxjs';

export interface Usuario{
  id?: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  mail: string;
  contrasena: string;
  tipo: TipoUsuario;
  obraSocial?: string; 
  especialidad?: string; 
  imagenPerfil1: string; 
  imagenPerfil2?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataUsuariosService {

  public coleccionUsuarios:Usuario[] = [];
  
  constructor(private firestore : Firestore, private sesion : SesionService) {
    this.obtenerDatos();
   }

  async crearRegistro(usuario : Usuario): Promise<string> {
    let col = collection(this.firestore, 'usuarios');
    return await addDoc(col, usuario)
    .then((ref)=>{
      return ref.id;
    });
  }


  obtenerDatos(){
    let col = collection(this.firestore, 'usuarios');
    const observable = collectionData(col, { idField: 'id' });
    observable.subscribe((respuesta:any) => {
      this.coleccionUsuarios = respuesta;

      // console.log(respuesta);
    })

  }
  
  async obtenerTipoUsuarioPorEmail(email: string): Promise<TipoUsuario | null> {
    const col = collection(this.firestore, 'usuarios');
    const obtenerQuery = query(col, where('mail', '==', email));
    
    
    const querySnapshot = await getDocs(obtenerQuery);
  
    if (!querySnapshot.empty) {
      const usuario = querySnapshot.docs[0].data() as Usuario;
      return usuario.tipo; 
    }
  
    return null; 
  }
}
