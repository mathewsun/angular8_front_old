import { Action } from './action';
import { LandingPage } from './landingPage';
import { Subject } from './subject';
import { User } from './user';
import { OfferVisibilityEnum } from './enums/offerVisibility.enum';
import { Country } from './country';
import { OfferCategory } from './offerCategory';
import { OfferSubcategory } from './offerSubcategory';

export interface Offer {
  id: number;
  displayId: string;
  name: string;
  image: string;
  description: number;
  shortDescription: number;

  countries: Array<Country>;

  category: OfferCategory;
  categoryID: number;
  subcategory: OfferSubcategory;
  subcategoryId: OfferSubcategory;
  visibility: OfferVisibilityEnum;
  enabled: boolean;
  allowed: boolean;
  trafficSources: string;

  landingPages: Array<LandingPage>;
  actions: Array<Action>;

  userId: number;
  user: User;

  fallbackOfferId: number;
  fallbackOffer: Offer;

  subjectId: number;
  subject: Subject;

  currencyId: number;

  ar: number;
  epc: number;
}
