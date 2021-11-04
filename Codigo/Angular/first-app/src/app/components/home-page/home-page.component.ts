import { Component } from '@angular/core';
import { ExampleService } from 'src/app/services/example.service';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private service: ExampleService) { 
    this.helloWorld = "Hola mundo de nuevo"
    this.condition = true;
    this.value = 5;
    this.colors = this.service.getColors();
    this.filterValue = '';
  }

  helloWorld: string;
  condition: boolean;
  value: number;
  filterValue: string;

  colors: Array<string>;

  print(): void {
    alert(this.helloWorld);
    alert(this.service.getColors());
  }
}