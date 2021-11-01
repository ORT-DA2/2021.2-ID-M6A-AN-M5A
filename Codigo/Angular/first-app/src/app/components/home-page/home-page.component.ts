import { Component } from '@angular/core';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor() { 
    this.helloWorld = "Hola mundo de nuevo"
  }

  helloWorld: string

  print(): void {
    alert(this.helloWorld);
  }

}
