import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from 'redux/store';

import 'styles/lib/reset.min.css';

import 'antd/dist/antd.css';
import 'styles/variables.less';

import 'styles/lib/bootstrap.min.css';
import 'styles/styles.scss';

const HomePage = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default HomePage;
