import React from 'react';
import './index.css';
import 'nprogress/nprogress.css';
import i18n from 'i18next';
import backend from 'i18next-http-backend';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import App from './App';
import LangUtil, { Lang } from './utils/LangUtil';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import './index.less'
const lang: Lang = LangUtil.getLang();

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    lng: lang,
    fallbackLng: lang,
    whitelist: [Lang.EN, Lang.ZH],
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false
    }
  });

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);
