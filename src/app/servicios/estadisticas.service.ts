import { Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { DataTurnosService, Turno } from './data-turnos.service';
import { EstadoTurno } from '../enumerables/estado-turno';

export interface DataSetPie {
  name: string,
  y: number,
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(private firestore: Firestore) {}



  crearDataSetTurnosPorDia(turnos: Turno[]) {
    let dataSet: DataSetPie[] = [];

    for (let i = 0; i < turnos.length; i++) {

      const turno = turnos[i];

      let dataExistente = dataSet.find(data => data.name == turno.fechaTurno);

      if (dataExistente) {
        dataExistente.y += 1;
      } else {
        dataSet.push({
          name: turno.fechaTurno,
          y: 1,
        });
      }
    }
    return dataSet;
  }

  crearDataSetTurnosPorEspecialidad(turnos: Turno[]) {
    let dataSet: DataSetPie[] = [];

    for (let i = 0; i < turnos.length; i++) {

      const turno = turnos[i];

      let dataExistente = dataSet.find(data => data.name == turno.especialidad);

      if (dataExistente) {
        dataExistente.y += 1;
      } else {
        dataSet.push({
          name: turno.especialidad,
          y: 1,
        });
      }
    }
    return dataSet;
  }

  crearDataSetTurnosSolicitadosMedico(turnos: Turno[]) {
    let dataSet: DataSetPie[] = [];
    turnos = turnos.filter((t) => { return t.estado != EstadoTurno.finalizado });

    for (let i = 0; i < turnos.length; i++) {

      const turno = turnos[i];

      let dataExistente = dataSet.find(data => data.name == turno.especialistaNombre);

      if (dataExistente) {
        dataExistente.y += 1;
      } else {
        dataSet.push({
          name: turno.especialistaNombre,
          y: 1,
        });
      }
    }
    return dataSet;
  }

  crearDataSetTurnosFinalizadosMedico(turnos: Turno[]) {
    let dataSet: DataSetPie[] = [];
    turnos = turnos.filter((t) => { return t.estado == EstadoTurno.finalizado });

    for (let i = 0; i < turnos.length; i++) {

      const turno = turnos[i];

      let dataExistente = dataSet.find(data => data.name == turno.especialistaNombre);

      if (dataExistente) {
        dataExistente.y += 1;
      } else {
        dataSet.push({
          name: turno.especialistaNombre,
          y: 1,
        });
      }
    }
    return dataSet;
  }

}
