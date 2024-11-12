import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';

export interface HorarioDia {
  id?: string;  
  dia: string;          
  desde: string;       
  hasta: string;    
  mail: string,
  especialidad: string[],    
}

@Injectable({
  providedIn: 'root'
})
export class DataHorariosEspecialistaService {

  public coleccionHorarios:HorarioDia[] = [];

  constructor(private firestore: Firestore) {
    
   }

   crearRegistro(horarios : HorarioDia) {
    let col = collection(this.firestore, 'horarios-especialistas');
    addDoc(col, {horarios : horarios})
  }

  obtenerHorariosEspecialista(){
    let col = collection(this.firestore, 'horarios-especialistas');
    const observable = collectionData(col);
    observable.subscribe((respuesta:any) => {
      this.coleccionHorarios = respuesta;
    })

  }
}
