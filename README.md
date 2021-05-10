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

Why we use mock data, check out the [Don’t Wait! Mock the API](https://css-tricks.com/dont-wait-mock-the-api/)

We use [Mockjs](https://github.com/nuysoft/Mock/wiki) to simulate request/response data.

There is a named `mock` folder to store the mock data. For instance, if `/api/client/list` as your real requested API path, you should create mock data file as follow:
```
.
├── compiler
├── env
│   └── .development.env
│   └── .production.env
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

The rule of mock data, please check out [Mockjs document](https://github.com/nuysoft/Mock/wiki).

### I18n



## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Typescript, plz check here [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html).

We are using Mockjs to simulate the request/response data. [Mockjs document](https://github.com/nuysoft/Mock/wiki).
