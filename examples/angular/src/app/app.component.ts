import { Component } from '@angular/core';
import { TyformExampleComponent } from './tyform-example';

@Component({
  standalone: true,
  imports: [TyformExampleComponent],
  selector: 'tyform-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular';
}
