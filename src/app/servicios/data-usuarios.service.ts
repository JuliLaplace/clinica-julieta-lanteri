import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { TipoUsuario } from '../enumerables/tipo-usuario';

export interface Usuario{
  id?: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  mail: string;
  tipo: TipoUsuario;
  obraSocial: string |null; 
  especialidad: string[] | null; 
  imagenPerfil1: string; 
  imagenPerfil2: string | null;
  habilitado : boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class DataUsuariosService {

  public coleccionUsuarios:Usuario[] = [];
  public coleccionPacientes:Usuario[] = [];
  public coleccionEspecialistas:Usuario[] = [];

  
  constructor(private firestore : Firestore) {
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
    const observable = collectionData(col, {idField: 'id'});
    observable.subscribe((respuesta:any) => {
      this.coleccionUsuarios = respuesta;
      this.coleccionEspecialistas = this.coleccionUsuarios.filter((usuario)=>{return usuario.tipo == TipoUsuario.especialista});
      this.coleccionPacientes = this.coleccionUsuarios.filter((usuario)=>{return usuario.tipo == TipoUsuario.paciente});
    })

  }
  
  async obtenerUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const col = collection(this.firestore, 'usuarios');
    const obtenerQuery = query(col, where('mail', '==', email));
    
    const querySnapshot = await getDocs(obtenerQuery);
  
    if (!querySnapshot.empty) {
      const usuario = querySnapshot.docs[0].data() as Usuario;
      return usuario; 
    }
  
    return null; 
  }

  private modificarRegistro(usuario : Usuario, data: any) {
    console.log(usuario);
    let col = collection(this.firestore, 'usuarios');
    const docRef = doc(col, usuario.id);
    
    updateDoc(docRef, data);
  }

  cambiarHabilitacionEspecialista(usuario : Usuario, habilitado: boolean ){
    this.modificarRegistro(usuario, {habilitado : habilitado});
  }


  
}
