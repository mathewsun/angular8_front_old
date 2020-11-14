import { EventEmitter, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseApiModule } from './baseApi.module';
import { User, UserProfile } from '../models/user';
import { UserPaymentInfo } from '../models/userPaymentInfo';
import { TransportService } from '../services/transport/transport.service';
import { Balance } from '../models/balance';
import { UserFilter } from '../models/filters/user.filter';
import { Page } from '../models/page';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserModule extends BaseApiModule {

  private static _userChanged: EventEmitter<User> = new EventEmitter<User>();
  private static _currentUser: User;
  private static _userUpdating: boolean = false;

  public userChanged: EventEmitter<User> = new EventEmitter<User>();

  constructor(transport: TransportService) {
    super(transport);

    UserModule._userChanged.subscribe(user => {
      this.userChanged.emit(user);
    });
  }

  public get currentUser(): User {
    if (!UserModule._currentUser) {
      this.updateUser();
    }
    return UserModule._currentUser;
  }

  public async updateUser(): Promise<void> {
    if (UserModule._userUpdating) {
      return;
    }

    UserModule._userUpdating = true;
    let user = await this.getFullUser();
    if (!user) {
      UserModule._userUpdating = false;
      return;
    }

    UserModule._currentUser = user;
    UserModule._userChanged.emit(user);
    UserModule._userUpdating = false;
    return;
  }

  /**
   *
   * @param userMail
   */
  public async getFullUser(userMail: string = null): Promise<User> {
    let response = await this.sendRequest<User>('user/getFullUser', {userMail});
    return response.body;
  }

  /**
   *
   * @param userId
   */
  public async getProfile(userId: number): Promise<User> {
    let response = await this.sendRequest<User>('user/getProfile', {userId});
    return response.body;
  }

  /**
   *
   * @param userId
   */
  public async getPaymentInfo(userId: number): Promise<User> {
    let response = await this.sendRequest<User>('user/getPaymentInfo', {userId});
    return response.body;
  }

  /**
   *
   * @param userProfile
   * @param imageFile
   */
  public async updateProfile(userProfile: UserProfile, imageFile: string = null): Promise<void> {
    await this.sendRequest('user/updateProfile', {model: userProfile, imageFile});
  }

  /**
   *
   * @param paymentInfo
   */
  public async updatePaymentInfo(paymentInfo: UserPaymentInfo): Promise<void> {
    await this.sendRequest('user/updatePaymentInfo', paymentInfo);
    this.updateUser();
  }

  /**
   *
   * @param filter
   */
  public async getUserList(filter: UserFilter): Promise<Page> {
    let response = await this.sendRequest<Page>('user/list', {filter});
    return response.body;
  }

  /**
   *
   * @param id
   */
  public async activate(id: number): Promise<void> {
    await this.sendRequest<void>('user/activate', {userId: id});
  }

  /**
   *
   * @param id
   */
  public async deactivate(id: number): Promise<void> {
    await this.sendRequest<void>('user/deactivate', {userId: id});
  }

  /**
   *
   * @param id
   */
  public async confirm(id: number): Promise<void> {
    await this.sendRequest<void>('user/confirm', {userId: id});
  }

  /**
   *
   * @param user
   */
  public async updateRoles(user: User): Promise<void> {
    await this.sendRequest<void>('user/updateRoles', user);
  }

  public async getHoldBalances(userId: number = null): Promise<Balance[]> {
    let balances = await this.sendRequest<Balance[]>('wallet/GetUnconfirmedBalances', userId);

    return balances.body;
  }

  public async getApprovedBalances(userId: number = null): Promise<Balance[]> {
    let balances = await this.sendRequest<Balance[]>('wallet/getBalances', userId);

    return balances.body;
  }

  /**
   *
   */
  public async getBalances(userId: number = null): Promise<Balance[]> {
    let balances = await this.sendRequest<Balance[]>('wallet/getBalances', userId);
    let unconfirmedBalances = await this.sendRequest<Balance[]>('wallet/GetUnconfirmedBalances', userId);

    let result = {};

    if (balances.body.length > 0) {
      balances.body.forEach(balance => {
        if (!result[balance.currency.id]) {
          result[balance.currency.id] = balance;
        } else {
          result[balance.currency.id].amount = result[balance.currency.id].amount + balance.amount;
        }
      });
    }

    if (unconfirmedBalances.body.length > 0) {
      unconfirmedBalances.body.forEach(balance => {
        if (!result[balance.currency.id]) {
          result[balance.currency.id] = balance;
        } else {
          result[balance.currency.id].amount = result[balance.currency.id].amount + balance.amount;
        }
      });
    }

    let answer = [];

    for (let balance in result) {
      answer.push(result[balance]);
    }

    return answer;
  }

  /**
   *
   * @param mail
   * @param currentPassword
   * @param password
   */
  public async changePassword(mail: string, currentPassword: string, password: string): Promise<void> {
    await this.sendRequest<void>('user/setPassword', {userMail: mail, currentPassword, password});
  }

  /**
   *
   * @param userId
   * @param percent
   */
  public async updatePercent(userId: number, percent: number): Promise<void> {
    await this.sendRequest<void>('user/updatePercent', {userId, percent});
  }
}

