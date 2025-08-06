import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AlertComponent } from "../../Components/alert/alert.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AlertComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
