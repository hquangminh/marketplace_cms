type CompareModel = {
  title: string;
  type: 'increase' | 'reduced' | '';
  value: string;
};

type DailyStatisticsModel = {
  title: string;
  value: string;
};

export interface CardModel {
  title: string;
  info?: string;
  value: string;
  compare?: CompareModel[];
  dailyStatistics?: DailyStatisticsModel;
  order: number;
}
