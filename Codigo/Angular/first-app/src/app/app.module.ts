import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ExampleService } from './services/example.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [ExampleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
