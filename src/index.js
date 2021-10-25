import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import App from './App';

import mainReducer from './redux/reducer';

const store = createStore(mainReducer)

store.subscribe(() => console.log(store.getState()));
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
