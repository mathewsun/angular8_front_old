import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transportServiceProvider } from '../services/transport/transport.service.provider';
import { TransportService } from '../services/transport/transport.service';
import { ApiResult } from '../models/apiResponse';
import { Role, RolesCollection } from '../models/role';
import { BaseApiModule } from './baseApi.module';
import { TicketTypeEnum } from '../models/enums/ticketType.enum';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})
export class ApiModule extends BaseApiModule {

  public static Roles: RolesCollection;

  constructor(transport: TransportService) {
    super(transport);
  }

  /**
   *
   * @param username
   * @param password
   */
  public async register(username: string, password: string): Promise<ApiResult> {
    return await this.sendRequest('auth/register', {username, password});
  }

  /**
   *
   * @param model
   */
  public async signUp(model: { mail: string, password: string, telegram: string, skype: string}): Promise<ApiResult> {
    return await this.sendRequest('auth/register', {
      username: model.mail,
      password: model.password,
      telegram: model.telegram,
      skype: model.skype
    });
  }

  /**
   *
   * @param token
   */
  public async confirm(token: string): Promise<ApiResult> {
    let [result] = await Promise.all([this.sendRequest('auth/confirmRegistration', {token})]);
    return result;
  }

  /**
   *
   * @param model
   */
  public async signIn(model: { mail: string, password: string, persistent: boolean }): Promise<ApiResult> {
    return await this.sendRequest(
      'auth/login',
      {
        username: model.mail,
        password: model.password,
        persistent: model.persistent
      });
  }

  /**
   *
   */
  public async logout(): Promise<boolean> {
    let result = await this.sendRequest<boolean>('auth/logout');
    window.location.reload();
    return result.body;
  }

  /**
   *
   */
  public async getCurrentRoles(): Promise<Role[]> {
    try {
      let result = await this.sendRequest<Role[]>('auth/getRoles');

      ApiModule.Roles = new RolesCollection(result.body);

      return result.body;
    } catch (e) {
      return null;
    }
  }

  /**
   *
   */
  public async checkAuth(): Promise<boolean> {
    try {
      let result = await this.sendRequest('auth/');
      return result.success;
    } catch (e) {
      return false;
    }
  }

  public async sendTicket(
    ticketType: TicketTypeEnum = TicketTypeEnum.Other,
    subject: string = 'No subject',
    message: string = 'Empty message',
    auxData: {} = {}): Promise<any> {

    try {
      let result = await this.sendRequest<any>('ticket/create', {ticketType, subject, message, auxData});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  /*
    public async sendOfferAccessRequest(subject: string = 'No subject', message: string = 'Empty message', offerId: number, offerName: string): Promise<any> {
      try {
        let data = {
          type: TicketTypeEnum.Offers,
          subject,
          message,
          auxData: {
            offerId,
            offerName
          }
        };
        let result = await this.sendRequest<any>('ticket/RequestOfferAccess', data);
        return result.body;
      } catch (e) {
        return e;
      }
    }
    */

}
