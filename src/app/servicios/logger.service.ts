import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { SesionService } from './sesion.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  public loginsCollection: any[] = [];
  
  constructor(private firestore: Firestore, private auth: Auth, public sesion: SesionService) { 
    this.obtenerDatos();
  }

  crearLog() {
    let col = collection(this.firestore, 'logins');
    addDoc(col, { fecha: new Date(), "user": this.sesion.getUsuario() });
  }

  
  obtenerDatos() {
    let col = collection(this.firestore, 'logins');
    const obtenerQuery = query(col, orderBy('fecha', 'desc')); //ordeno los registros por fecha reciente
    const observable = collectionData(obtenerQuery);
    observable.subscribe((respuesta: any) => {
      this.loginsCollection = respuesta;
    })
  }
  //obtener datos en oninit? y desuscribirme con ondestry?
  
}
