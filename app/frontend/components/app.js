'use strict';

import 'jquery'; // Required for bootstrap to run
import 'bootstrap';
import React from 'react';
import {render} from 'react-dom';
import {browserHistory, Router, Route, Link} from 'react-router';
import {getSession, logout, requireAuth, AuthForm} from './auth';
import {Dashboard} from './dashboard';
import {DoodleRoom} from './doodle-room';
import {DoodleView} from './doodle-view';
import {DoodleReplay} from './doodle-replay';

/** Wrapper component for app, renders navbar. */
class App extends React.Component {
  /** Redirects to auth page or dashboard. */
  componentDidMount() {
    if (this.props.location.pathname === '/') {
      if (getSession()) {
        this.props.router.replace('/dashboard');
      } else {
        this.props.router.replace('/auth');
      }
    }
  }
  /** @return {Element} */
  render() {
    let session = getSession();
    let authElement = session ?
      <Link onClick={logout} to='/auth'>Logout</Link> :
      <span/>;
    return (
      <div>
        <nav className='navbar navbar-default navbar-fixed-top'>
          <div className='container'>
            <div className="navbar-header">
              <Link className='navbar-brand' to='/dashboard'>GroupDoodle</Link>
            </div>
            <ul className='nav navbar-nav navbar-right'>
              <li>{authElement}</li>
            </ul>
          </div>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
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
      <Route path='doodle/:id' component={DoodleView} onEnter={requireAuth} />
      <Route path='replay/:id' component={DoodleReplay} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('content'));
