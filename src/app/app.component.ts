import {Component, ViewContainerRef} from '@angular/core';
import {PopupInjectorService} from "./services/gui/popup-injector.service";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'c2m-frontend';
  public apiHost: string;
  public loading: boolean = false;

  constructor(
    private popupInjectorService: PopupInjectorService,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private _activatedRoute: ActivatedRoute,

  ) {
    popupInjectorService.setViewVontainer(viewContainerRef);

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  public static UseLang(lang: string) {
  }
}
