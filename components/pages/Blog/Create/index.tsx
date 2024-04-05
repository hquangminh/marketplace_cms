import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Form, Space, Spin, Tabs } from 'antd';
import { NamePath } from 'antd/lib/form/interface';

import ErrorCode from 'api/error-code';
import settingsServices from 'services/settings-services';
import blogServices from 'services/blog-services';
import { changeToSlug, handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import getBase64 from 'common/functions/getBase64';
import isArrayEmpty from 'common/functions/isArrayEmpty';

import TabLanguageItem from 'components/fragments/TabLanguageItem';
import Loading from 'components/fragments/Loading';
import BlogCreateGeneral from './FormGeneral';
import BlogCreateFormLanguage from './FormByLanguage';

import { Language } from 'models/settings.model';
import { BlogCategory, BlogData } from 'models/blog.modes';
import { typeImg } from 'models/category.model';

import { PageContent, PageContent_Title } from 'styles/__styles';

type Props = { data?: BlogData; loading?: boolean };

export default function BlogCreateComponent({ data, loading }: Props) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isRequired, setRequired] = useState<boolean>(false);
  const [submitting, setSubmit] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language[]>([]);
  const [category, setCategory] = useState<BlogCategory[]>([]);
  const [tabLanguageActive, setTabLanguageActive] = useState<string>();
  const [tabLanguageRequired, setTabLanguageRequired] = useState<string[]>([]);
  const [fileLists, setFileLists] = useState<{ [key: string]: typeImg[] }>({});

  const languageDefault = language[0];
  const isPublish = Form.useWatch('is_publish', form);

  useEffect(() => {
    if (data?.is_publish !== undefined) {
      setRequired(data.is_publish);
    }
  }, [data?.is_publish]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const dataImage: { [key: string]: typeImg[] } = {};

      if (data.image) {
        dataImage.image = [
          {
            image: data.image,
            filename: data.image.split('/').slice(-1)[0],
          },
        ];
        form.setFieldsValue({
          image: [{ image: '' }],
        });
      }

      if (data.banner) {
        dataImage.banner = [
          {
            image: data.banner,
            filename: data.banner.split('/').slice(-1)[0],
          },
        ];

        form.setFieldsValue({
          banner: [{ image: '' }],
        });
      }
      setFileLists(dataImage);
    }
  }, [data]);

  useEffect(() => {
    fetchDataCommon();
  }, []);

  const fetchDataCommon = async () => {
    await settingsServices.getLanguage().then((res) => {
      const languageDefault = res.data.find((i: Language) => i.is_default);
      const languageOther = res.data.filter((i: Language) => !i.is_default && i.status);
      setLanguage([languageDefault].concat(languageOther));
      setTabLanguageActive(languageDefault.id);
    });

    await blogServices
      .getCategoryBlog()
      .then(({ data }) => setCategory(data?.filter((i: BlogCategory) => i.status) || []))
      .catch((error: any) => {
        handlerMessage(ErrorCode[error.data?.error_code], 'error');
      });
  };

  useEffect(() => {
    if (isPublish === false) form.validateFields(form.getFieldsError().map((i) => i.name[0]));
  }, [isPublish]);

  const onSubmit = async (values: any) => {
    try {
      setSubmit(true);

      const { name, slug, category_id, is_publish = false } = values;
      let body: any = { name, slug, category_id, is_publish, list_blog: [] };

      if (
        fileLists['image'] &&
        fileLists['image'].length > 0 &&
        !fileLists['image'][0].image?.startsWith('http')
      ) {
        body['image'] = fileLists['image'][0].image;
        body['filetype'] = fileLists['image'][0].filetype;
        body['filename'] = fileLists['image'][0].filename?.replace(/\s+/g, '_');
      }

      if (
        fileLists['banner'] &&
        fileLists['banner'].length > 0 &&
        !fileLists['banner'][0].image?.startsWith('http')
      ) {
        body['banner'] = fileLists['banner'][0].image;
        body['bannerFiletype'] = fileLists['banner'][0].filetype;
        body['bannerFileName'] = fileLists['banner'][0].filename?.replace(/\s+/g, '_');
      }

      const productsForm = values['products'];
      if (productsForm && !isArrayEmpty(productsForm))
        if (productsForm.length > 1)
          body['items'] = productsForm.map((i: string) => ({ item_id: i }));
        else body['items'] = [{ item_id: productsForm[0] }];

      for (const lang of language) {
        const dataByLanguageInit = data?.market_blog_languages.find(
          (i) => i.market_language.id === lang.id
        );

        let dataByLanguage: Record<string, string | boolean> = {};
        if (values['title-' + lang.id]) dataByLanguage['title'] = values['title-' + lang.id];
        if (values['sumary-' + lang.id]) dataByLanguage['sumary'] = values['sumary-' + lang.id];
        if (values['content-' + lang.id]) dataByLanguage['content'] = values['content-' + lang.id];
        if (values['hashtag-' + lang.id]) dataByLanguage['hashtag'] = values['hashtag-' + lang.id];
        if (values['seo_description-' + lang.id])
          dataByLanguage['seo_description'] = values['seo_description-' + lang.id];
        if (values['seo_title-' + lang.id])
          dataByLanguage['seo_title'] = values['seo_title-' + lang.id];

        if (Object.keys(dataByLanguage).length > 0) {
          if (dataByLanguageInit) dataByLanguage['id'] = dataByLanguageInit.id;
          else dataByLanguage['language_id'] = lang.id;
          body['list_blog'].push(dataByLanguage);
        } else if (dataByLanguageInit) {
          dataByLanguage['id'] = dataByLanguageInit.id;
          dataByLanguage['is_delete'] = true;
          body['list_blog'].push(dataByLanguage);
        }
      }

      if (data) await blogServices.updateBlog(data.id, body);
      else await blogServices.createBlog(body);

      handlerMessage(data ? 'Successfully edited Blog' : 'Successfully created Blog', 'success');
      router.push('/blog');
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setSubmit(false);
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
      const changeField = changedFields[0];
      const changeFieldName = changeField.name[0];
      const changeFieldValue = changeField.value;

      // Upload image
      if (
        ['image', 'banner'].includes(changeFieldName) &&
        !(fileLists[changeFieldName] || [])[0]?.image?.startsWith('http')
      ) {
        const firstField = changedFields[0];

        if (firstField && firstField.value && firstField.value.length > 0) {
          const value = firstField.value[0];

          if (value) {
            const image = await getBase64(value.originFileObj);
            setFileLists((prev) => ({
              ...prev,
              [changeFieldName]: [
                {
                  image,
                  filename: value.name,
                  filetype: value.type,
                },
              ],
            }));
          }
        }
      }
      // Check required
      if (changeFieldName === 'is_publish' && changeFieldValue !== isRequired)
        setRequired(changeFieldValue);

      // Convert name to slug
      if (changeFieldName === 'slug' && changeFieldValue.trim()) {
        let slug = changeToSlug(changeFieldValue);
        if (changeFieldValue.slice(1).endsWith('-')) slug += '-';
        form.setFieldValue('slug', slug);
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

  const onChangeDescription = (name: NamePath, value: string) => {
    form.setFieldValue(name, value);
    if (form.getFieldError(name) && value) form.setFields([{ name, errors: [] }]);
  };

  if (loading)
    return (
      <div className='d-flex align-items-center justify-content-center' style={{ height: '90vh' }}>
        <Spin />
      </div>
    );

  return (
    <Form
      form={form}
      layout='vertical'
      onFieldsChange={onFieldsChange}
      onFinish={onSubmit}
      onFinishFailed={onSubmitFailed}>
      <BlogCreateGeneral
        category={category}
        data={data}
        isRequired={isRequired}
        onRemoveFile={onRemoveFile}
        fileLists={fileLists}
      />

      {submitting && <Loading fullPage isOpacity />}

      {!isArrayEmpty(language) && (
        <PageContent>
          <PageContent_Title>Language</PageContent_Title>
          <Tabs
            type='card'
            activeKey={tabLanguageActive}
            items={language?.map((i) => ({
              key: i.id,
              forceRender: true,
              label: <TabLanguageItem name={i.language_name} image={i.image} />,
              children: (
                <BlogCreateFormLanguage
                  languageId={i.id}
                  isRequired={isRequired && (i.is_default || tabLanguageRequired.includes(i.id))}
                  data={data?.market_blog_languages.find((l) => l.market_language.id === i.id)}
                  onChangeContent={onChangeDescription}
                />
              ),
            }))}
            onChange={setTabLanguageActive}
          />
        </PageContent>
      )}

      <Space className='group-btn-action-form group-btn-action-form-custom'>
        <Button type='primary' htmlType='submit' loading={submitting}>
          Submit
        </Button>
      </Space>
    </Form>
  );
}
