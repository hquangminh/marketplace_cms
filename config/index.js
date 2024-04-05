import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { DEPLOY_ENV } = publicRuntimeConfig;

var configs;

if (DEPLOY_ENV === 'prod') {
  configs = {
    apiServer: 'https://api.vrstyler.com',
    urlWeb: 'https://vrstyler.com',
    urlModelViewer: 'https://modelviewer.vrstyler.com',
  };
} else if (DEPLOY_ENV === 'dev') {
  configs = {
    apiServer: 'https://market-api.tainguyenviet.com',
    urlWeb: 'https://vrstyler.tainguyenviet.com',
    urlModelViewer: 'https://modelviewer.tainguyenviet.com',
  };
} else {
  configs = {
    apiServer: 'https://market-api.tainguyenviet.com',
    urlWeb: 'http://localhost:3008',
    urlModelViewer: 'https://modelviewer.tainguyenviet.com',
  };
}

const config = Object.assign(configs);

export default config;
