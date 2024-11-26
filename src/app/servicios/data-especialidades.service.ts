import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';

export interface Especialidad{
  especialidad : string,
  foto : string,
}

@Injectable({
  providedIn: 'root'
})
export class DataEspecialidadesService {
  
  public coleccionEspecialidades:Especialidad[] = [];
  private url : string = "https://ilhsggimglmzbnkuzgis.supabase.co/storage/v1/object/public/clinica/general.png";

  constructor(private firestore: Firestore) { 
    this.obtenerEspecialidades();
  }
  
  crearRegistro(especialidad : Especialidad) {
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, {especialidad : especialidad, foto : this.url})
  }

  obtenerEspecialidades(){
    let col = collection(this.firestore, 'especialidades');
    const observable = collectionData(col);
    observable.subscribe((respuesta:any) => {
      this.coleccionEspecialidades = respuesta;
    })

  }
}
