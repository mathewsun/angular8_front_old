import { HttpMethodEnum } from './enums/httpMethod.enum';
import { User } from './user';

export interface Postback {
  id: number;
  date: Date;
  userId: number;
  user: User;
  name: string;
  link: string;
  method: HttpMethodEnum;
}
