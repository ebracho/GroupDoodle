import React from 'react';
import {withRouter} from 'react-router';
import io from 'socket.io-client';
import {getSession} from './auth';

/**  */
class DoodleRoom extends React.Component {
  /**
   * Installs socket handlers
   *
   * @param {Properties} props
   */
  constructor(props) {
    super(props);
    this.socket = io();

    this.socket.on('connect', () => {
      let session = getSession();
      this.socket.emit('authentication', {session});
      this.socket.on('unauthorized', (err) => {
        console.log('Unable to authenticate websocket', err.message);
      });
      this.socket.on('authenticated', () => {
        // Ping-pong.
        this.socket.on('bar', () => {
          console.log('>bar');
        });
      });
    });
  }
  /** Sends ping packet to websocket server. */
  ping() {
    console.log('<foo');
    this.socket.emit('foo');
  }
  /**
   * Renders doodle in real time.
   *
   * @return {Element} Component DOM element.
   */
  render() {
    return (
      <div>
        <h2>Hello from Room {this.props.params.id}!</h2>;
        <button onClick={this.ping.bind(this)}>Ping</button>
      </div>
    );
  }
}

module.exports = {DoodleRoom: withRouter(DoodleRoom)};
