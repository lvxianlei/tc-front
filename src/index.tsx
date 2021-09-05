/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import './index.css';
import 'nprogress/nprogress.css';

import i18n from 'i18next';
import backend from 'i18next-http-backend';
import React from 'react';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';

import App from './App';
import reportWebVitals from './reportWebVitals';
import LangUtil, { Lang } from './utils/LangUtil';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import RequestUtil from './utils/RequestUtil';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
