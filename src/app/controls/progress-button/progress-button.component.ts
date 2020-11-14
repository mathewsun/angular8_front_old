import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-progress-button',
  templateUrl: './progress-button.component.html',
  styleUrls: ['./progress-button.component.css']
})
export class ProgressButtonComponent {

  @Input() processing: boolean = false;
  @Input() disabled: boolean = false;

  constructor() {
  }

}
