import {Injectable} from '@angular/core';
import {browser} from "protractor";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public static Languages = {
    'en': {
      code: 'en',
      name: 'English'
    },
    'ru': {
      code: 'ru',
      name: 'Русский'
    }
  };

  public languages = LanguageService.Languages;

  public currentLanguage: {
    name: string,
    code: string
  };

  constructor(private router: Router) {
    /*
    let langCode = document.cookie.replace(/(?:(?:^|.*;\s*)lang\s*=\s*([^;]*).*$)|^.*$/, "$1");
    */
    let langCode = document.location.pathname.split('/')[1];

    if (!langCode)
      langCode = "en";
    this.currentLanguage = LanguageService.Languages[langCode];
  }

  public switch(lang: string): void {
    document.cookie = `lang=${lang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    window.location.assign(`/${lang}/`);
    //this.router.navigate(["/" + lang],{ relativeTo:'' });
  }
}
