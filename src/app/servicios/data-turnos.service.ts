import { Injectable } from '@angular/core';
import { Especialidad } from './data-especialidades.service';
import { addDoc, collection, collectionData, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { EstadoTurno } from '../enumerables/estado-turno';
import { SesionService } from './sesion.service';
import { Usuario } from './data-usuarios.service';
import { TipoUsuario } from '../enumerables/tipo-usuario';

export interface Turno {
  id: string;
  usuario: string,
  usuarioNombre: string
  fechaTurno: string;
  horaTurno: string;
  especialista: string,
  especialistaNombre: string,
  especialidad: string,
  estado : EstadoTurno,
  comentario: Comentario | null,
  resena : Comentario | null,
  diagnostico: string | null,
  historialClinico : HistorialClinico | null
}

export interface Comentario{
  comentario: string,
  usuario: string,
  tipoUsuario: TipoUsuario,
  accion: EstadoTurno
}
export interface HistorialClinico{
  altura: number,
  peso: number,
  temperatura: number,
  presion: number,
  datoDinamico1 : Dato | null,
  datoDinamico2 : Dato | null,
  datoDinamico3 : Dato | null
}

export interface Dato{
  clave: string,
  valor: string
}

@Injectable({
  providedIn: 'root'
})
export class DataTurnosService {

  public coleccionTurnos: Turno[] = [];
  public coleccionTurnosPaciente : Turno[] = [];
  public coleccionTurnosEspecialista : Turno[] = [];

  public turno: Turno | null = null;

  constructor(private firestore: Firestore, private sesion : SesionService) { 
    this.obtenerDatos();
  }

  async crearRegistro(turno : Turno): Promise<string> {
    let col = collection(this.firestore, 'turnos');
    return await addDoc(col, turno)
    .then((ref)=>{
      return ref.id;
    });
  }


  obtenerDatos(){
    let col = collection(this.firestore, 'turnos');
    const observable = collectionData(col, {idField: 'id'});
    observable.subscribe((respuesta:any) => {
      this.coleccionTurnos = respuesta;
      
      this.coleccionTurnosPaciente = this.coleccionTurnos.filter(
        (turno) => turno.usuario === this.sesion.getUsuario()
      );
      this.coleccionTurnosEspecialista = this.coleccionTurnos.filter(
        (turno) => turno.especialista === this.sesion.getUsuario()
        
      );
      
    })
  }

  private modificarRegistro(turno: Turno, data: any) {
    let col = collection(this.firestore, 'turnos');
    const docRef = doc(col, turno.id);

    updateDoc(docRef, data)
      .then(() => {
        console.log(`cambie estado de turno`);
      })
      .catch((error) => {
        console.error('Error al actualizar el turno: ', error);
      });
  }

  private cambiarEstadoTurno(turno: Turno, data: any) {
    this.modificarRegistro(turno, data);
  }

  public cambiarEstadoCancelado(turno: Turno, comentario: Comentario) {
    this.cambiarEstadoTurno(turno, {
      estado: EstadoTurno.cancelado,
      comentario: comentario,
    });
  }

  public cambiarEstadoRechazado(turno: Turno, comentario: Comentario) {
    this.cambiarEstadoTurno(turno, {
      estado: EstadoTurno.rechazado,
      comentario: comentario,
    });
  }
  public cambiarEstadoFinalizado(turno: Turno, comentario: Comentario, diagnostico:string, historial : HistorialClinico) {
    this.cambiarEstadoTurno(turno, {
      estado: EstadoTurno.finalizado,
      comentario: comentario,
      diagnostico:  diagnostico,
      historial: historial,
    });
  }

  public cambiarEstadoAceptado(turno: Turno) {
    this.cambiarEstadoTurno(turno, {
      estado: EstadoTurno.aceptado,
    });
  }

  obtenerUsuariosAtendidos(): string[] {
    const especialista = this.sesion.getUsuario(); 
    const turnosAtendidos = this.coleccionTurnos.filter(turno => turno.especialista == especialista && (turno.estado == EstadoTurno.aceptado || turno.estado == EstadoTurno.finalizado));
    const usuariosAtendidos = turnosAtendidos
      .map(turno => turno.usuario) 
      .filter((usuario, index, self) => self.indexOf(usuario) === index); 
  
    return usuariosAtendidos;
  }



}
