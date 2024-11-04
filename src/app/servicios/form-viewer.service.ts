import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormViewerService {
  nombresRegex: string = "[a-zA-ZáéíóúÁÉÍÓÚöÖüÜ ']*";
  numeroRegex: string = "[0-9-]*";
  emailRegex: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

  constructor() { }

  controlConError(form: FormGroup, control: string): boolean {
    if (form != undefined && control != undefined) {
      return this.controlInvalido(form, control) && this.controlUsado(form, control);
    } else {
      return false;
    }
  }

  controlInvalido(form: FormGroup, control: string): boolean {
    return form.controls[control].invalid;
  }

  controlUsado(form: FormGroup, control: string): boolean {
    return form.controls[control].dirty || form.controls[control].touched;
  }

  errorEnControl(form: FormGroup, control: string): ValidationErrors | null {
    return form.controls[control].errors;  //7me devuelve los errores de validacion de un control, si no null
  }

  mensajeError(form: FormGroup, control: string): string {

    let errors = this.errorEnControl(form, control);
    let errorMessage = ""; //mensaje que voy a mostrar

    if (errors?.['required']) {
      errorMessage = "Campo obligatorio.";

    } else if (errors?.['pattern']) {

      if (errors?.['pattern'].requiredPattern == '^' + this.nombresRegex + '$') {
        errorMessage = "Sólo se aceptan letras.";
      } else if (errors?.['pattern'].requiredPattern == '^[0-9-]*$') {
        errorMessage = "Sólo se aceptan números.";
      } else if (errors?.['pattern'].requiredPattern == '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') {
        errorMessage = "Email inválido.";
      } else {
        errorMessage = "Caracteres inválidos.";
      }
    } else if (errors?.['minlength']) {
      errorMessage = "Mínimo " + errors?.['minlength'].requiredLength + " caracteres.";
    } else if (errors?.['maxlength']) {
      errorMessage = "Máximo " + errors?.['maxlength'].requiredLength + " caracteres.";
    } else if (errors?.['email']) {
      errorMessage = "Formato de email inválido.";
    } else if (errors?.['min']) {
      errorMessage = "El valor mínimo es " + errors?.['min'].min + ".";
    } else if (errors?.['max']) {
      errorMessage = "El valor máximo es " + errors?.['max'].max + ".";
    }

    return errorMessage;
  }
}
