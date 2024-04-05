import { formatNumber } from 'common/functions';
import { Growth } from 'common/functions/calculate';

import Loading from 'components/fragments/Loading';
import CardComponent from 'components/fragments/Card';

import { DashboardModel } from 'models/dashboard.model';
import { CardModel } from 'models/card.model';

import * as SC from './style';

type Props = {
  data: DashboardModel | null;
  loading: boolean;
};

const DashboardComponent = (props: Props) => {
  let convertDataToFormat: CardModel[] = [];
  if (props.data && Object.keys(props.data).length > 0) {
    for (let key in props.data) {
      const currentData: CardModel = {} as CardModel;

      const growthValueByWeek = Growth.value(props.data[key].last_week, props.data[key].this_week);
      const growthValueByMonth = Growth.value(
        props.data[key].last_month,
        props.data[key].this_month
      );
      const GrowthType = Growth.TYPE;

      currentData.value = formatNumber(props.data[key].total || 0);

      currentData.compare = [
        {
          title: 'Week',
          type:
            growthValueByWeek.growth === GrowthType.INCREASE
              ? 'increase'
              : growthValueByWeek.growth === GrowthType.DECREASES
              ? 'reduced'
              : '',
          value: Math.abs(growthValueByWeek.value) + '%',
        },
        {
          title: 'Month',
          type:
            growthValueByMonth.growth === GrowthType.INCREASE
              ? 'increase'
              : growthValueByMonth.growth === GrowthType.DECREASES
              ? 'reduced'
              : '',
          value: Math.abs(growthValueByMonth.value) + '%',
        },
      ];

      currentData.dailyStatistics = {
        title: '',
        value: formatNumber(Number(props.data[key].today || 0)),
      };

      if (key === 'earn') {
        currentData.title = 'Profit';
        currentData.info = 'Statistics of profits earned from orders of sellers and showrooms';
        currentData.value = formatNumber(props.data[key].total || 0, '$');
        currentData.dailyStatistics.title = 'Daily profit';
        currentData.dailyStatistics.value = formatNumber(
          props.data[key].daily !== 'Infinity' ? Number(props.data[key].daily) : 0 || 0,
          '$'
        );
        currentData.order = 1;
      } else if (key === 'order') {
        currentData.title = 'Order';
        currentData.info = 'Order statistics';
        currentData.dailyStatistics.title = 'Orders today';
        currentData.order = 2;
      } else if (key === 'user') {
        currentData.title = 'User';
        currentData.info = 'User statistics';
        currentData.dailyStatistics.title = 'Registrations today';
        currentData.order = 3;
      } else if (key === 'seller') {
        currentData.title = 'Seller';
        currentData.info = 'Seller statistics';
        currentData.dailyStatistics.title = 'Registrations today';
        currentData.order = 4;
      } else if (key === 'showroom') {
        currentData.title = 'Showroom';
        currentData.info = 'Showroom statistics';
        currentData.dailyStatistics.title = 'Registrations today';
        currentData.order = 5;
      }

      convertDataToFormat.push(currentData as CardModel);
    }
  }

  return (
    <SC.Wrapper>
      {props.loading && <Loading isOpacity />}
      <div className='list-card'>
        {convertDataToFormat
          .sort((a, b) => a.order - b.order)
          .map((data, index) => (
            <CardComponent key={index} {...data} />
          ))}
      </div>
    </SC.Wrapper>
  );
};

export default DashboardComponent;
