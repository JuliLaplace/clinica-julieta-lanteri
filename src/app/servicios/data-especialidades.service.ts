import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';

export interface Especialidad{
  especialidad : string,
}

@Injectable({
  providedIn: 'root'
})
export class DataEspecialidadesService {
  
  public coleccionEspecialidades:Especialidad[] = [];

  constructor(private firestore: Firestore) { 
    this.obtenerEspecialidades();
  }
  
  crearRegistro(especialidad : Especialidad) {
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, {especialidad : especialidad})
  }

  obtenerEspecialidades(){
    let col = collection(this.firestore, 'especialidades');
    const observable = collectionData(col);
    observable.subscribe((respuesta:any) => {
      this.coleccionEspecialidades = respuesta;
    })

  }
}
