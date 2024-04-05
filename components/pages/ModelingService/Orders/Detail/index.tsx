import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Form, Modal, Space, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';

import { formatNumber, onCheckErrorApiMessage } from 'common/functions';
import orderServices from 'services/modeling-service/order-services';

import ModelingOrderInformation from './Information';
import ModelingOrderEstimated from './Estimated';
import ModelingOrderProduct from './Product';

import { ModelingOrderModel, ModelingStatus } from 'models/modeling-landing-page-orders';
import { PriceType } from 'models/modeling-landing-page-pricing';

type Props = {
  data: ModelingOrderModel;
  pricePackage: PriceType[];
  onUpdatePackage: Dispatch<SetStateAction<PriceType[]>>;
};

const ModelingOrderDetail = (props: Props) => {
  const { data: product, pricePackage, onUpdatePackage } = props;

  const router = useRouter();
  const [form] = Form.useForm();
  const [data, setData] = useState<ModelingOrderModel>(product);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const allowUpdate: boolean = data.status === ModelingStatus.QUOTE;
  const allowSendQuote: boolean = allowUpdate && Boolean(data.estimated_time);

  const onUpdatePackageProduct = (data: ModelingOrderModel) => {
    const products = form.getFieldValue('products').map((i: any) => {
      const { quote_price, price } = data.modeling_products.find((p) => p.id === i.id) ?? {};
      let price_id = undefined;
      if (quote_price) {
        if (quote_price.price === 0) price_id = quote_price.title;
        else price_id = `${quote_price.title} (${formatNumber(quote_price.price, '$')})`;
      } else price_id = i.price_id;
      return { ...i, price_id, price };
    });
    form.setFieldValue('products', products);
  };

  const onUpdateCategory = (data: ModelingOrderModel) => {
    onUpdatePackage((current) => {
      return current.map((i) => {
        const product = data.modeling_products.find((p) => p.quote_price.id === i.id);
        return { ...i, ...(product?.quote_price ?? {}) };
      });
    });
  };

  const onSaveQuote = (value: any) => {
    orderServices
      .quoteModelingOrder(data.id, {
        estimated_time: value.estimated_time.format(),
        list_product: value.products.map((i: { id: string; price_id: string; price: number }) => i),
      })
      .then(({ data }) => {
        setData(data);
        onUpdateCategory(data);
        message.success('Saved successfully');
      })
      .catch((error) => onCheckErrorApiMessage(error))
      .finally(() => setSubmitting(false));
  };

  const onSendQuote = () => {
    const confirm = Modal.confirm({
      title: 'Send quotes to customer',
      content: 'Once you submit your quote you will not be able to change the package and deadline',
      autoFocusButton: null,
      bodyStyle: { padding: '20px 16px' },
      onOk: async () =>
        await Promise.all([
          confirm.update({ cancelButtonProps: { disabled: true } }),
          orderServices.sendQuoteModelingOrder(data.id),
        ])
          .then(([_, { data }]) => {
            setData(data);
            onUpdatePackageProduct(data);
            message.success('Quotation sent successfully');
          })
          .catch((error) => onCheckErrorApiMessage(error)),
    });
  };

  const onSubmit = (value: any) => {
    try {
      setSubmitting(true);
      if (data.status === ModelingStatus.QUOTE) onSaveQuote(value);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/modeling-service/orders/all');
  };

  return (
    <div>
      <ModelingOrderInformation data={data} />
      <Form layout='vertical' form={form} onFinish={onSubmit} onFinishFailed={console.error}>
        <ModelingOrderEstimated status={data.status} time={data.estimated_time} />
        <Form.List
          name='products'
          initialValue={data.modeling_products.map((i) => {
            const image = i.image ? [{ url: i.image }] : undefined;
            const file_demo = i.file_demo ? [{ name: i.file_demo.split('/').at(-1) }] : undefined;
            const file_result = i.file_result
              ? [{ name: i.file_result.split('/').at(-1) }]
              : undefined;
            let price_id = undefined;
            if (i.quote_price) {
              const packageItem = pricePackage.find(({ id }) => i.quote_price.id === id);
              const isPackageChanged =
                !packageItem?.status ||
                packageItem.price !== i.quote_price.price ||
                packageItem.title !== i.quote_price.title;
              if (isPackageChanged) {
                price_id = `${i.quote_price.title}`;
                if (i.quote_price.price) price_id += ` (${formatNumber(i.quote_price.price, '$')})`;
              } else price_id = i.quote_price.id;
            }
            return { id: i.id, price_id, image, file_demo, file_result, price: i.price };
          })}>
          {(fields) => {
            return fields.map(({ key }) => (
              <ModelingOrderProduct
                key={key}
                fieldListName={key}
                orderID={data.id}
                orderStatus={data.status}
                data={data.modeling_products[key]}
                pricePackage={pricePackage}
                onUpdateOrder={setData}
              />
            ));
          }}
        </Form.List>
        <div className='group-btn-action-form group-btn-action-form-custom '>
          <hr className='w-100 mt-0' />
          <div className='w-100 d-flex justify-content-between'>
            <Button onClick={handleGoBack}>Close</Button>
            <Space>
              {allowUpdate && (
                <Button
                  type='primary'
                  ghost={allowSendQuote}
                  htmlType='submit'
                  loading={submitting}>
                  Save
                </Button>
              )}
              {allowSendQuote && (
                <Button type='primary' icon={<SendOutlined />} onClick={onSendQuote}>
                  Send Quote
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ModelingOrderDetail;
