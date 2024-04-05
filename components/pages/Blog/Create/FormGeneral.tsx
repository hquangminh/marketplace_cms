import { useEffect, useState } from 'react';

import { Button, Col, Form, Input, Row, Select, Switch, Tag, Tooltip, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';

import blogServices from 'services/blog-services';
import { imageSupported } from 'common/constant';
import { formatNumber, handlerMessage, searchDebounce } from 'common/functions';

import { BlogCategory, BlogData } from 'models/blog.modes';
import { ProductModel } from 'models/product.model';
import { typeImg } from 'models/category.model';

import { PageContent, PageContent_Title } from 'styles/__styles';
import styled from 'styled-components';

const Wrap = styled(PageContent)`
  .ant-upload.ant-upload-select-picture-card,
  .ant-upload-list-picture-card-container {
    margin-bottom: 0;
  }
  .ant-select-item-option-state {
    display: inline-flex;
    align-items: center;
    margin-left: 20px;
  }

  .image_wrapper img {
    object-fit: cover;
  }
  .ant-select-dropdown-empty {
    padding: 0;
  }
  .ant-tag {
    display: flex;
    align-items: center;
    margin: 2px 5px;
    .label_product {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ant-select-selection-item-remove {
      padding-left: 5px;
    }
  }
`;

const ruleWhitespace = { whitespace: true, message: 'Cannot be empty' };

type Props = {
  category: BlogCategory[];
  data?: BlogData;
  isRequired: boolean;
  // eslint-disable-next-line no-unused-vars
  onRemoveFile: (id: string, filedName: string) => void;
  fileLists: { [key: string]: typeImg[] };
};

export default function BlogCreateGeneral({
  category,
  data,
  isRequired,
  onRemoveFile,
  fileLists,
}: Props) {
  const [products, setProduct] = useState<ProductModel[] | undefined>(
    data?.market_blog_items.map((i) => i.market_item)
  );
  const [searching, setSearch] = useState<boolean>(false);
  const [keySearch, setKeySearch] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();
    onSearch(controller.signal);
    return () => controller.abort();
  }, [keySearch]);

  const onSearch = async (signal: AbortSignal) => {
    try {
      setSearch(true);
      if (!keySearch.trim()) setProduct(undefined);
      else
        await blogServices
          .searchProduct(keySearch, { signal })
          .then(({ data }) => setProduct(data || []));
      setSearch(false);
    } catch (error) {}
  };

  const srcImage = fileLists['image'] ? fileLists['image'][0].image : '';
  const srcBanner = fileLists['banner'] ? fileLists['banner'][0].image : '';

  return (
    <Wrap>
      <PageContent_Title>General Information</PageContent_Title>

      <Row gutter={[10, 10]}>
        <Col span={12}>
          <Form.Item
            name='image'
            label='Image'
            rules={[{ required: isRequired, message: 'Thumbnail is required' }]}
            valuePropName='fileList'
            getValueFromEvent={normFile}
            className='ant-upload_my-custom'
            initialValue={data?.image ? [{ url: data.image }] : undefined}>
            <Upload
              listType='picture-card'
              maxCount={1}
              accept={imageSupported.map((i) => '.' + i).join(',')}
              showUploadList={false}
              beforeUpload={beforeUpload}>
              {srcImage ? (
                <div className='image_wrapper w-100 h-100 d-flex align-items-center position-relative'>
                  <img src={srcImage} className='w-100 h-100' alt='' />
                  <Button className='btn-delete' onClick={(e: any) => onRemoveFile(e, 'image')}>
                    <DeleteOutlined />
                  </Button>
                </div>
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name='banner'
            label='Banner'
            rules={[{ required: isRequired, message: 'Thumbnail is required' }]}
            valuePropName='fileList'
            getValueFromEvent={normFile}
            className='ant-upload_my-custom'
            initialValue={data?.banner ? [{ url: data.banner }] : undefined}>
            <Upload
              listType='picture-card'
              maxCount={1}
              accept={imageSupported.map((i) => '.' + i).join(',')}
              showUploadList={false}
              beforeUpload={beforeUpload}>
              {srcBanner ? (
                <div className='image_wrapper w-100 h-100 d-flex align-items-center position-relative'>
                  <img src={srcBanner} className='w-100 h-100' alt='' />
                  <Button className='btn-delete' onClick={(e: any) => onRemoveFile(e, 'banner')}>
                    <DeleteOutlined />
                  </Button>
                </div>
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Col>

        <Col span={24} xl={12}>
          <Form.Item
            name='name'
            label='Blog name'
            rules={[{ required: true, message: 'Blog name is required' }, ruleWhitespace]}
            initialValue={data?.name}>
            <Input placeholder='Input blog name' />
          </Form.Item>
        </Col>

        <Col span={24} xl={12}>
          <Form.Item
            name='category_id'
            label='Category'
            rules={[{ required: isRequired, message: 'Category is required' }]}
            initialValue={data?.market_category_blog?.id}>
            <Select
              placeholder='Select category'
              options={category?.map((cate) => ({
                value: cate.id,
                label: cate.title,
              }))}
            />
          </Form.Item>
        </Col>

        <Col span={24} xl={12}>
          <Form.Item
            name='slug'
            label='Slug'
            initialValue={data?.slug}
            rules={[
              { required: isRequired, message: 'Slug is required' },
              { pattern: /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, message: 'Wrong format' },
              ruleWhitespace,
            ]}>
            <Input placeholder='Input slug' />
          </Form.Item>
        </Col>

        <Col span={24} xl={12}>
          <Form.Item
            name='products'
            label='Attach products'
            initialValue={data?.market_blog_items.map((i) => i.market_item.id)}>
            <Select
              mode='multiple'
              placeholder='Search product'
              loading={searching}
              filterOption={false}
              optionLabelProp='title'
              options={products?.map((p) => ({
                label: <SelectOption data={p} />,
                title: p.title,
                value: p.id,
              }))}
              getPopupContainer={(triggerNode) => triggerNode}
              onSearch={searchDebounce((value) => setKeySearch(value))}
              tagRender={(props) => {
                const { label, value, closable, onClose } = props;
                const selectedProduct = data?.market_blog_items.find(
                  (item) => item.market_item.id === value
                );

                const hasStatusDraft = selectedProduct?.market_item.status === 5;

                const hasStatus = selectedProduct?.market_item.market_item_categories.every(
                  (category) => !category.market_category.status
                );

                return (
                  <Tooltip
                    title={hasStatus || hasStatusDraft ? 'Product with category is false' : ''}>
                    <Tag
                      icon={hasStatus || hasStatusDraft ? <ExclamationCircleOutlined /> : undefined}
                      color={hasStatus || hasStatusDraft ? 'warning' : undefined}
                      closable={closable}
                      onClose={onClose}>
                      <span className='label_product'>{label}</span>
                    </Tag>
                  </Tooltip>
                );
              }}
            />
          </Form.Item>
        </Col>

        <Col span={24} xl={12}>
          <Form.Item name='is_publish' label='Publish' initialValue={data?.is_publish}>
            <Switch checked={isRequired} />
          </Form.Item>
        </Col>
      </Row>
    </Wrap>
  );
}

const normFile = (e: any) => {
  let fileList;
  if (Array.isArray(e)) fileList = e;
  else fileList = e?.fileList;

  return fileList;
};

const beforeUpload = (file: RcFile) => {
  const isSupportedType = imageSupported.includes(file.name.split('.').slice(-1)[0].toLowerCase());

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M || !isSupportedType) {
    handlerMessage('Image must be JPG, WEBP, PNG, JPEG and less than 2MB', 'error');
  }

  return isSupportedType && isLt2M ? false : Upload.LIST_IGNORE;
};

const SelectOption = ({ data }: { data: ProductModel }) => {
  return (
    <>
      <img src={data.image} alt='' style={{ objectFit: 'cover', width: '20px', height: '20px' }} />
      <span className='ml-2'>{data.title}</span>
      <span style={{ float: 'right' }}>{data.price ? formatNumber(data.price, '$') : 'Free'}</span>
    </>
  );
};
