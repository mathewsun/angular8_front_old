import { AlertTypeEnum } from './enums/alertType.enum';

export interface Alert {
  id: number;
  message: string;
  type: AlertTypeEnum;
  badge?: string;
  icon?: string;
  timer?: number;
}
