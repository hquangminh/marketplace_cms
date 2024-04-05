import { useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, Skeleton } from 'antd';
import { useRouter } from 'next/router';

import { handlerMessage, onCheckErrorApiMessage, onToastNoPermission } from 'common/functions';

import helpServices from 'services/help-services';

import Loading from 'components/fragments/Loading';
import FormItemTextEditor from 'components/fragments/FormItemTextEditor';

import { categoryListsType } from 'models/category.model';
import { DataHelpType, HelpCreateComponentProps } from 'models/help-model';

import styled from 'styled-components';

const HelpCreateComponent = (props: HelpCreateComponentProps) => {
  const { data, helpID, helpType, allowAction } = props;
  const router = useRouter();

  const [form] = Form.useForm();
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

  const [loadingCate, setLoadingCate] = useState<boolean>(true);

  const [category, setCategory] = useState<categoryListsType[] | []>([]);

  useEffect(() => {
    const onFetchCategory = async () => {
      setLoadingCate(true);
      try {
        const resp = await helpServices.getAllHelpCategory();
        if (resp && resp.data) {
          const newData = resp.data.filter((item: any) => item.status);

          setCategory(newData);
          setLoadingCate(false);
        } else {
          setLoadingCate(false);
          router.push('/help/category');
          handlerMessage('Please add a category first', 'error');
          return;
        }
      } catch (error) {
        setLoadingCate(false);
        handlerMessage('Category not found', 'error');
      }
    };

    onFetchCategory();
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      form.setFieldsValue({
        title: data.title,
        status: data.status,
        category_id: data.market_category_help?.status ? data.market_category_help?.id : undefined,
        sort_id: data.sort_id,
        content: data.content,
        isUpdate: true,
      });
    }
  }, [data]);

  const onCreateHelp = async (parm: DataHelpType) => {
    setLoadingCreate(true);
    try {
      await helpServices.createHelp(parm);

      handlerMessage('Create success', 'success');
      router.push('/help');
    } catch (error: any) {
      setLoadingCreate(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchUpdateHelp = async (parm: any) => {
    setLoadingCreate(true);
    try {
      const resp = await helpServices.updateHelp(helpID as string, parm);
      if (resp) {
        handlerMessage('Update success', 'success');
        router.push('/help');
      }
      setLoadingCreate(false);
    } catch (error: any) {
      setLoadingCreate(false);
      onCheckErrorApiMessage(error);
    }
  };

  // const onRemoveFile = (e: any, name: string) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   setFileList([]);
  //   form.setFieldsValue({ [name]: undefined });
  // };

  const onFinish = (values: any) => {
    const parm = {
      ...values,
    };

    if (form.getFieldValue('isUpdate')) {
      onFetchUpdateHelp(parm);
    } else {
      onCreateHelp(parm);
    }
  };

  return (
    <Form_wrapper>
      {loadingCreate && <Loading isOpacity />}
      <Form
        layout='vertical'
        form={form}
        initialValues={form}
        onFinish={onFinish}
        scrollToFirstError={{
          behavior: (actions) =>
            // list is sorted from innermost (closest parent to your target) to outermost (often the document.body or viewport)
            actions.forEach(({ el, top, left }) => {
              // implement the scroll anyway you want
              el.scrollTop = top - 80;
              el.scrollLeft = left;
            }),
        }}>
        {loadingCate ? (
          <Skeleton />
        ) : (
          <Row gutter={[10, 0]}>
            <Col span={24}>
              <Form.Item
                name='title'
                label='Title'
                rules={[
                  { required: true, message: 'Title is required' },
                  { whitespace: true, message: 'Title is not blank' },
                ]}>
                <Input placeholder='Input title' disabled={helpType === 'view'} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name='status' label='Status' initialValue={false} required>
                <Select
                  className='w-100'
                  style={{ width: 120 }}
                  value={props.data?.status}
                  options={[
                    { value: true, label: 'Active' },
                    { value: false, label: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='category_id'
                label='Category'
                rules={[{ required: true, message: 'Category is required' }, { type: 'string' }]}>
                <Select
                  placeholder='Select category'
                  className='w-100'
                  optionLabelProp='label'
                  loading={loadingCate}
                  disabled={loadingCate || helpType === 'view' || !category?.length}
                  options={category?.map((cate) => ({
                    value: cate.id,
                    label: cate.title,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <FormItemTextEditor
                name='content'
                label='Description'
                required
                rules={[
                  ({}) => ({
                    validator: (_, value) => {
                      if (!value) return Promise.reject('Description is required');

                      const trimmedValue = value.trim();
                      const isBlank = /^(&nbsp;|\s)*$/.test(trimmedValue);
                      if (isBlank) return Promise.reject('Description is not blank');

                      return Promise.resolve();
                    },
                  }),
                ]}
                disabled={helpType === 'view'}
              />
            </Col>

            <Col span={24}>
              <Form.Item name='sort_id' label='Sort ID'>
                <InputNumber
                  className='w-100'
                  placeholder='Input sort id'
                  min={0}
                  disabled={helpType === 'view'}
                />
              </Form.Item>
            </Col>

            {/* <Col span={24}>
              <Form.Item
                name='image'
                label='Image'
                className='ant-upload_my-custom'
                getValueFromEvent={(e) =>
                  fromEventNormFile({
                    file: e.target.files[0],
                    name: 'image',
                    form,
                    setFileList,
                    ruleSize: 2,
                    isUpdate: form.getFieldValue('isUpdate'),
                  })
                }>
                <span id='image'>
                  <Upload
                    showUploadList={false}
                    listType='picture-card'
                    maxCount={1}
                    disabled={helpType === 'view'}
                    accept={validationUploadFile.image.toString()}>
                    {fileList[0]?.image ? (
                      <div
                        className={`image_wrapper position-relative ${
                          helpType === 'view' ? 'disable__event' : ''
                        }`}>
                        <img src={fileList[0]?.image} className='w-100 h-100' alt='' />
                        <Button className='btn-delete' onClick={(e) => onRemoveFile(e, 'image')}>
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
                </span>
              </Form.Item>
            </Col> */}

            <Col span={24}>
              <hr />
            </Col>

            <Col span={24} className='group-btn-action-form '>
              {helpType === 'view' && (
                <div className='text-right'>
                  <Button
                    type='primary'
                    onClick={
                      allowAction?.add
                        ? () => router.push(`/help/edit/${helpID}`)
                        : onToastNoPermission
                    }>
                    Edit
                  </Button>
                </div>
              )}

              {helpType === 'edit' && (
                <div className='text-right'>
                  <Button type='primary' htmlType='submit'>
                    Update
                  </Button>
                </div>
              )}

              {helpType === 'create' && (
                <div className='text-right'>
                  <Button type='primary' htmlType='submit'>
                    Submit
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        )}
      </Form>
    </Form_wrapper>
  );
};

const Form_wrapper = styled.div`
  position: relative;
`;

export default HelpCreateComponent;
