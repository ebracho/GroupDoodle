import $ from 'jquery';
import React from 'react';
import {withRouter} from 'react-router';

/** @return {Session} */
function getSession() {
  return JSON.parse(localStorage.getItem('session'));
}

/** @param {Session} session */
function setSession(session) {
  localStorage.setItem('session', JSON.stringify(session));
}

/** Posts logout endpoint and deletes local session data. */
function logout() {
  setSession(null);
  $.post({url: '/logout'});
}

/**
 * Middleware function that reroutes unauthorized users.
 *
 * @param {Route} nextState
 * @param {Function} replace Replaces current history entry.
 */
function requireAuth(nextState, replace) {
  let session = getSession();
  let now = new Date();
  if (!session || now > new Date(session.expiration)) {
    replace({
      pathname: '/auth',
      state: {
        nextPathname: nextState.location.pathname,
        errors: ['You must login first'],
      },
    });
  }
}

/** Login/Register component that authenticates with http channel. */
class AuthForm extends React.Component {
  /**
   * Sets initial state.
   *
   * @param {Properties} props
   */
  constructor(props) {
    super(props);
    this.state = {userId: '', password: '', errors: []};
    this.errorStyle = {color: 'red'};
  }
  /**
   * Validates registration credentials, sets errors.
   *
   * @return {Boolean} Whether there were errors.
   */
  validate() {
    let errors = [];
    if (this.state.userId.length < 3 || this.state.userId.length > 15)
      errors.push('UserId must be between 3 and 15 chars.');
    if (!this.state.userId.match(/^[0-9A-Za-z]+/))
      errors.push('UserId must alphanumeric');
    if (this.state.password.length < 8 || this.state.password.length > 64)
      errors.push('Password must be between 8 and 64 chars.');
    return errors.length == 0;
  }
  /**
   * Validates input, posts registration data, reroutes or errors.
   *
   * @param {Event} event
   */
  register(event) {
    event.preventDefault();
    this.setState({errors: []});
    if (!this.validate()) return;
    $.post({
      url: '/register',
      data: {userId: this.state.userId, password: this.state.password},
      success: (session) => {
        setSession(session);
        this.props.router.replace('/dashboard');
      },
      error: (xhr, status, error) => {
        this.setState({errors: ['UserId already exists.']});
      },
    });
  }
  /**
   * Posts login, routes to dashboard or displays error.
   *
   * @param {Event} event
   */
  login(event) {
    event.preventDefault();
    this.setState({errors: []});
    $.post({
      url: '/login',
      data: {userId: this.state.userId, password: this.state.password},
      success: (session) => {
        setSession(session);
        this.props.router.replace(this.state.nextPathname || '/dashboard');
      },
      error: (xhr, status, error) => {
        this.setState({errors: ['Invalid UserId/Password.']});
      },
    });
  }
  /**
   * Creates an input binding function that updates component state.
   * Must be bound to a react component.
   *
   * @param {String} key name of state attribute.
   *
   * @return {Function} input binding function.
   */
  createInputBinding(key) {
    return (event) => {
      let newState = {};
      newState[key] = event.target.value;
      this.setState(newState);
    };
  }
  /**
   * Renders authentication form with errors.
   *
   * @return {Element}
   */
  render() {
    return (
      <form>
        {this.state.errors.map(
          (err, i) => <p key={i} style={this.errorStyle}>{err}</p>
        )}
        <input onChange={this.createInputBinding('userId')} />
        <input type='password' onChange={this.createInputBinding('password')} />
        <button onClick={this.login.bind(this)}>Login</button>
        <button onClick={this.register.bind(this)}>Register</button>
      </form>
    );
  }
}

module.exports = {
  getSession,
  setSession,
  logout,
  requireAuth,
  AuthForm: withRouter(AuthForm),
};
