import {Offer} from './offer';
import { User } from './user';
import { Traffback } from './traffback';
import { Postback } from './postback';

export interface Stream {
  id: number;
  displayId: string;
  name: string;
  tags: string[];
  traffback: Traffback;
  postback: Postback[];
  offers: Array<Offer>;
  date: Date;
  description: string;
  user: User;
}
