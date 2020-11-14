import { User } from './user';

export interface Traffback {
  id: number;
  date: Date;
  userId: number;
  user: User;
  name: string;
  link: string;
}
