import React from 'react';
import {withRouter} from 'react-router';
import {getSession} from './auth';

/**  */
class DoodleRoom extends React.Component {
  /**
   * Emits authentication packet.
   *
   * @param {Properties} props
   */
  constructor(props) {
    super(props);
    this.authWebsocket(getSession());
  }
  /**
   * Emits websocket session object.
   *
   * @param {Session} session Contains session data.
   */
  authWebsocket(session) {
    // TODO
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
      </div>
    );
  }
}

module.exports = {DoodleRoom: withRouter(DoodleRoom)};
