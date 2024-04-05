export type DashboardType = {
  last_month: number;
  last_week: number;
  this_month: number;
  this_week: number;
  daily: number | string | 'Infinity';
  total: number;
  today: number;
};

export type DashboardModel = {
  [key: string]: DashboardType;
};

export const enum NotifyStatusType {
  NEW_ORDER = 1,
  NEW_QUOTE = 2,
  NEW_PAYMENT = 3,
  NEW_FEEDBACK = 4,
  NEW_FULFILLED = 5,
}

export type NotificationType = {
  account_id: string;
  count: number;
  id: string;
  type: NotifyStatusType;
}[];
