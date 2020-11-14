import {ActionPayoutTypeEnum} from "./enums/actionPayoutType.enum";

export interface Action {
  id: number;
  offerId: number;
  name: string;
  payout: number;
  key: string;
  type: ActionPayoutTypeEnum;
  relatedActionKey: string;
  allowPayoutOverride: boolean;
}
