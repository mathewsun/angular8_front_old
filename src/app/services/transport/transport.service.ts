import {ApiResult} from "../../models/apiResponse";

export class TransportService {
  protected apiHost: string;

  constructor() {
    this.apiHost = ENVIRONMENT.API_HOST;
  }

  public async sendRequest<T>(method: string, body: any, headers: { [p: string]: string | string[] } = {}): Promise<ApiResult<T>> {
    return;
  }
}
