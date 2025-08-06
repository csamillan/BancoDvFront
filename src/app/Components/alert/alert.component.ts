import { Component } from '@angular/core';
import { AlertService } from '../../Services/Alerts/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  constructor(
        public alertService: AlertService
    ) { }
}
