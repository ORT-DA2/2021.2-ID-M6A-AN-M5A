import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  constructor() { }

  getColors(): string[]{
    return ["Rojo", "Verde", "Azul", "Amarillo"]
  }
}
