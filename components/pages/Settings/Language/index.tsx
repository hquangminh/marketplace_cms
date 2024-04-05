import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { Button, PageHeader } from 'antd';

import settingsServices from 'services/settings-services';

import SettingLanguageList from './List';
import LanguageForm from './Form';

import { Language } from 'models/settings.model';

import { PageContent } from 'styles/__styles';

const Wrapper = styled.div`
  padding-top: 1px;
`;
const HeaderPage = styled(PageContent)`
  .ant-page-header {
    padding: 0;
  }
`;

interface LanguageAction {
  type?: 'add' | 'edit';
  language?: Language;
}

const SettingLanguage = () => {
  const [language, setLanguage] = useState<Language[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [action, setAction] = useState<LanguageAction>();

  useEffect(() => {
    fetchLanguage();
  }, []);

  const fetchLanguage = async () => {
    setLoading(true);
    await settingsServices.getLanguage().then((res) => setLanguage(res.data));
    setLoading(false);
  };

  const onUpdateList = (type: 'add' | 'edit', data: Language) => {
    if (type === 'add') {
      setLanguage((languageCurrent) =>
        languageCurrent
          ? [data].concat(
              languageCurrent.map((i) => ({
                ...i,
                is_default: data.is_default ? false : i.is_default,
              }))
            )
          : [data]
      );
    }
    if (type === 'edit') {
      if (language?.some((i) => i.id === data.id)) {
        setLanguage((languageCurrent) =>
          (languageCurrent || []).map((i) =>
            i.id === data.id ? data : { ...i, is_default: data.is_default ? false : i.is_default }
          )
        );
      }
    }
  };

  return (
    <Wrapper>
      <HeaderPage>
        <PageHeader
          title='Language'
          extra={
            <Button type='primary' onClick={() => setAction({ type: 'add' })}>
              Create
            </Button>
          }
        />
      </HeaderPage>

      <PageContent>
        <SettingLanguageList
          data={language}
          loading={loading}
          onDeleteSuccess={(id) => setLanguage((init) => init?.filter((i) => i.id !== id))}
          onClickEdit={(language) => setAction({ type: 'edit', language })}
        />
      </PageContent>

      <LanguageForm
        type={action?.type}
        data={action?.language}
        onClose={() => setAction(undefined)}
        onSuccess={onUpdateList}
      />
    </Wrapper>
  );
};

export default SettingLanguage;
