export interface CustomPayout {
  id: number,

  offerName: string,
  offerId: number,

  userId: number,
  userMail: string,

  actionKey: string,
  payout: number,
  percent: number,
  allowed: boolean,
  currentPayout: number,
  currentPercent: number
}
