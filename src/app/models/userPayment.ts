import { PaymentStatusEnum, PaymentType } from './enums/paymentStatus.enum';
import { User } from './user';

export interface UserPayment {
  id: number;
  created: Date,
  confirmed: Date,
  rejected: Date,
  executed: Date,
  status: PaymentStatusEnum,
  type: PaymentType

  operations: UserPaymentOperation[],
  extraData?: {
    payment_name: string,
    payment_account: string
  }
}

export interface UserPaymentOperation {
  user: User,
  amount: number,
  currencyId: number
}
