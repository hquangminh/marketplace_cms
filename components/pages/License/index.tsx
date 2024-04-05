import { useState } from 'react';

import { Button, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';

import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import licenseServices from 'services/license-services';

import MenuAction from 'components/fragments/MenuAction';
import StatusCheck from 'components/fragments/StatusCheck';
import TableCustom from 'components/fragments/TableCustom';
import ModalComponent from './Modal';

import { LicenseModel, ModalLists, ParamsType } from 'models/license.models';
import { PermissionType } from 'models/auth.model';

import * as L from './style';

type Props = {
  loading: boolean;
  permis: PermissionType | undefined;
  data: LicenseModel[] | null;
  total: number;
  setData: React.Dispatch<React.SetStateAction<LicenseModel[] | null>>;
};

const pageSize = 10;

const LicenseComponent = (props: Props) => {
  const { data, permis, loading, setData, total } = props;

  const [modalLists, setModalLists] = useState<ModalLists>({
    isShow: false,
    data: null,
    type: '',
  });

  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const onFetchCreateLicense = async (body: ParamsType) => {
    setLoadingFetch(true);
    try {
      const resp = await licenseServices.createLicense(body);

      if (!resp.error) {
        setData((prevState) => (prevState ? [...prevState, resp.data] : [resp.data]));

        setModalLists((prevState) => ({
          ...prevState,
          data: null,
          isShow: false,
        }));
        handlerMessage('Create success', 'success');
        setLoadingFetch(false);
      }
    } catch (error: any) {
      setLoadingFetch(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchUpdateLicense = async (id: string, body: ParamsType) => {
    setLoadingFetch(true);
    try {
      const resp = await licenseServices.updateLicense(id, body);

      if (!resp.error) {
        setData(
          (prevState) => prevState && prevState.map((item) => (item.id === id ? resp.data : item))
        );
        setLoadingFetch(false);
        setModalLists((prevState) => ({
          ...prevState,
          data: null,
          isShow: false,
        }));
        handlerMessage('Update success', 'success');
      }
    } catch (error: any) {
      setLoadingFetch(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchDeleteLicense = async (id: string) => {
    try {
      const resp = await licenseServices.deleteLicense(id);

      if (!resp.error) {
        handlerMessage('Delete success', 'success');
        setData((prevState) => prevState && prevState.filter((item) => item.id !== id));
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<LicenseModel> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '60px',
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },

    {
      title: 'Is free',
      dataIndex: 'is_free',
      key: 'is_free',
      sorter: (x, y) => (x.is_free === y.is_free ? 0 : x.is_free ? -1 : 1),
      showSorterTooltip: false,
      render: (value) => <StatusCheck checked={value} />,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      className: 'description__column',
      width: 500,
      render: (value) => (
        <Typography.Paragraph ellipsis={{ rows: 2 }} className='mb-0'>
          <div className='render__textarea' dangerouslySetInnerHTML={{ __html: value }} />
        </Typography.Paragraph>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          handleView={() => setModalLists({ isShow: true, data: record, type: 'view' })}
          handleEdit={
            permis?.license?.write
              ? () => setModalLists({ isShow: true, data: record, type: 'edit' })
              : undefined
          }
          handleDelete={permis?.license?.remove ? () => onFetchDeleteLicense(record.id) : undefined}
        />
      ),
    },
  ];

  return (
    <L.LicenseComponent_wrapper>
      {permis?.license?.write && (
        <Button
          className='btn-add'
          type='primary'
          onClick={() => setModalLists(() => ({ type: 'create', isShow: true, data: null }))}>
          Create
        </Button>
      )}

      <ModalComponent
        modalLists={modalLists}
        loading={loadingFetch}
        setModalLists={setModalLists}
        onFetchUpdateLicense={onFetchUpdateLicense}
        onFetchCreateLicense={onFetchCreateLicense}
        permis={permis}
      />

      <TableCustom
        columns={columns}
        data={data || []}
        loading={loading}
        rowKey='id'
        page={page}
        isPagination={total > pageSize}
        total={total}
        onChangePage={(page) => setPage(page)}
      />
    </L.LicenseComponent_wrapper>
  );
};

export default LicenseComponent;
