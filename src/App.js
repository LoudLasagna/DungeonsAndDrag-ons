/* eslint-disable camelcase */
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import DNDs1_Table from './DNDs1_Table';
import DNDs2_Table from './DNDs2_Table';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={DNDs1_Table} />
        <Route exact path="/2" component={DNDs2_Table} />
      </Switch>
    </Router>
  );
}

export default connect()(App);
