import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoVacio',
  standalone: true
})
export class FormatoVacioPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value == null ){
      return '--';
    }
    return value;
  }


}
