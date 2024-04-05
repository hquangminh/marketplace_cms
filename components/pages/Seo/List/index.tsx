import { useRouter } from 'next/router';

import { Space, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import seoServices from 'services/seo-services';
import { handlerMessage, onCheckErrorApiMessage, onToastNoPermission } from 'common/functions';

import MenuAction from 'components/fragments/MenuAction';
import TableCustom from 'components/fragments/TableCustom';

import { SeoComponentType, SeoModel } from 'models/seo.models';

const pageSize = 10;

const SeoListComponent = (props: SeoComponentType) => {
  const { loading, setLoading, setSeoList, data } = props;

  const router = useRouter();

  const onFetchDeleteSeo = async (id: string) => {
    setLoading(true);
    try {
      await seoServices.deleteSeo(id);
      setLoading(false);
      const newData = data?.filter((item: SeoModel) => item.id !== id);
      setSeoList(newData);
      handlerMessage('Delete success', 'success');
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onDeleteSeo = (id: string) => {
    onFetchDeleteSeo(id);
  };

  const columns: ColumnsType<SeoModel> = [
    {
      title: 'No',
      key: 'no',
      width: 70,
      render: (_, record) => (data?.findIndex((i) => i.id === record.id) || 0) + 1,
    },
    {
      title: 'Image',
      key: 'image',
      width: 100,
      render: (_, record) => (
        <img
          src={record.market_seo_languages.find((i) => i.market_language.is_default)?.image}
          alt={record.market_seo_languages.find((i) => i.market_language.is_default)?.title}
          width='60px'
        />
      ),
    },
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
      width: 140,
      render: (text) => text,
    },
    {
      title: 'Title',
      key: 'title',
      render: (_, record) =>
        record.market_seo_languages.find((i) => i.market_language.is_default)?.title,
    },
    {
      title: 'Keywords',
      key: 'keywords',
      render: (_, record) => (
        <Space wrap>
          {record.market_seo_languages
            .find((i) => i.market_language.is_default)
            ?.keywords?.split(',')
            .map((item: string, index: number) => (
              <Tag key={index} className='mr-0'>
                {item}
              </Tag>
            ))}
        </Space>
      ),
    },
    {
      title: 'Descriptions',
      key: 'descriptions',
      ellipsis: true,
      render: (_, record) =>
        record.market_seo_languages.find((i) => i.market_language.is_default)?.descriptions,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 80,
      render: (_, record) => (
        <MenuAction
          data={record}
          handleEdit={
            props.allowAction?.add
              ? () => router.push(`/seo/edit/${record.page}`)
              : onToastNoPermission
          }
          handleDelete={
            props.allowAction?.remove ? () => onDeleteSeo(record.id) : onToastNoPermission
          }
        />
      ),
    },
  ];

  return (
    <TableCustom
      loading={loading}
      columns={columns}
      data={data || []}
      rowKey='id'
      isPagination={data ? data.length > pageSize : false}
      pageSize={pageSize}
      width={800}
    />
  );
};

export default SeoListComponent;
