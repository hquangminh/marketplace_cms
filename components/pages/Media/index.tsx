import React, { useEffect, useState } from 'react';

import { ColumnsType } from 'antd/es/table/interface';
import { Button, Col, Input, Row, Select } from 'antd';

import { useAppSelector } from 'redux/hooks';
import { selectAuthState } from 'redux/reducers/auth';

import {
  handlerMessage,
  onCheckErrorApiMessage,
  onToastNoPermission,
  searchDebounce,
} from 'common/functions';

import mediaServices from 'services/media-services';

import TableCustom from 'components/fragments/TableCustom';
import MenuAction from 'components/fragments/MenuAction';
import ViewActionComponent from './ViewAction';
import CreateModal from './CreateModal';

import { mediaListType, mediaType } from 'models/media.models';
import { PageAllowActionType } from 'models/common.model';

import * as SC from './style';

type Props = {
  allowAction: PageAllowActionType;
};

const pageSize = 10;

const MediaComponent = (props: Props) => {
  const { allowAction } = props;

  const { me }: any = useAppSelector(selectAuthState);

  const [mediaList, setMediaList] = useState<mediaListType | {} | any>({
    data: undefined,
    error: null,
    total: 0,
  });
  const [page, setPage] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'' | 'by-name' | 'by-me'>('');
  const [textSearch, setTextSearch] = useState<string>('');
  const [mediaPreview, setMediaPreview] = useState<{ name: string; url: string; type: string }>();

  const onDeleteImage = async (id: string) => {
    setLoading(true);

    try {
      await mediaServices.deleteImage(id);
      const newData = mediaList.data.filter((item: any) => item.id !== id);
      setMediaList((prevState: mediaListType) => ({
        ...prevState,
        data: newData,
        total: prevState.total - 1,
      }));
      setLoading(false);
      handlerMessage('Delete success', 'success');
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onCopyUrlMedia = (url: string) => {
    navigator.clipboard.writeText(url).then(() => handlerMessage('Copied', 'success'));
  };

  const columns: ColumnsType<mediaType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '60px',
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },
    {
      title: 'Image',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
      render: (url, record) => (
        <div className='media__img'>
          {record.filetype?.startsWith('video') ? <video src={url} /> : <img src={url} alt='' />}
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Type',
      dataIndex: 'filetype',
      key: 'filetype',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          handleView={
            allowAction?.read
              ? () => {
                  document.body.style.overflow = 'hidden';
                  setMediaPreview({
                    name: record.filename,
                    url: record.url,
                    type: record.filetype,
                  });
                }
              : onToastNoPermission
          }
          handleDelete={allowAction?.remove ? () => onDeleteImage(record.id) : onToastNoPermission}
          handelCopy={() => onCopyUrlMedia(record.url)}
        />
      ),
    },
  ];

  const onFetchAllImage = async (page: number = 1) => {
    setLoading(true);

    try {
      const res = await mediaServices.getAllImage(pageSize, pageSize * (page - 1));
      setMediaList(res);
      setPage(page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handlerMessage('', 'error');
    }
  };

  useEffect(() => {
    onFetchAllImage(1);
  }, []);

  const onFetchSearchImageByUser = async (page: number = 1) => {
    setLoading(true);

    try {
      const res = await mediaServices.searchImageByUser(me?.id, pageSize, pageSize * (page - 1));
      setMediaList(res);
      setPage(page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handlerMessage('', 'error');
    }
  };

  const onFetchSearchImageByName = async (page: number = 1, name: string) => {
    if (name) {
      setLoading(true);
      try {
        const res = await mediaServices.searchImageByName(name, pageSize, pageSize * (page - 1));

        setMediaList(res ? res : { data: [], error: true, total: 0 });
        setPage(page);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else setMediaList({ data: null });
  };

  const onSelectSearch = (value: string) => {
    setFilterType(value === 'by-me' ? 'by-me' : value === 'by-name' ? 'by-name' : '');

    if (value === 'by-me') onFetchSearchImageByUser(1);
    else if (value === 'by-name') setMediaList({ data: null });
    else onFetchAllImage(1);
  };

  const onChangeSearch = searchDebounce((value) => onFetchSearchImageByName(1, value));

  return (
    <SC.Media_Wrapper>
      <Row gutter={[20, 10]} className='header-filter pb-4'>
        <Col span={24} xl={6} xxl={4}>
          <Select
            className='w-100'
            placeholder='Search by'
            allowClear
            onClear={() => onSelectSearch('')}
            onSelect={onSelectSearch}>
            <Select.Option value='by-me'>Upload by me</Select.Option>
            <Select.Option value='by-name'>Search media</Select.Option>
          </Select>
        </Col>
        {filterType === 'by-name' && (
          <Col span={24} xl={12} xxl={8}>
            <div className='box__search'>
              <Input
                placeholder='Search'
                onChange={(e) => {
                  setTextSearch(e.target.value.trim());
                  onChangeSearch(e.target.value.trim());
                }}
              />
            </div>
          </Col>
        )}
      </Row>

      {allowAction.add && (
        <Button className='btn-add' type='primary' onClick={() => setIsShowModal(true)}>
          Create
        </Button>
      )}

      <TableCustom
        columns={columns}
        data={mediaList.data}
        rowKey='id'
        loading={loading}
        total={mediaList.total}
        isPagination={mediaList.total > pageSize}
        page={page}
        onChangePage={(page) => {
          if (filterType === 'by-me') return onFetchSearchImageByUser(page);
          if (filterType === 'by-name') return onFetchSearchImageByName(page, textSearch);
          return onFetchAllImage(page);
        }}
      />

      <CreateModal
        mediaList={mediaList.data || []}
        setMediaList={setMediaList}
        isShowModal={isShowModal}
        onClose={() => setIsShowModal(false)}
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
    </SC.Media_Wrapper>
  );
};

export default MediaComponent;
