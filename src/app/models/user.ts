import {Contact} from './contact';
import {UserPaymentInfo} from "./userPaymentInfo";
import {Role} from "./role";

export interface User {
  id: number;
  name: string;
  avatarLink: string;
  mail: string;
  mobile: string;
  registerDate: Date;
  confirmationDate: Date;
  activationDate: Date;

  confirmed: boolean;
  active: boolean;

  percent: number;
  profile: UserProfile;
  paymentInfo: UserPaymentInfo;
  balance: number;

  roles: Role[];
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  picture: string;
  postbackLinkId: number;
  contacts: Contact[];
  percent: number;
}

