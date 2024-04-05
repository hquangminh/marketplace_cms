import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { Button, Result } from 'antd';

import * as L from './style';

const Index: React.FC = () => (
  <>
    <Head>
      <title>403 - Forbidden</title>
    </Head>

    <L.customResult className='page__result'>
      <Result
        icon={<img src='/static/images/page-403-forbidden.svg' alt='' />}
        subTitle={<p className='caption'>Sorry, you are not authorized to access this page.</p>}
        extra={
          <Button type='primary' size='large'>
            <Link href={'/'}>Go to Dashboard</Link>
          </Button>
        }
      />
    </L.customResult>
  </>
);

export default Index;
