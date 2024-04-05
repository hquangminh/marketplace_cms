import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';
import { Button, Tag } from 'antd';
import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import brandsServices from 'services/brands-services';
import MenuAction from 'components/fragments/MenuAction';
import TableCustom from 'components/fragments/TableCustom';
import { BrandsProps, BrandsType } from 'models/brands-model';

import * as L from './style';
import { Container } from 'styles/__styles';

const BrandComponent = (props: BrandsProps) => {
  const router = useRouter();
  const { setBrands } = props;

  const onFetchDeleteBrands = async (id: string) => {
    try {
      const resp = await brandsServices.deleteBrands(id);

      if (!resp.error) {
        setBrands((prevState) => ({
          dataRender: prevState.dataRender.filter((item) => item.id !== id),
          total: prevState.total - 1,
        }));
        handlerMessage('Delete success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<BrandsType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '80px',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: 'Name ',
      dataIndex: 'title',
      className: 'title__brands',
      key: 'title',
    },
    {
      title: 'Logo',
      dataIndex: 'image',
      key: 'image',
      className: 'image_brands',
      align: 'center',
      render: (url: string, record: BrandsType) => (
        <div className='brands__card'>{record?.image ? <img src={url} alt='' /> : ''}</div>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      className: 'website__brands',
      key: 'website',
      render: (url: string, record: BrandsType) => (
        <div className='website__link'>
          {record?.website ? (
            <a target='_blank' href={record?.website} rel='noreferrer'>
              {record?.website}
            </a>
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      className: 'contact__brands',
      key: 'contact',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
      className: 'status__brands',
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
      width: '10%',
      render: (record: any) => (
        <MenuAction
          data={record}
          contentDelete={{ content: `Title: ${record.title}` }}
          handleEdit={() => router.push(`brands/edit/${record.id}`)}
          handleDelete={() => onFetchDeleteBrands(record.id)}
        />
      ),
    },
  ];

  return (
    <L.Brand_wrapper>
      <Container>
        <Button className='btn-add' type='primary' onClick={() => router.push('/brands/create')}>
          Create
        </Button>
        <TableCustom
          loading={props.loading}
          data={props.brands || undefined}
          columns={columns}
          rowKey='id'
          total={props.total || 0}
          page={props.page}
          pageSize={props.pageSize}
          isPagination={props.total > props.pageSize}
          onChangePage={(page) => props.setPage(page)}
          width={800}
        />
      </Container>
    </L.Brand_wrapper>
  );
};

export default BrandComponent;
