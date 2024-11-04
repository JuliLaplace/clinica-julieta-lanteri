import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/login.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

   email: string ="";
   password: string="";
   errorMsj: string = "";
  flagError: boolean = false;

  constructor( private servicioLogin: LoginService){

  }


  login(){
    this.servicioLogin.login(this.email, this.password)
    .then((respuesta)=>{
      this.errorMsj = respuesta.errorMsj;
      this.flagError = respuesta.errorFlag;
      this.limpiarCampos();
    })
  }

   registroAutomatico(param: string) {
    if (param == "paciente") {
      this.email = "paciente@mail.com";
      this.password = "paciente1";
    } else if (param == "especialista") {
      this.email = "especialista@mail.com";
      this.password = "especialista1";
    }
    else {
      this.email = "admin@mail.com";
      this.password = "admin1";
    }
    
  }

  limpiarCampos() {  
    this.email = "";
    this.password = "";
  }
}
