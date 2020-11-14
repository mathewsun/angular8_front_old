import { PaymentStatusEnum } from './enums/paymentStatus.enum';
import { PaymentAccountTypeEnum } from './enums/paymentAccountType.enum';

export interface PaymentListRequest {
  users?: number[],
  dateFrom: Date,
  dateTo: Date;
  paymentStatus: PaymentStatusEnum,
  paymentAccountType: PaymentAccountTypeEnum
}
