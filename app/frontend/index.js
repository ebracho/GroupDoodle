'use strict';

import React from 'react';
import {render} from 'react-dom';
import {browserHistory, Router, Route} from 'react-router';

const App = React.createClass({
  render() {
    return <h2>Hello World!</h2>;
  },
});

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
    </Route>
  </Router>
), document.getElementById('content'));
