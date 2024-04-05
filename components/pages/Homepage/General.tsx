import { Dispatch, SetStateAction, useState } from 'react';

import axios from 'axios';
import { Button, Form, Input, message, Tabs, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadOutlined } from '@ant-design/icons';

import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import { regex } from 'common/constant';
import uploadFileServices from 'services/uploadFile-services';
import homepageServices from 'services/homepage-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';

import { Language } from 'models/settings.model';
import { HomepageListType } from 'models/homepage.model';

import { PageContent, PageContent_Title } from 'styles/__styles';
import styled from 'styled-components';

const Wrapper = styled.div``;
const InformationCommon = styled(PageContent)`
  .ant-upload-list-item {
    width: fit-content;
    min-width: 152px;
  }
`;
const ContentByLanguage = styled(PageContent)``;
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
  dataHomePage?: HomepageListType;
  onUpdateHomePage: Dispatch<SetStateAction<HomepageListType | undefined>>;
}

export default function HomepageComponent(props: Readonly<Props>) {
  const { language, dataHomePage, onUpdateHomePage } = props;

  const [form] = Form.useForm();
  const [tabLanguageActive, setTabLanguageActive] = useState<string>(language[0].language_code);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = async (values: Record<string, any>) => {
    try {
      setSubmitting(true);

      let body: any = { arvr_video: values['arvr_video'] as string, list_banner: [] };

      for (const lang of language) {
        const dataByLanguageInit = dataHomePage?.market_homepage_languages.find(
          (i) => i.market_language.language_code === lang.language_code
        );

        let dataByLanguage: Record<string, string | boolean> = {};
        if (values['title-' + lang.id]) dataByLanguage['title'] = values['title-' + lang.id];
        if (values['caption-' + lang.id]) dataByLanguage['caption'] = values['caption-' + lang.id];
        if (dataByLanguageInit) dataByLanguage['id'] = dataByLanguageInit.id;
        dataByLanguage['language_id'] = lang.id;

        body['list_banner'].push(dataByLanguage);
      }

      if (!values.model[0].url) {
        delete body['model'];
        const { upload, download } = await uploadFileServices.uploadFilePresigned({
          filename: values.model[0].name.replace(/\s+/g, '-'),
          kind: 'public',
        });

        await axios
          .put(upload, values.model[0].originFileObj, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 1000 * 9999999999,
            transformRequest: (data, headers: any) => {
              delete headers.common['Authorization'];
              return data;
            },
          })
          .then(async () => {
            body['model'] = download;
            if (dataHomePage?.model) body['oldModel'] = dataHomePage.model;
          });
      } else body['model'] = values.model[0].url;

      await homepageServices.updateHomepage(body).then((res) => {
        onUpdateHomePage(res.data);
        if (res.data.model !== dataHomePage?.model)
          form.setFieldsValue({
            model: [{ name: res.data.model.split('/').slice(-1), url: res.data.model }],
          });
      });
      setSubmitting(false);
      handlerMessage('Save', 'success');
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setSubmitting(false);
    }
  };

  const onSubmitFailed = (errorInfo: any) => {
    const listField = Object.keys(errorInfo.values);
    const languageNotFill = language.find((lang) =>
      listField.some((i) => i.includes(lang.id) && !errorInfo.values[i])
    );
    if (languageNotFill && tabLanguageActive !== languageNotFill.language_code)
      setTabLanguageActive(languageNotFill.language_code);
  };

  return (
    <Wrapper>
      <HeaderPageFragment title='HomePage - General Information' />

      <Form form={form} layout='vertical' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
        <InformationCommon>
          <PageContent_Title>General Information</PageContent_Title>
          <Form.Item
            name='model'
            label='Banner model 3D (.glb)'
            rules={[{ required: true, message: 'Banner model 3D is required' }]}
            valuePropName='fileList'
            getValueFromEvent={normFile}
            initialValue={
              dataHomePage?.model
                ? [{ name: dataHomePage.model.split('/').slice(-1), url: dataHomePage.model }]
                : undefined
            }>
            <Upload maxCount={1} accept='.glb' beforeUpload={beforeUpload}>
              <Button className='d-flex align-items-center' icon={<UploadOutlined />}>
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name='arvr_video'
            label='AR/VR video'
            rules={[
              { required: true, message: 'AR/VR video is required' },
              { pattern: regex.url, message: 'AR/VR video is not a valid url' },
            ]}
            initialValue={dataHomePage?.arvr_video}>
            <Input />
          </Form.Item>
        </InformationCommon>

        <ContentByLanguage>
          <PageContent_Title>Language</PageContent_Title>
          <Tabs
            type='card'
            activeKey={tabLanguageActive}
            items={language?.map((lang) => ({
              key: lang.language_code,
              forceRender: true,
              label: (
                <TabLanguageItem>
                  {lang.language_name} <img width='22' src={lang.image} alt='' />
                </TabLanguageItem>
              ),
              children: (
                <FormByLanguage
                  languageId={lang.id}
                  data={dataHomePage?.market_homepage_languages.find(
                    (i) => i.market_language.language_code === lang.language_code
                  )}
                />
              ),
            }))}
            onChange={setTabLanguageActive}
          />
        </ContentByLanguage>

        <ButtonFooter>
          <hr />
          <Button type='primary' htmlType='submit' loading={submitting}>
            Save
          </Button>
        </ButtonFooter>
      </Form>
    </Wrapper>
  );
}

interface FormByLanguageProps {
  languageId: string;
  data?: Record<string, any>;
}
const FormByLanguage = ({ languageId, data }: FormByLanguageProps) => {
  return (
    <>
      <Form.Item
        name={'title-' + languageId}
        label='Banner title'
        rules={[
          { required: true, message: 'Title is required' },
          { whitespace: true, message: 'Title cannot be empty' },
        ]}
        initialValue={data?.title}>
        <Input />
      </Form.Item>

      <Form.Item
        name={'caption-' + languageId}
        label='Banner caption'
        rules={[
          { required: true, message: 'Caption is required' },
          { whitespace: true, message: 'Caption cannot be empty' },
        ]}
        initialValue={data?.caption}>
        <Input.TextArea autoSize={{ minRows: 5 }} />
      </Form.Item>
    </>
  );
};

const normFile = (e: any) => {
  let fileList;
  if (Array.isArray(e)) fileList = e;
  else fileList = e?.fileList;

  return fileList;
};

const beforeUpload = (file: RcFile) => {
  const isSupportedType = file.name.split('.').slice(-1)[0].toLowerCase() === 'glb';
  if (!isSupportedType) message.error('This model format is not supported!');

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) message.error('Model must smaller than 5MB!');

  return isSupportedType && isLt5M ? false : Upload.LIST_IGNORE;
};
