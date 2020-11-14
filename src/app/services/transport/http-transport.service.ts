import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TransportService} from './transport.service';
import {ApiResult} from "../../models/apiResponse";

@Injectable({
  providedIn: 'root',
})
export class HttpTransportService extends TransportService {

  private readonly schema: string = 'https';

  constructor(private httpClient: HttpClient) {
    super();

    if (ENVIRONMENT.API_HOST.indexOf('api2.click2.money') === -1) {
      this.schema = 'http';
    }
  }

  /**
   *
   * @param method
   */
  private buildUrl(method: string): string {
    return `${this.schema}://${this.apiHost}/api/v2/${method}`;
  }

  /**
   *
   * @param method
   * @param body
   * @param headers
   */
  public async sendRequest<T = any>(method: string, body: any, headers: { [p: string]: string | string[] } = {}): Promise<ApiResult<T>> {
    let url = this.buildUrl(method);
    return new Promise<ApiResult<T>>((resolve, reject) => {
      this.httpClient.post<ApiResult<T>>(url, body, {
        withCredentials: true,
        observe: 'response',
        headers: headers
      }).subscribe(
        response => {
          resolve(response.body);
        },
        error => {
          reject(error);
        });
    });
  }
}
