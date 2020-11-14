import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { QUESTIONS } from './questions.const';
import { QuestionType } from './question.type';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  public questions: Array<QuestionType> = QUESTIONS;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {
    titleService.setTitle(activatedRoute.snapshot.data.title);
  }

  ngOnInit() {
  }

}
