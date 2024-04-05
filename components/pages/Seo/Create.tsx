import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Col, Form, Input, message, Row, Select, Space, Tabs, Upload } from 'antd';

import { RcFile } from 'antd/es/upload';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { imageSupported } from 'common/constant';
import getBase64 from 'common/functions/getBase64';
import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import seoServices from 'services/seo-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import Loading from 'components/fragments/Loading';

import { Language } from 'models/settings.model';
import { typeImg } from 'models/category.model';
import { SeoModel } from 'models/seo.models';

import { PageContent, PageContent_Title } from 'styles/__styles';
import styled from 'styled-components';

const SeoForm__Wrapper = styled.div``;
const InformationCommon = styled(PageContent)``;
const ContentByLanguage = styled(PageContent)`
  .ant-upload.ant-upload-select-picture-card,
  .ant-upload-list-picture-card-container {
    margin-bottom: 0;
  }
`;
const TabLanguageItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const ButtonFooter = styled(PageContent)`
  position: sticky;
  bottom: 0;
  text-align: right;
`;

interface Props {
  language: Language[];
  data?: SeoModel;
}

export default function SeoFormCreate({ language, data }: Props) {
  const router = useRouter();
  const [form] = Form.useForm();

  const [tabLanguageActive, setTabLanguageActive] = useState<string>();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileLists, setFileLists] = useState<{ [key: string]: typeImg[] }>({});
  const [tabLanguageRequired, setTabLanguageRequired] = useState<string[]>([]);

  const languageDefault = language[0];

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      let newFileLists = {};
      let requiredLists: string[] = [];
      data.market_seo_languages.forEach((m) => {
        const fieldName = `image-${m.language_id}`;

        newFileLists = {
          ...newFileLists,
          [fieldName]: [
            {
              image: m.image,
              filename: m.image.split('/').slice(-1)[0],
            },
          ],
        };

        requiredLists.push(m.language_id);

        form.setFieldsValue({ [fieldName]: [{ image: '' }] });
      });
      setTabLanguageRequired(requiredLists);
      setFileLists(newFileLists);
    }
  }, [data]);

  const onSubmit = async (values: Record<string, any>) => {
    try {
      setSubmitting(true);

      let body: { page: string; list_seo: Record<string, string | boolean>[] } = {
        page: values['page'],
        list_seo: [],
      };

      for (const lang of language) {
        const dataByLanguageInit = data?.market_seo_languages.find(
          (i) => i.market_language.id === lang.id
        );

        let dataByLanguage: Record<string, string | boolean> = {};
        if (values['title-' + lang.id]) dataByLanguage['title'] = values['title-' + lang.id];
        if (values['descriptions-' + lang.id])
          dataByLanguage['descriptions'] = values['descriptions-' + lang.id];
        if (values['keywords-' + lang.id] && values['keywords-' + lang.id].length)
          dataByLanguage['keywords'] = values['keywords-' + lang.id].join(', ');
        if (fileLists['image-' + lang.id]?.length) {
          dataByLanguage['image'] = fileLists['image-' + lang.id][0].image || '';
          dataByLanguage['filetype'] = fileLists['image-' + lang.id][0].filetype || '';
          dataByLanguage['filename'] = fileLists['image-' + lang.id][0]?.filename || '';
        }
        if (dataByLanguageInit && dataByLanguage['image'] !== dataByLanguageInit.image)
          if (dataByLanguage['image']) dataByLanguage['oldImage'] = dataByLanguageInit.image;

        if (Object.keys(dataByLanguage).length > 0) {
          if (dataByLanguageInit) dataByLanguage['id'] = dataByLanguageInit.id;
          else dataByLanguage['language_id'] = lang.id;
          body['list_seo'].push(dataByLanguage);
        } else if (dataByLanguageInit) {
          dataByLanguage['id'] = dataByLanguageInit.id;
          dataByLanguage['is_delete'] = true;
          body['list_seo'].push(dataByLanguage);
        }
      }

      if (data)
        await seoServices
          .updateSeo(data.id, body)
          .then(() => router.push('/seo'))
          .catch((error: any) => {
            setSubmitting(false);
            onCheckErrorApiMessage(error);
          });
      else
        await seoServices
          .createSeo(body)
          .then(() => router.push('/seo'))
          .catch((error: any) => {
            setSubmitting(false);
            onCheckErrorApiMessage(error);
          });
    } catch (error: any) {
      typeof error.data?.message === 'string' && message.error(error.data?.message);
      setSubmitting(false);
    }
  };

  const onSubmitFailed = (errorInfo: any) => {
    // Go to the first tab language required
    for (const language of [languageDefault.id, ...tabLanguageRequired]) {
      const fieldValidateNotFill = errorInfo.errorFields.some((i: any) =>
        i.name[0].includes('-' + language)
      );

      if (fieldValidateNotFill) {
        if (tabLanguageActive !== language) setTabLanguageActive(language);
        break;
      }
    }
  };

  const onFieldsChange = async (changedFields: any, allFields: any) => {
    if (!isArrayEmpty(changedFields)) {
      // Upload image
      const fieldName = changedFields[0].name?.toString();
      if (fieldName.startsWith('image')) {
        const value = changedFields[0].value[0];

        const image = await getBase64(value.originFileObj);
        setFileLists((prev) => ({
          ...prev,
          [fieldName]: [
            {
              image,
              filename: value.name,
              filetype: value.type,
            },
          ],
        }));
      }

      // Checking the language tabs is required when the user enters any field
      const languagesRequired = language.filter((i) =>
        allFields.some((f: any) => f.name[0].includes(i.id) && f.value)
      );
      setTabLanguageRequired(languagesRequired.map((i) => i.id));
    }
  };

  const onRemoveFile = (e: any, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();

    setFileLists((prev) => {
      const copy = { ...prev };

      delete copy[fieldName];

      return copy;
    });
    form.setFieldsValue({ [fieldName]: undefined });
  };

  return (
    <SeoForm__Wrapper>
      {submitting && <Loading fullPage isOpacity />}

      <HeaderPageFragment
        title={(data ? 'Edit' : 'Create') + ' Seo'}
        breadcrumb={[{ title: 'Seo', path: '/seo' }, { title: data ? 'Edit' : 'Create' }]}
      />

      <Form
        layout='vertical'
        onFinish={onSubmit}
        onFinishFailed={onSubmitFailed}
        form={form}
        onFieldsChange={onFieldsChange}>
        <InformationCommon>
          <PageContent_Title>General Information</PageContent_Title>
          <Row>
            <Col span={24} xl={14}>
              <Form.Item
                name='page'
                label='Page'
                rules={[
                  { required: true, message: 'Page is required' },
                  { whitespace: true, message: 'Page cannot be empty' },
                  {
                    pattern: /^[a-z0-9\-]*$/i,
                    message: 'The value you entered is not in the supported format',
                  },
                ]}
                initialValue={data?.page}>
                <Input placeholder='homepage, blog-popular, product-best-seller, ...' />
              </Form.Item>
            </Col>
          </Row>
        </InformationCommon>

        <ContentByLanguage>
          <PageContent_Title>Language</PageContent_Title>
          <Tabs
            type='card'
            activeKey={tabLanguageActive}
            items={language?.map((i) => ({
              key: i.id,
              forceRender: true,
              label: (
                <TabLanguageItem>
                  {i.language_name} <img width='22' src={i.image} alt='' />
                </TabLanguageItem>
              ),
              children: (
                <FormByLanguage
                  languageId={i.id}
                  isRequired={i.is_default || tabLanguageRequired.includes(i.id)}
                  data={data?.market_seo_languages.find((s) => s.market_language.id === i.id)}
                  fileLists={fileLists}
                  onRemoveFile={onRemoveFile}
                />
              ),
            }))}
            onChange={setTabLanguageActive}
          />
        </ContentByLanguage>

        <ButtonFooter>
          <hr />
          <Space align='end'>
            <Button disabled={submitting} onClick={() => router.push('/seo')}>
              Close
            </Button>
            <Button type='primary' htmlType='submit' loading={submitting}>
              Save
            </Button>
          </Space>
        </ButtonFooter>
      </Form>
    </SeoForm__Wrapper>
  );
}

interface FormByLanguageProps {
  languageId: string;
  isRequired: boolean;
  data?: SeoModel;
  fileLists: { [key: string]: typeImg[] };
  // eslint-disable-next-line no-unused-vars
  onRemoveFile: (e: any, filedName: string) => void;
}
const FormByLanguage = ({
  languageId,
  data,
  isRequired,
  fileLists,
  onRemoveFile,
}: FormByLanguageProps) => {
  const normFile = (e: any) => {
    let fileList;
    if (Array.isArray(e)) fileList = e;
    else fileList = e?.fileList;

    return fileList;
  };

  const beforeUpload = (file: RcFile) => {
    const isSupportedType = imageSupported.includes(
      file.name.split('.').slice(-1)[0].toLowerCase()
    );
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isSupportedType || !isLt2M)
      handlerMessage('Image must be JPG, WEBP, PNG, JPEG and less than 2MB', 'error');

    return isSupportedType && isLt2M ? false : Upload.LIST_IGNORE;
  };

  const fieldKeyImage: string = `image-${languageId}`;
  const srcImage = fileLists[fieldKeyImage] ? fileLists[fieldKeyImage][0].image : '';

  return (
    <Row>
      <Col span={24} xl={14}>
        <Form.Item
          name={'image-' + languageId}
          label='Thumbnail'
          rules={[{ required: isRequired, message: 'Thumbnail is required' }]}
          valuePropName='fileList'
          className='ant-upload_my-custom'
          getValueFromEvent={normFile}>
          <Upload
            listType='picture-card'
            maxCount={1}
            accept={imageSupported.map((i) => '.' + i).join(',')}
            showUploadList={false}
            beforeUpload={beforeUpload}>
            {srcImage ? (
              <div className='image_wrapper w-100 h-100 d-flex align-items-center position-relative'>
                <img src={srcImage} className='w-100 h-100' alt='' />
                <Button className='btn-delete' onClick={(e: any) => onRemoveFile(e, fieldKeyImage)}>
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
      <Col span={24} xl={14}>
        <Form.Item
          name={'title-' + languageId}
          label='Title'
          rules={[
            { required: isRequired, message: 'Title is required' },
            { whitespace: true, message: 'Title cannot be empty' },
          ]}
          initialValue={data?.title}>
          <Input />
        </Form.Item>
      </Col>

      <Col span={24} xl={14}>
        <Form.Item
          name={'descriptions-' + languageId}
          label='Description'
          rules={[
            { required: isRequired, message: 'Description is required' },
            { whitespace: true, message: 'Description cannot be empty' },
          ]}
          initialValue={data?.descriptions}>
          <Input.TextArea autoSize={{ minRows: 5 }} />
        </Form.Item>
      </Col>

      <Col span={24} xl={14}>
        <Form.Item
          name={'keywords-' + languageId}
          label='Keywords'
          initialValue={data?.keywords?.split(', ')}>
          <Select
            mode='tags'
            style={{ width: '100%' }}
            open={false}
            placeholder='Please press enter to add keywords'
          />
        </Form.Item>
      </Col>
    </Row>
  );
};
