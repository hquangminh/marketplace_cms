import Head from 'next/head';
import Link from 'next/link';

import { Button } from 'antd';

import styled from 'styled-components';

const Index = () => {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <Wrapper className='page__result'>
        <div className='image' />
        <h1 className='title'>SORRY, PAGE NOT FOUND</h1>
        <p className='caption'>
          The page you requested has disappeared or you have used the wrong url
        </p>
        <Button type='primary' size='large'>
          <Link href={'/'}>Go to Dashboard</Link>
        </Button>
      </Wrapper>
    </>
  );
};

export default Index;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  min-height: 100vh;
  padding: 0 20px 20px;

  .image {
    width: 100%;
    max-width: 540px;
    aspect-ratio: 5 / 4;

    background: url('/static/images/404page.gif') no-repeat;
    background-size: cover;
    background-position: center;
    image-rendering: -webkit-optimize-contrast;
  }
  .ant-btn {
    margin-top: 30px;
  }
`;
