import { TicketTypeEnum } from './enums/ticketType.enum';
import { User } from './user';

export interface Ticket {
  id: number;

  type: TicketTypeEnum;
  subject: string;
  message: string;
  sender: User;
}
