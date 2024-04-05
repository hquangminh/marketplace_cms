import { useRouter } from 'next/router';
import { Button, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { formatNumber, handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import modelingPriceServices from 'services/modeling-service/landing-page/pricing-services';

import TableCustom from 'components/fragments/TableCustom';
import MenuAction from 'components/fragments/MenuAction';

import { PriceProps, PriceType } from 'models/modeling-landing-page-pricing';

import { Container } from 'styles/__styles';
import * as L from './style';

const PricingComponent = (props: PriceProps) => {
  const router = useRouter();

  const onFetchDeletePricing = async (id: string) => {
    try {
      const resp = await modelingPriceServices.deletePricing(id);

      if (!resp.error) {
        props.setPrice((prevState: PriceType[] | any) =>
          prevState?.filter((item: PriceType) => item.id !== id)
        );
        handlerMessage('Delete success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<PriceType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '80px',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: 'Order Id ',
      dataIndex: 'orderid',
      className: 'orderid_price',
      key: 'orderid',
      width: '200px',
    },
    {
      title: 'Title ',
      dataIndex: 'title',
      className: 'title_price',
      key: 'title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      className: 'price',
      key: 'price',
      align: 'center',
      render: (value) =>
        value === 0 ? <Tag color='#6db2c5'>Contact</Tag> : formatNumber(value, '$'),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      className: 'status_price',
      render: (value: boolean) => (
        <>
          {value === true && (
            <Tag
              className='status status-1'
              color='success'
              style={{ minWidth: 80, marginRight: 0 }}>
              Active
            </Tag>
          )}
          {value === false && (
            <Tag className='status status-2' color='error' style={{ minWidth: 80, marginRight: 0 }}>
              Inactive
            </Tag>
          )}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (record: any) => (
        <MenuAction
          data={record}
          handleEdit={() => router.push(`/modeling-service/landing-page/pricing/edit/${record.id}`)}
          handleDelete={() => onFetchDeletePricing(record.id)}
        />
      ),
    },
  ];

  return (
    <L.Price_wrapper>
      <Container>
        <Button
          className='btn-add'
          type='primary'
          onClick={() => router.push('/modeling-service/landing-page/pricing/create')}>
          Create
        </Button>
        <TableCustom data={props.prices || undefined} columns={columns} rowKey='id' width={800} />
      </Container>
    </L.Price_wrapper>
  );
};

export default PricingComponent;
