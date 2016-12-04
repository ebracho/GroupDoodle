import React from 'react';
import {withRouter} from 'react-router';

/** */
class Dashboard extends React.Component {
  /**
   * Renders Dashboard component.
   *
   * @return {Element} Component DOM element.
   */
  render() {
    return <h2>Hello from Dashboard!</h2>;
  }
}

module.exports = {Dashboard: withRouter(Dashboard)};
