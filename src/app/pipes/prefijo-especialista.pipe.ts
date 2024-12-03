import { Pipe, PipeTransform } from '@angular/core';
import { TipoUsuario } from '../enumerables/tipo-usuario';

@Pipe({
  name: 'prefijoEspecialista',
  standalone: true
})
export class PrefijoEspecialistaPipe implements PipeTransform {

  transform(value: string, tipoUsuario: TipoUsuario): string {
    if (tipoUsuario == TipoUsuario.especialista) {
      return `Dr. ${value}`;  
    }
    return value;  
  }

}
