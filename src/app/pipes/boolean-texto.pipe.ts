import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanTexto',
  standalone: true
})
export class BooleanTextoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if(value){
      return 'Sí';
    }else{
      return 'No';
    }
  }

}
