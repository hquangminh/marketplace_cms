import React, { Fragment, useState } from 'react';
import Head from 'next/head';

import { Button } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import VRStylerAccountList from 'components/pages/VRStylerAccounts/List';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);

  const BtnAdd = (
    <Button type='primary' icon={<UsergroupAddOutlined />} onClick={() => setOpenCreateForm(true)}>
      Create
    </Button>
  );

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - VRStyler Accounts</title>
      </Head>

      <HeaderPageFragment title='VRStyler Accounts' btnAdd={BtnAdd} />
      <PageContent>
        <VRStylerAccountList
          openCreateForm={openCreateForm}
          onCloseCreateForm={() => setOpenCreateForm(false)}
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { selectedKey: 'vrstyler_accounts' } }));
