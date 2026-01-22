import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WristSurgeryPage } from "./wrist-surgery-page/wrist-surgery-page";

@Component({
  selector: 'app-root',
  imports: [WristSurgeryPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {



}
