# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install Project

In the project directory, you can run:

### `npm install`

You can see `node_modules` folder in the project directory after installed.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Tips

There is some tips that very useful during the programming.

### Environment variable

You can define environment variables under the `env` folder. There is two env-config files( `.development.env` and `.production.env` ) in the `env`.

#### How to use it

There's a sample below
```shell
# API prefix
REQUEST_API_PATH_PREFIX = 'http://localhost:3000/api/'
```

We can use `process.env.REQUEST_API_PATH_PREFIX` as the variable in our code snippets.

The variable will be compiled with `.development.env` file when you run `npm start`, and will be compiled with `.production.env` file when you run `npm run build`.

### Mock data

#### Why mock data

Check out the [Don’t Wait! Mock the API](https://css-tricks.com/dont-wait-mock-the-api/)

#### How to use

We use [Mockjs](https://github.com/nuysoft/Mock/wiki) to simulate request/response data.

There is a named `mock` folder to store the mock data. For instance, if `/api/client/list` as your real requested API path, you should create mock data file as follow:
```
.
├── compiler/
├── env/
├── mock # This is the mock folder where to store faked api data
│   ├── api
│   │   └── client
│   │       └── list.js
│   └── config.js
├── node_modules
│   ├── ...
│   │
│   ...
│
...
```
You can see the file `mock/api/client/list.js` as the simulated response data of the api `/api/client/list`. The same path start `mock/` folder.

The extensive of the mock file can be `js/json/jsonc`.
What is the `.jsonc`, learn more in the [JSON with Comments](https://code.visualstudio.com/docs/languages/json#_json-with-comments) and [jsonc](https://komkom.github.io/).

The rule of mock data, please check out [Mockjs syntax specification](https://github.com/nuysoft/Mock/wiki/Syntax-Specification).

### I18n

#### Why I18n

Check out the [What is I18n](http://www.i18nguy.com/origini18n.html#:~:text=%22I18n%22%20is%20an%20abbreviation%20for,plus%20the%20letter%20%22n%22.&text=Examples%20include%20%22K9%22%20for%20canine,sept%22%20for%20the%20word%20cassette.)

#### How to use

We use [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/) as the tech base.

You could see folders as below
```
.
├── compiler/
├── env/
├── mock/
├── node_modules/
├── public
│   ├── locales # i18n folder
│   │   └── en
│   │   │   └── translation.json
│   │   └── zh
│   │       └── translation.json
│   ...
├── ...
│
...
```
`translation.json` is a i18n map(key-value) config file. The key is a variable and the value correspondings a displayed text. One key must be the same in all of language config files.

In the code, we need 2 steps to display i18n text.
1. The `Prop` must extend `WithTranslation`, a sample as below:
```typescript
interface ISampleProps extends WithTranslation {}
```
2. We have to use `withTranslation` function to wrap the class, a sample as below:
```typescript
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface ISampleProps extends WithTranslation {}
interface ISampleState {}

class Sample extends React.Component<ISampleProps, ISampleState> {
    // do something...
}

export default withTranslation()(Sample);
```
More information could check out the [withTranslation (HOC)](https://react.i18next.com/latest/withtranslation-hoc)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn `React`, check out the [React documentation](https://reactjs.org/).

To learn `Typescript`, plz check here [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html).

We are using `Mockjs` to simulate the request/response data. [Mockjs document](https://github.com/nuysoft/Mock/wiki).

We use `Jsonc` as our configuration files, learn more in the [JSON with Comments](https://code.visualstudio.com/docs/languages/json#_json-with-comments) and [jsonc](https://komkom.github.io/)

We use [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/) as our internationalization(multi-language) tech base. You can click the text link to learn more about that.
