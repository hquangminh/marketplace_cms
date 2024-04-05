import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Input, Select, Skeleton, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';

import helpServices from 'services/help-services';

import {
  handlerMessage,
  onCheckErrorApiMessage,
  onToastNoPermission,
  searchDebounce,
} from 'common/functions';

import MenuAction from 'components/fragments/MenuAction';
import TableCustom from 'components/fragments/TableCustom';

import { categoryListsType } from 'models/category.model';
import { DataHelpType, HelpComponentProps } from 'models/help-model';

import styled from 'styled-components';
import { PageContent } from 'styles/__styles';

const pageSize = 10;

const HelpComponent = (props: HelpComponentProps) => {
  const { data, loading, allowAction, setData, setFilterList, listCategoryDisable } = props;
  const router = useRouter();

  const [page, setPage] = useState(1);

  const [loadingCate, setLoadingCate] = useState<boolean>(true);

  const [category, setCategory] = useState<categoryListsType[] | []>([]);

  useEffect(() => {
    const onFetchCategory = async () => {
      setLoadingCate(true);
      try {
        const resp = await helpServices.getAllHelpCategory();

        if (!resp.error) {
          const newData = resp.data.filter((item: any) => item.status);

          setCategory(newData);
          setLoadingCate(false);
        }
      } catch (error) {
        setLoadingCate(false);
      }
    };

    onFetchCategory();
  }, []);

  const onFetchDeleteHelp = async (id: string) => {
    try {
      await helpServices.deleteHelp(id);
      setData((prevState) => prevState.filter((p) => p.id !== id));
      handlerMessage('Delete success', 'success');
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<DataHelpType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },

    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Sort ID',
      key: 'sort_id',
      dataIndex: 'sort_id',
      sorter: (a, b) => a.sort_id - b.sort_id,
      showSorterTooltip: false,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
      render: (value: boolean) => (
        <>
          <Tag
            color={value === true ? 'success' : 'error'}
            style={{ minWidth: 80, marginRight: 0 }}>
            {value === true ? 'Active' : 'Inactive'}
          </Tag>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          handleView={
            allowAction.read ? () => router.push(`/help/view/${record.id}`) : onToastNoPermission
          }
          handleEdit={
            allowAction.add ? () => router.push(`/help/edit/${record.id}`) : onToastNoPermission
          }
          contentDelete={{
            title: 'Are you sure delete this help?',
            content: `${record.title}`,
          }}
          handleDelete={
            allowAction.remove ? () => onFetchDeleteHelp(record.id) : onToastNoPermission
          }
        />
      ),
    },
  ];

  return (
    <Help_wrapper>
      <PageContent>
        <h4 className='title__big mb-3'>
          Total {data?.length} post{data?.length > 1 ? 's' : ''}
        </h4>
        <BoxFilter_wrapper>
          <Input
            placeholder='Search help'
            onChange={searchDebounce((e) => {
              setFilterList((prevState) => ({
                ...prevState,
                title: e.target.value.trim() || undefined,
              }));
            })}
            className='w-100'
          />

          <Select
            style={{ inlineSize: 300, height: 'auto', wordWrap: 'break-word' }}
            placeholder='Filter by category'
            className='w-50'
            showSearch
            allowClear={true}
            onChange={(value) =>
              setFilterList((prevState) => ({
                ...prevState,
                category: value,
              }))
            }
            optionFilterProp='label'>
            {loadingCate ? (
              <Select.Option key='loading' disabled>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Select.Option>
            ) : (
              category?.map((v, i) => (
                <Select.Option value={v.id} label={v.title} key={i}>
                  <span className='truncate-label'> {v.title} </span>
                </Select.Option>
              ))
            )}
          </Select>
        </BoxFilter_wrapper>
        <TableCustom
          onChangePage={(page) => setPage(page)}
          columns={columns}
          page={page}
          isPagination={data.length > pageSize}
          loading={loading}
          rowKey='id'
          data={data}
          listCategoryDisable={listCategoryDisable}
          categoryDisableTitle='This help category has been hidden because the owner changed the category, or the category does not exist, please update the category again.'
        />
      </PageContent>
    </Help_wrapper>
  );
};

const Help_wrapper = styled.div`
  .content {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .title__big {
    font-size: 18px;
  }
`;

const BoxFilter_wrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;

  input,
  .ant-select-selector {
    min-height: 41px;
  }
  .truncate-label {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 70%;
  }
`;

export default HelpComponent;
