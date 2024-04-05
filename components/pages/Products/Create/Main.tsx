import { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  Tag,
  Upload,
} from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

import { validationUploadFile } from 'common/constant';
import { getBase64, onBeforeUploadFileWithForm } from 'common/functions';
import convertCommas from 'common/functions/convertCommas';

import licenseServices from 'services/license-services';
import categoryServices from 'services/category-services';

import { LicenseModel } from 'models/license.models';
import { categoryListsType, typeImg } from 'models/category.model';
import { OptionSelect } from 'models/product.model';

import styled from 'styled-components';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onRemoveFile: (e: any, name: string) => void;
  fileLists: {
    [key: string]: typeImg[];
  };
  form: FormInstance;
  setFileLists: React.Dispatch<
    React.SetStateAction<{
      [key: string]: typeImg[];
    }>
  >;
  isDraft: boolean;
  type?: 'view' | '';
};

const MainComponent = (props: Props) => {
  const { form, setFileLists, fileLists, onRemoveFile, isDraft, type } = props;
  const [loadingCate, setLoadingCate] = useState(false);
  const [loadingLicense, setLoadingLicense] = useState(false);

  const watchPrice = Form.useWatch('price', form);
  const watchLicense = Form.useWatch('license_id', form);
  const watchCategory = Form.useWatch('cat_ids', form);
  const isFree = Form.useWatch('isFree', form);

  const [category, setCategory] = useState<OptionSelect[] | null | undefined>(null);
  const [licenses, setLicenses] = useState<OptionSelect[] | null | undefined>(null);

  useEffect(() => {
    if (
      watchPrice === 0 &&
      licenses?.some((item) => item.value === watchLicense && !item.is_free)
    ) {
      form.setFieldsValue({ license_id: null });
    }

    if (watchPrice > 0 && licenses?.some((item) => item.value === watchLicense && item.is_free)) {
      form.setFieldsValue({ license_id: null });
    }
  }, [watchPrice]);

  useEffect(() => {
    if (isFree) {
      form.setFieldsValue({
        price: undefined,
        old_price: undefined,
      });

      if (licenses?.some((item) => item.value === watchLicense && !item.is_free)) {
        form.setFieldsValue({
          license_id: undefined,
        });
      }
    }
  }, [isFree]);

  useEffect(() => {
    const onFetchAllCategory = async () => {
      setLoadingCate(true);
      try {
        const resp: { data: categoryListsType[] | null | undefined; error: boolean } =
          await categoryServices.getAllCategory();

        if (!resp.error) {
          setCategory(
            resp.data
              ?.filter((c) => c.status)
              .map((item: any) => ({ value: item.id, label: item.title, image: item.icon }))
          );
          setLoadingCate(false);
        }
      } catch (error) {
        setLoadingCate(false);
      }
    };

    const onFetchAllLicense = async () => {
      setLoadingLicense(true);
      try {
        const resp: { data: LicenseModel[] | undefined | null; error: boolean } =
          await licenseServices.getAllLicense();

        if (!resp.error) {
          setLicenses(
            resp.data?.map((item) => ({ value: item.id, label: item.title, is_free: item.is_free }))
          );
          setLoadingLicense(false);
        }
      } catch (error) {
        setLoadingLicense(false);
      }
    };

    onFetchAllCategory();
    onFetchAllLicense();
  }, []);

  const onCrop = async (file: any) => {
    getBase64(file, (image) => {
      setFileLists((prevState) => ({
        ...prevState,
        image: [
          {
            image,
            name: file.name,
            filename: file.name,
            filetype: file.type,
            fileUpload: file,
            isUpdate: form.getFieldValue('isUpdate'),
          },
        ],
      }));
    });
  };

  return (
    <MainComponent_wrapper className='content'>
      <h3 className='title__line'>Information</h3>
      <Row gutter={[16, 0]}>
        <Col span={24} xl={24}>
          <Form.Item
            name='image'
            label='Avatar image'
            className='ant-upload_my-custom'
            valuePropName='fileList'
            rules={[{ required: !isDraft, message: 'Avatar is required' }]}>
            <span id='image'>
              <ImgCrop
                fillColor='transparent'
                aspect={4 / 3}
                beforeCrop={(file) =>
                  onBeforeUploadFileWithForm({
                    file,
                    msgError: 'Image must be JPG, WEBP, PNG, JPEG and less than 2MB',
                  })
                }
                onModalOk={onCrop}>
                <Upload
                  showUploadList={false}
                  listType='picture-card'
                  disabled={type === 'view'}
                  maxCount={1}
                  accept={validationUploadFile.image.toString()}>
                  {fileLists.image && fileLists.image[0]?.image ? (
                    <div className='image_wrapper position-relative'>
                      <img src={fileLists.image[0]?.image} className='w-100 h-100' alt='' />
                      <Button
                        className='btn-delete'
                        disabled={type === 'view'}
                        onClick={(e) => onRemoveFile(e, 'image')}>
                        <DeleteOutlined />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined />
                      <p>Upload</p>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </span>
          </Form.Item>
        </Col>

        <Col span={24} xl={24}>
          <Form.Item
            name='title'
            label='Title'
            rules={[
              { required: true, message: 'Title is required' },
              { whitespace: true, message: 'Title cannot be blank' },
              { type: 'string' },
            ]}>
            <Input placeholder='Enter title' disabled={type === 'view'} showCount maxLength={70} />
          </Form.Item>
        </Col>

        <Col span={24} xl={12}>
          <Form.Item
            name='cat_ids'
            label='Category (Maximum 2)'
            rules={[
              {
                required: isDraft || !category?.length ? false : true,
                message: 'Category is required',
              },
              { max: 2, type: 'array', message: 'Maximum 2 categories' },
              ({}) => ({
                validator(_, value) {
                  const categoryValues = category?.map((item) => item.value);
                  if (value) {
                    const result = value.every((i: any) => categoryValues?.includes(i));
                    if (!result && value !== undefined) {
                      return Promise.reject(new Error('This category does not exist'));
                    }
                    return Promise.resolve(undefined);
                  }
                  return Promise.resolve(undefined);
                },
              }),
            ]}>
            <Select
              placeholder='Please select'
              getPopupContainer={(trigger) => trigger.parentNode}
              optionFilterProp='label'
              mode='multiple'
              showSearch
              allowClear
              tagRender={(props) => {
                const { label, value, closable, onClose } = props;

                const categoryExists = category?.some((category) => category.value === value);

                return (
                  <Tag color={categoryExists ? '' : 'error'} closable={closable} onClose={onClose}>
                    <span className='label_product text-truncate'>{label}</span>
                  </Tag>
                );
              }}
              disabled={type === 'view' || loadingCate}>
              {category?.map((item) => (
                <Select.Option
                  key={item.value}
                  value={item.value}
                  disabled={watchCategory?.length >= 2 && !watchCategory?.includes(item.value)}
                  label={item.label}
                  className='custom__render'>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={24} xl={12}>
          <Form.Item
            name='unit'
            label='Unit'
            rules={[{ required: isDraft ? false : true, message: 'Unit is required' }]}>
            <Select placeholder='Please select' disabled={type === 'view'}>
              <Select.Option value={1}>Meter</Select.Option>
              <Select.Option value={2}>Centimet</Select.Option>
              <Select.Option value={3}>Milimet</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item
            name='price'
            label='Price'
            rules={[
              { required: isDraft || isFree ? false : true, message: 'Price is required' },
              { type: 'number' },
              ({ getFieldValue, setFields }) => ({
                validator(_, value) {
                  if (!getFieldValue('old_price')) return Promise.resolve();
                  if (value >= getFieldValue('old_price')) {
                    return Promise.reject(new Error('The price must be less than the old price'));
                  }

                  setFields([{ name: 'old_price', errors: [] }]);
                  return Promise.resolve();
                },
              }),
            ]}>
            <InputNumber
              placeholder='Enter price'
              className='w-100'
              min={1}
              disabled={type === 'view' || isFree}
              precision={2}
              formatter={(value) => convertCommas(value)}
            />
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item
            name='old_price'
            label='Old price'
            rules={[
              { type: 'number' },
              ({ getFieldValue, setFields }) => ({
                validator(_, value) {
                  if (value && value <= getFieldValue('price')) {
                    return Promise.reject(
                      new Error('The old price must be greater than the price')
                    );
                  }
                  setFields([{ name: 'price', errors: [] }]);
                  return Promise.resolve();
                },
              }),
            ]}>
            <InputNumber
              placeholder='Enter old price'
              className='w-100'
              min={1}
              disabled={type === 'view' || isFree}
              precision={2}
              formatter={(value) => convertCommas(value)}
            />
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item
            name='license_id'
            label='License'
            rules={[
              {
                required: isDraft || !licenses?.length ? false : true,
                message: 'License is required',
              },
              { type: 'string' },
            ]}>
            <Select
              placeholder='Please select'
              getPopupContainer={(trigger) => trigger.parentNode}
              disabled={type === 'view' || loadingLicense}
              optionFilterProp='label'
              showSearch>
              {licenses?.map((item) => (
                <Select.Option
                  key={item.value}
                  value={item.value}
                  disabled={watchPrice > 0 ? item.is_free : !item.is_free}
                  label={item.label}
                  className='custom__render__license'>
                  {item.label}
                  {item.is_free ? <span style={{ color: '#6db2c5' }}>(FREE)</span> : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12} xl={24}>
          <Form.Item name='isFree' valuePropName='checked'>
            <Checkbox disabled={type === 'view'}>Free</Checkbox>
          </Form.Item>
        </Col>

        <Col span={24} />

        <Col span={8}>
          <Form.Item name='is_animated' valuePropName='checked'>
            <Checkbox disabled={type === 'view'}>Is animation</Checkbox>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name='is_pbr' valuePropName='checked'>
            <Checkbox disabled={type === 'view'}>Is pbr</Checkbox>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name='is_rigged' valuePropName='checked'>
            <Checkbox disabled={type === 'view'}>Is rigged</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </MainComponent_wrapper>
  );
};

const MainComponent_wrapper = styled.div`
  .ant-select-selection-item-content {
    display: flex;
    align-items: center;
  }

  .custom__render {
    .ant-select-item-option-content {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    img {
      width: 30px;
      height: 30px;
      padding: 3px;
    }
  }

  .custom__render__license {
    .ant-select-item-option-content {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center;
    gap: 5px;

    img {
      width: 25px;
      height: 25px;
      padding: 3px;
    }
  }
  .ant-select-selection-overflow-item {
    max-width: 50%;
  }
  .ant-tag {
    display: flex;
    align-items: center;
    margin: 2px 5px;
    height: 25px;

    .label_product {
      display: block;
    }
    .ant-select-selection-item-remove {
      padding-left: 5px;
    }
  }
`;

export default MainComponent;
