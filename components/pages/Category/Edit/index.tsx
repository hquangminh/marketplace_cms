import React, { memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Form, Input, Button, Select, Row, Col, Upload, InputNumber } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

import {
  fromEventNormFile,
  handlerMessage,
  onCheckErrorApiMessage,
  onToastNoPermission,
} from 'common/functions';
import { regex, validationUploadFile } from 'common/constant';

import categoryServices from 'services/category-services';
import blogServices from 'services/blog-services';
import helpServices from 'services/help-services';

import Loading from 'components/fragments/Loading';

import { categoryEditType } from 'models/category.model';

import * as CT from './style';

const CategoryEdit = (props: categoryEditType) => {
  const {
    allowAction,
    dataTable,
    initialValueTree,
    setDataTable,
    setActiveMenu,
    fileList,
    setFileList,
    onResetForm,
    categoryLists,
    setCategory,
    page,
    setId,
    setFilterDataTree,
  } = props;

  const [form] = Form.useForm();
  const router = useRouter();

  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue(dataTable[0]);
    if (!dataTable[0]?.isUpdate) {
      form.setFieldsValue({ icon: undefined });
    }
  }, [form, dataTable]);

  const onFetchCreateCategory = async (parm: any) => {
    setLoadingUpdate(true);

    try {
      let data: any = null;
      if (page === 'category-blog') {
        data = await blogServices.createCategoryBlog(parm);
      } else if (page === 'help-category') {
        data = await helpServices.createHelpCategory(parm);
      } else {
        data = await categoryServices.createCategoryList(parm);
      }

      if (!data.error) {
        setCategory([...categoryLists, data.data]);
        setLoadingUpdate(false);
        onResetForm();
        handlerMessage('Create success', 'success');
      }
      // setExpandedKeys([parm.parentid || '']);
    } catch (error: any) {
      setLoadingUpdate(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchUpdateCategory = async (id: string, parm: any) => {
    setLoadingUpdate(true);

    try {
      let data: any = null;
      if (page === 'category-blog') {
        data = await blogServices.updateCategoryBlog(id, parm);
      } else if (page === 'help-category') {
        data = await helpServices.updateHelpCategory(id, parm);
      } else {
        data = await categoryServices.updateCategory(id, parm);
        setFileList((prevState: any) => [{ ...prevState[0], image: data.data.icon }]);
      }
      setFilterDataTree((prev: any) => {
        const updatedDataTree = [...prev];
        const index = updatedDataTree.findIndex((category) => category.id === data.data.id);
        if (index !== -1) {
          updatedDataTree[index] = {
            ...updatedDataTree[index],
            ...data.data,
          };
        } else {
          updatedDataTree.push(data.data);
        }

        return updatedDataTree;
      });
      const newData = categoryLists.map((item: any) => (item.id === id ? data.data : item));
      setLoadingUpdate(false);
      setCategory(newData);
      handlerMessage('Update success', 'success');
    } catch (error: any) {
      setLoadingUpdate(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFinish = (value: any) => {
    let parm: any = {};
    if (page === 'category-blog') {
      parm = {
        title: value.title,
        orderid: value.orderid,
        status: value.status,
      };
    } else if (page === 'help-category') {
      parm = {
        filename: fileList[0]?.filename || '',
        title: value.title || '',
        description: value.description,
        orderid: value.orderid,
        status: value.status,
        icon: fileList[0]?.image,
        filetype: fileList[0]?.filetype || '',
      };
    } else {
      parm = {
        filename: fileList[0]?.filename || '',
        title: value.title || '',
        description: value.description,
        orderid: value.orderid,
        status: value.status,
        icon: fileList[0]?.image,
        // parentid: dataTable[0]?.parentid || '',
        filetype: fileList[0]?.filetype || '',
      };
    }

    delete parm['parentid'];

    if (dataTable[0].isUpdate) {
      onFetchUpdateCategory(dataTable[0].id || '', parm);
    } else {
      onFetchCreateCategory(parm);
    }
  };

  const onCancel = useCallback(() => {
    setDataTable([{ ...initialValueTree }]);
    setActiveMenu([]);
    // setDefaultFileList([]);
    setId('');
    setFileList([]);
  }, [initialValueTree, setDataTable]);

  const onRemoveFile = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (dataTable[0]?.isUpdate) {
      setFileList([{}]);
    }
    form.setFieldsValue({ icon: undefined });

    setFileList([]);
  };

  return (
    <CT.styleInput>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={form}
        className={!dataTable[0].isShow ? 'isHidden' : 'isShow'}>
        {loadingUpdate && <Loading isOpacity />}
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name='title'
              label='Title'
              rules={[
                { required: true, message: 'Title is required' },
                { whitespace: true, message: 'Title cannot be empty' },
                {
                  validator: (_, value) =>
                    regex.emoji.test(value.replace(/\s+/g, ''))
                      ? Promise.reject(new Error('Do not use only emoji'))
                      : Promise.resolve(),
                },
              ]}>
              <Input placeholder='Enter Title' />
            </Form.Item>
          </Col>

          {page === 'category-blog' || page === 'help-category' ? null : (
            <Col span={24}>
              <Form.Item name='description' label='Description'>
                <Input.TextArea autoSize={{ minRows: 5 }} />
              </Form.Item>
            </Col>
          )}

          {page === 'help-category' && (
            <Col span={24}>
              <Form.Item name='description' label='Description'>
                <Input placeholder='' />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item
              name='status'
              label='Status'
              // className={!allowAction?.add ? 'isHidden' : 'isShow'}
            >
              <Select placeholder='Select Status'>
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name='orderid' label='OrderId'>
              <InputNumber className='w-100' min={0} />
            </Form.Item>
          </Col>

          {router.pathname === '/help/category' || page === 'category-blog' ? null : (
            <Col span={24}>
              <Form.Item
                name='icon'
                label='Icon'
                className='ant-upload_my-custom'
                getValueFromEvent={(e) =>
                  fromEventNormFile({
                    file: e.target.files[0],
                    name: 'icon',
                    form,
                    setFileList,
                    ruleSize: 2,
                    isUpdate: dataTable[0]?.isUpdate as boolean,
                  })
                }
                rules={[
                  {
                    required: page === 'help-category' ? false : true,
                    message: 'Icon is required',
                  },
                ]}>
                <span id='icon'>
                  <Upload
                    listType='picture-card'
                    maxCount={1}
                    showUploadList={false}
                    accept={validationUploadFile.image.toString()}>
                    {fileList[0]?.image ? (
                      <div className='image_wrapper w-100 h-100 d-flex align-items-center position-relative'>
                        <img src={fileList[0].image} className='w-100 h-100' alt='' />
                        <Button className='btn-delete' onClick={(e) => onRemoveFile(e)}>
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
            </Col>
          )}

          <Col span={24} className='group-btn-action-form'>
            {dataTable[0]?.isShow && <hr className='w-100 mt-0' />}

            {dataTable[0]?.isShow && (
              <>
                <Button
                  type='primary'
                  htmlType={allowAction?.add ? 'submit' : undefined}
                  onClick={allowAction?.add ? undefined : onToastNoPermission}>
                  {dataTable[0].isUpdate ? 'Update' : 'Submit'}
                </Button>
                <Button onClick={onCancel} type='ghost'>
                  Cancel
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Form>
    </CT.styleInput>
  );
};

export default memo(CategoryEdit);
