import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, Firestore, getDocs, limit, query, where } from '@angular/fire/firestore';

export interface HorarioSemanal {         
  horariosDiarios: HorarioDiario[];   
  mail: string,
}


export interface HorarioDiario{
  dia: string;
  horarios : string[];
  especialidad: string,    
}

@Injectable({
  providedIn: 'root'
})
export class DataHorariosEspecialistaService {

  public coleccionHorarios:HorarioSemanal[] = [];

  constructor(private firestore: Firestore) {
    this.obtenerHorariosEspecialista();
    
  }

  obtenerHorariosEspecialista(){
    let col = collection(this.firestore, 'horarios-especialistas');
    const observable = collectionData(col);
    observable.subscribe((respuesta:any) => {
      this.coleccionHorarios = respuesta;
    });

  }

  async crearRegistro(horarios: HorarioSemanal, mail: string): Promise<void> {
    let col = collection(this.firestore, 'horarios-especialistas');
    await this.deleteOne(mail);
    addDoc(col, horarios);
  }

  async deleteOne(mail: string){
    let col = collection(this.firestore, 'horarios-especialistas');
    const fetchQuery = query(
      col, 
      where("mail", "==", mail),
      limit(1),
    );
    const querySnapshot = await getDocs(fetchQuery);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }


}
