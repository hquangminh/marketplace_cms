import React, { useState } from 'react';
import moment from 'moment';

import { Button, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { handlerMessage, onCheckErrorApiMessage, onToastNoPermission } from 'common/functions';
import bannerServices from 'services/banner-services';

import MenuAction from 'components/fragments/MenuAction';
import StatusCheck from 'components/fragments/StatusCheck';
import TableCustom from 'components/fragments/TableCustom';
import ViewActionComponent from '../Media/ViewAction';
import ModalComponent from './Modal';

import { BannerModel, ModalLists, ParamsType } from 'models/banner.model';
import { typeImg } from 'models/category.model';
import { PageAllowActionType } from 'models/common.model';

import * as L from './style';

type Props = {
  data: BannerModel[] | null;

  loading: boolean;
  total: number;
  setData: React.Dispatch<React.SetStateAction<BannerModel[] | null>>;
  allowAction: PageAllowActionType;
};

const pageSize = 10;

const BannerComponent = (props: Props) => {
  const { data, total, loading, setData, allowAction } = props;
  const [form] = Form.useForm();

  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [fileList, setFileList] = useState<typeImg[] | []>([]);
  const [mediaPreview, setMediaPreview] = useState<any>({});

  const [modalLists, setModalLists] = useState<ModalLists>({
    isShow: false,
    data: null,
    type: '',
  });

  const onFetchEditBanner = async (id: string, body: ParamsType) => {
    setLoadingFetch(true);
    try {
      const resp = await bannerServices.updateBanner(id, body);

      if (!resp.error) {
        setData(
          (prevState) => prevState && prevState.map((item) => (item.id === id ? resp.data : item))
        );
        setModalLists(() => ({ type: 'create', data: null, isShow: false }));

        setLoadingFetch(false);
        setFileList([]);

        form.resetFields();

        handlerMessage('Update success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoadingFetch(false);
    }
  };

  const onFetchCreateBanner = async (body: ParamsType) => {
    setLoadingFetch(true);

    try {
      const resp = await bannerServices.createBanner(body);

      if (!resp.error) {
        resp.status = false;
        setData((prevState) => (prevState ? [resp.data, ...prevState] : [resp.data]));
        setModalLists(() => ({ type: 'create', data: null, isShow: false }));

        setLoadingFetch(false);
        setFileList([]);
        form.resetFields();

        handlerMessage('Create success', 'success');
      }
    } catch (error: any) {
      setLoadingFetch(false);

      onCheckErrorApiMessage(error);
    }
  };

  const onFetchActiveBanner = async (id: string, status: boolean) => {
    try {
      const resp = await bannerServices.activeBanner(id, status);

      if (!resp.error) {
        setData(
          (prevState) =>
            prevState &&
            prevState.map((item) =>
              item.id === id ? { ...resp.data, status: !status } : { ...item, status: false }
            )
        );

        handlerMessage('Update success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchDeleteBanner = async (id: string) => {
    try {
      const resp = await bannerServices.deleteBanner(id);

      if (!resp.error) {
        setData((prevState) => prevState && prevState.filter((item) => item.id !== id));
      }
      handlerMessage('Delete success', 'success');
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<BannerModel> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '60px',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (url) => <img src={url} alt='' style={{ width: '60px', height: '60px' }} />,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value) => (value ? moment(value).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Active',
      dataIndex: 'status',
      key: 'status',
      sorter: (x, y) => (x === y ? 0 : x ? -1 : 1),
      showSorterTooltip: false,
      render: (value) => <StatusCheck checked={value} />,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          handleView={
            allowAction?.read ? () => setMediaPreview({ url: record.image }) : onToastNoPermission
          }
          handleActive={
            allowAction?.add
              ? () => onFetchActiveBanner(record.id, record.status)
              : onToastNoPermission
          }
          handleEdit={
            allowAction?.add
              ? () => setModalLists({ isShow: true, data: record, type: 'edit' })
              : onToastNoPermission
          }
          handleDelete={
            allowAction?.remove ? () => onFetchDeleteBanner(record.id) : onToastNoPermission
          }
        />
      ),
    },
  ];

  return (
    <L.BannerComponent_wrapper>
      {allowAction?.add ? (
        <Button
          className='btn-add'
          type='primary'
          onClick={() => setModalLists(() => ({ type: 'create', isShow: true, data: null }))}>
          Create
        </Button>
      ) : (
        ''
      )}

      <ModalComponent
        modalLists={modalLists}
        loading={loadingFetch}
        setModalLists={setModalLists}
        onFetchEditBanner={onFetchEditBanner}
        onFetchCreateBanner={onFetchCreateBanner}
        form={form}
        fileList={fileList}
        setFileList={setFileList}
      />

      <TableCustom
        columns={columns}
        data={data || undefined}
        rowKey='id'
        loading={loading}
        total={total}
        page={page}
        isPagination={total > pageSize}
        onChangePage={(page) => setPage(page)}
      />

      <ViewActionComponent
        mediaName={mediaPreview?.name}
        mediaUrl={mediaPreview?.url}
        mediaType={mediaPreview?.type}
        onClose={() => {
          document.body.style.removeProperty('overflow');
          setMediaPreview(undefined);
        }}
      />
    </L.BannerComponent_wrapper>
  );
};

export default BannerComponent;
