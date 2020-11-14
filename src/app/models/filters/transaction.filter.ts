import { PaymentStatusEnum, PaymentType } from '../enums/paymentStatus.enum';

export interface TransactionFilter {
  status?: PaymentStatusEnum,
  type?: PaymentType,
  dateFrom?: Date,
  dateTo?: Date,
  users?: number[],
  pageNumber?: number,
  itemsPerPage?: number
}
