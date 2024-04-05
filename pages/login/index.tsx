import React, { Fragment } from 'react';
import Head from 'next/head';

import SignIn from 'components/pages/Sign-in';

const Login = () => {
  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Sign-In</title>
      </Head>

      <SignIn />
    </Fragment>
  );
};

export default Login;
