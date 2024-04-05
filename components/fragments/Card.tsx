import { Tooltip } from 'antd';
import { CaretUpOutlined, CaretDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { CardModel } from 'models/card.model';

import styled from 'styled-components';

const CardComponent = (props: CardModel) => {
  return (
    <Card_Wrapper>
      <div className='card__header'>
        <h4 className='card__header__title'>{props.title}</h4>
        {props.info && (
          <Tooltip className='card__header__info_icon' title={props.info}>
            <InfoCircleOutlined />
          </Tooltip>
        )}
      </div>

      <div className='card__value'>{props.value}</div>

      {props.compare && props.compare?.length > 0 && (
        <Card_Compare>
          {props.compare.map((item, index) => {
            return (
              <div key={index} className='compare_item'>
                <p className='compare_item__title'>{item.title}</p>
                <p className='compare_item__value'>{item.value}</p>
                {item.type === 'increase' ? (
                  <CaretUpOutlined className={'compare_item__icon_' + item.type} />
                ) : item.type === 'reduced' ? (
                  <CaretDownOutlined className={'compare_item__icon_' + item.type} />
                ) : (
                  ''
                )}
              </div>
            );
          })}
        </Card_Compare>
      )}

      {props.dailyStatistics && (
        <div className='card__footer'>
          <Card_DailyStatistics>
            <span className='title'>{props.dailyStatistics.title}</span>
            <span className='value'>{props.dailyStatistics.value}</span>
          </Card_DailyStatistics>
        </div>
      )}
    </Card_Wrapper>
  );
};

export default CardComponent;

const Card_Wrapper = styled.div`
  padding: 20px 24px 8px;

  color: rgba(0, 0, 0, 0.85);
  border-radius: 4px;
  background-color: #ffffff;

  .card {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 22px;
      color: #00000072;

      &__title {
        margin-bottom: 0;

        color: #00000072;
        font-size: 14px;
        line-height: 22px;
      }
      &__info_icon {
        cursor: pointer;
      }
    }
    &__value {
      margin-top: 4px;
      margin-bottom: 0;
      height: 38px;

      color: rgba(0, 0, 0, 0.85);
      font-size: 30px;
      line-height: 38px;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
    &__footer {
      margin-top: 8px;
      padding-top: 9px;

      border-top: 1px solid #f0f0f0;
    }
  }
`;
const Card_Compare = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0 20px;

  margin-top: 25px;

  .compare_item {
    display: flex;
    align-items: center;
    gap: 5px;

    &__title,
    &__value {
      margin-bottom: 0;

      font-size: 14px;
      line-height: 22px;
    }
    &__icon_increase,
    &__icon_reduced {
      font-size: 12px;
    }
    &__icon_increase {
      color: #52c41a;
    }
    &__icon_reduced {
      color: #f5222d;
    }
  }
`;
const Card_DailyStatistics = styled.p`
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 0;

  font-size: 14px;
  line-height: 22px;

  .title,
  .value {
    margin-bottom: 0;
  }
`;
