import React from 'react';
import {withRouter} from 'react-router';

/**  */
class DoodleRoom extends React.Component {
  /**
   * Emits authentication packet.
   *
   * @param {Properties} props
   */
  constructor(props) {
    super(props);
    session = getSession();
    if (!session) {
      this.props.router.replace('/auth');
    } else {
      authWebsocket(session);
    }
  }
  /**
   * Emits websocket session object.
   *
   * @param {Session} session Contains session data.
   */
  authWebsocket(session) {
    // TODO
  }
}

module.exports = {DoodleRoom: withRouter(DoodleRoom)};
