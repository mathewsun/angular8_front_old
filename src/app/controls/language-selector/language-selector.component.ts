import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from "../../services/language.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {

  @Input('arrow') arrow: boolean = false;

  public selectedLanguage: {
    code: string,
    name: string
  };

  public languages;

  constructor(private languageService: LanguageService) {
    this.selectedLanguage = languageService.currentLanguage;
  }

  ngOnInit() {
    this.languages = this.languageService.languages;
  }

  /**
   *
   * @param lang
   */
  public langSelect(lang: string) {
    if (lang != this.selectedLanguage.code)
      this.languageService.switch(lang);
  }

}
