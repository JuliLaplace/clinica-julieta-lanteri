import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean = false;

  constructor() { }
  
  getLoading() : boolean{
    return this.loading;
  }

  setLoading(loading:boolean){
    this.loading = loading;
  }
}
