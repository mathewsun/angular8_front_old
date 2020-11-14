export interface LandingPage {
  id: number;
  creationDate: Date;
  name: string;
  linkTemplate: string;
  observeLink: string;
  image: string;
  userId: number;
  imageLink: string;
  type: LandingPageType;
  ar: number;
  cr: number;
  epc: number;
}

export enum LandingPageType {
  Mobile,
  Desktop,
  Adaptive
}
