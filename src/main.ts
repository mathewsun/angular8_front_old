import {enableProdMode, MissingTranslationStrategy} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule,{
  missingTranslation: MissingTranslationStrategy.Ignore
})
  .catch(err => console.error(err));
