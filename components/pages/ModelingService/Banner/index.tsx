import { useState } from 'react';
import { useRouter } from 'next/router';

import { ColumnsType } from 'antd/lib/table';

import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import modelingBannerServices from 'services/modeling-banner';

import MenuAction from 'components/fragments/MenuAction';
import StatusCheck from 'components/fragments/StatusCheck';
import TableCustom from 'components/fragments/TableCustom';

import { BannerDetailType } from 'models/modeling-landing-page-banner';

const pageSize = 10;

type Props = {
  data: BannerDetailType[] | [];
  setData: React.Dispatch<React.SetStateAction<BannerDetailType[] | null>>;
  loading: boolean;
  page: 'banner' | 'banner-product';
};

const BannerComponent = (props: Props) => {
  const router = useRouter();

  const [page, setPage] = useState(1);

  const onFetchDeleteBanner = async (id: string) => {
    try {
      const resp = await modelingBannerServices.deleteModelingBanner(id);

      if (!resp.error) {
        props.setData((prevState: BannerDetailType[] | any) =>
          prevState?.filter((item: BannerDetailType) => item.id !== id)
        );
        handlerMessage('Delete success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchToggleStatus = async (id: string, status: boolean) => {
    try {
      const resp = await modelingBannerServices.toggleStatus(
        id,
        status,
        props.page === 'banner-product' ? true : false
      );

      if (!resp.error) {
        if (props.page === 'banner') {
          props.setData((prevState: BannerDetailType[] | any) =>
            prevState.map((item: BannerDetailType[] | any) =>
              item.id === id
                ? {
                    ...item,
                    status: resp.data.status,
                  }
                : { ...item, status: false }
            )
          );
        }

        if (props.page === 'banner-product') {
          props.setData((prevState: BannerDetailType[] | any) =>
            prevState.map((item: BannerDetailType[] | any) =>
              item.id === id
                ? {
                    ...item,
                    status: resp.data.status,
                  }
                : item
            )
          );
        }
        const msgActive = status ? 'In active success' : 'Active success';
        handlerMessage(msgActive, 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<BannerDetailType> =
    props.page === 'banner-product'
      ? [
          {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: 60,
            render: (__, _, index) => index + 1 + (page - 1) * pageSize,
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 300,
            ellipsis: true,
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
          },
          {
            title: 'Orderid',
            dataIndex: 'orderid',
            key: 'orderid',
            sorter: (a, b) => a.orderid - b.orderid,
            showSorterTooltip: false,
          },
          {
            title: 'Active',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (value) => <StatusCheck checked={value} />,
          },
          {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
              <MenuAction
                data={record}
                handleActive={() => onFetchToggleStatus(record.id, record.status)}
                handleView={() =>
                  router.push(
                    `/modeling-service/landing-page/${
                      props.page === 'banner' ? 'banner' : 'product'
                    }/view/${record.id}`
                  )
                }
                handleEdit={() =>
                  router.push(
                    `/modeling-service/landing-page/${
                      props.page === 'banner' ? 'banner' : 'product'
                    }/edit/${record.id}`
                  )
                }
                handleDelete={() => onFetchDeleteBanner(record.id)}
              />
            ),
          },
        ]
      : [
          {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: 60,
            render: (__, _, index) => index + 1 + (page - 1) * pageSize,
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 300,
            ellipsis: true,
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
          },
          {
            title: 'Active',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (value) => <StatusCheck checked={value} />,
          },
          {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
              <MenuAction
                data={record}
                handleActive={() => onFetchToggleStatus(record.id, record.status)}
                handleView={() =>
                  router.push(`/modeling-service/landing-page/banner/view/${record.id}`)
                }
                handleEdit={() =>
                  router.push(`/modeling-service/landing-page/banner/edit/${record.id}`)
                }
                handleDelete={() => onFetchDeleteBanner(record.id)}
              />
            ),
          },
        ];

  return (
    <>
      <TableCustom
        columns={columns}
        data={props.data || []}
        rowKey='id'
        loading={props.loading}
        total={props.data?.length || 0}
        page={page}
        isPagination={props.data?.length > pageSize}
        onChangePage={(page) => setPage(page)}
      />
    </>
  );
};

export default BannerComponent;
