import { Component, Input } from '@angular/core';
import { QuestionType } from '../question.type';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-faq-question',
  templateUrl: './faq-question.component.html',
  styleUrls: ['./faq-question.component.css'],
  animations: [
    trigger('expandHide', [
      state('hide',  style({height: 0, padding: '0 10px'})),
      state('expand', style({height: '*', padding: '0 10px'})),
      transition('hide <=> expand', animate('300ms'))
    ])
  ]
})
export class FaqQuestionComponent {
  @Input() public question: QuestionType;
  public isExpanded = false;

  constructor() { }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

}
