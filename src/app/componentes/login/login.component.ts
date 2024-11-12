import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/login.service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../servicios/loader.service';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

   email: string ="";
   password: string="";
   errorMsj: string = "";
  flagError: boolean = false;
  loading: boolean = false;
  abrirMenu:boolean = false;

  constructor( private servicioLogin: LoginService, private servicioLoader : LoaderService){

  }

  seleccionMenu() {
    this.abrirMenu = !this.abrirMenu;
  }


  login(){
    this.servicioLoader.setLoading(true); 
    this.loading = this.servicioLoader.getLoading();
    this.servicioLogin.login(this.email, this.password)
    .then((respuesta)=>{
      this.errorMsj = respuesta.errorMsj;
      this.flagError = respuesta.errorFlag;
      this.servicioLoader.setLoading(false);
      this.loading = this.servicioLoader.getLoading();
      this.limpiarCampos();
    })
  }

   registroAutomatico(param: string) {
   if(param =="juli"){
      this.email = "juli.laplace@gmail.com";
      this.password = "hola123";
    }else if( param == "rick"){
      this.email = "rick@yopmail.com";
      this.password = "rickandmorty";
    } else if(param=="strange"){
      this.email = "drstrange@yopmail.com";
      this.password = "marvel";
    } else if(param=="morty"){
      this.email = "morty@yopmail.com";
      this.password = "mortyman";
    }
    else if(param=="bojack"){
      this.email = "bojack@yopmail.com";
      this.password = "dianetodd";
    }
    else if(param=="chandler"){
      this.email = "chandler@yopmail.com";
      this.password = "friends";
    }
    
  }

  limpiarCampos() {  
    this.email = "";
    this.password = "";
  }
}
