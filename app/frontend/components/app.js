'use strict';

import React from 'react';
import {render} from 'react-dom';
import {browserHistory, Router, Route, Link} from 'react-router';
import {logout, requireAuth, AuthForm} from './auth';
import {Dashboard} from './dashboard';
import {DoodleRoom} from './doodle-room';

/** Wrapper component for app, renders navbar. */
class App extends React.Component {
  /** @return {Element} */
  render() {
    return (
      <div>
        <h2>Hello from App!</h2>
        <ul>
          <li><Link to='/auth'>Login/Register</Link></li>
          <li><Link onClick={logout} to='/auth'>Logout</Link></li>
          <li><Link to='/dashboard'>Dashboard</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

/* Build and install router. */
render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <Route path='auth' component={AuthForm} />
      <Route path='dashboard' component={Dashboard} onEnter={requireAuth} />
      <Route path='room/:id' component={DoodleRoom} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('content'));
