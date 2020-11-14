import {TransportService} from './transport.service';
import {HttpClient} from '@angular/common/http';
import {HttpTransportService} from './http-transport.service';

let heroServiceFactory = (httpClient: HttpClient) => {
  return new HttpTransportService(httpClient);
};

export let transportServiceProvider =
  {
    provide: TransportService,
    useFactory: heroServiceFactory,
    deps: [HttpClient]
  };
