import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import SettingLanguage from 'components/pages/Settings/Language';

const Index: React.FC = () => {
  return (
    <>
      <Head>
        <title>Market Place Admin - Language</title>
      </Head>

      <SettingLanguage />
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['settings'], selectedKey: 'settings-language' } })
);
