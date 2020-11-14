export interface AbstractStatistics {
  // Abstract interface
  // Traffic
  clicks: number,
  unique: number,
  trafficBack: string, // link, ex http://site.host
  // Coefficients
  cr: number,
  epc: number,
  ar: number,
  // Leads
  totalLeads: number,
  acceptedLeads: number,
  onHoldLeads: number,
  rejectedLeads: number,
  // Finances
  totalFinances: number,
  acceptedFinances: number,
  onHoldFinances: number,
  rejectedFinances: number
}

export interface StatisticsByDayCPA extends AbstractStatistics {
  day: string, // date, ex.:  '21.08.2019'
}

export interface StatisticsByHourCPA extends AbstractStatistics {
  hour: string, // time, ex.:  '10:00'
}

export interface StatisticsByWeekCPA extends AbstractStatistics {
  dayOfTheWeek: string, // day of the week, ex.:  'Monday'
}

export interface StatisticsByMonthCPA extends AbstractStatistics {
  month: string, // month, ex.:  'July 19'
}

// TODO: Add statistics by landing page, offer and by stream
