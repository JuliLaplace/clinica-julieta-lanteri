import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoHora',
  standalone: true
})
export class FormatoHoraPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value){
      return value + (value>='12:00' ? ' pm' : ' am');
    }
    return value;
  }

}
