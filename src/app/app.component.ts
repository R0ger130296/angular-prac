import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Marca este componente como autónomo
  imports: [RouterOutlet], // Especifica dependencias necesarias, como RouterOutlet para enrutamiento
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-prac';
}
