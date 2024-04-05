import { useEffect, useState } from 'react';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { regex } from 'common/constant';

import brandsServices from 'services/brands-services';

import { OptionSelect } from 'models/product.model';

type Props = {
  form: FormInstance;
  type?: 'view' | '';
  isDraft: boolean;
  brandLists?: {
    brand_id: string;
    link: string;
    sell_price?: number;
    item_no: string;
  };
};

const BrandsComponent = (props: Props) => {
  const watchBranch = Form.useWatch('brand_id', props.form);

  const [loadingBrand, setLoadingBrand] = useState(false);
  const [brands, setBrands] = useState<OptionSelect[] | null | undefined>(null);

  useEffect(() => {
    const onFetchAllBrands = async () => {
      setLoadingBrand(true);

      try {
        const resp = await brandsServices.listBrands({
          limit: 2147483647,
          offset: 0,
          params: { status: true },
        });

        if (!resp.error) {
          setBrands(
            resp.data?.map((item: any) => ({ value: item.id, label: item.title, image: item.icon }))
          );
          setLoadingBrand(false);
        }
      } catch (error) {
        setLoadingBrand(false);
      }
    };

    onFetchAllBrands();
  }, []);

  return (
    <div className='position-relative content'>
      <h3 className='title__line'>Brands</h3>
      <Row gutter={[20, 0]}>
        <Col span={24}>
          <Form.Item
            name='brand_id'
            label='Brand'
            rules={[
              ({ setFields }) => ({
                validator(_, value) {
                  const foundBrand = brands?.some((brand) => brand.value === value);

                  if (!value) {
                    setFields([
                      {
                        name: 'link',
                        errors: [],
                      },
                      {
                        name: 'sell_price',
                        errors: [],
                      },
                      {
                        name: 'item_no',
                        errors: [],
                      },
                    ]);
                  } else if (value !== undefined && !foundBrand) {
                    return Promise.reject(new Error('This brand does not exist'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}>
            <Select
              placeholder='Please select'
              getPopupContainer={(trigger) => trigger.parentNode}
              disabled={props.type === 'view' || loadingBrand}
              optionFilterProp='label'
              onClear={() => {
                props.form.setFieldsValue({
                  sell_price: undefined,
                  link: undefined,
                  item_no: undefined,
                });
              }}
              allowClear
              showSearch>
              {brands?.map((item) => (
                <Select.Option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  className='custom__render__license'>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label='Link'
            name='link'
            rules={[
              { whitespace: true, message: 'Link cannot be empty' },
              { pattern: regex.url, message: 'Link is not a valid url' },
            ]}>
            <Input placeholder='Enter link' disabled={props.type === 'view' || !watchBranch} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label='Price' name='sell_price'>
            <InputNumber
              placeholder='Enter price'
              className='w-100'
              min={0}
              disabled={props.type === 'view' || !watchBranch}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label='Stock Keeping Unit (SKU)'
            name='item_no'
            rules={[{ whitespace: true, message: 'Stock keeping unit cannot be empty' }]}>
            <Input
              placeholder='Enter stock keeping unit'
              disabled={props.type === 'view' || !watchBranch}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BrandsComponent;
