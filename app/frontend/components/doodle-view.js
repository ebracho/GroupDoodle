import $ from 'jquery';
import React from 'react';
import {Link, withRouter} from 'react-router';
import Doodle from './doodle';

/** Displays a published doodle. */
class DoodleView extends React.Component {
  /**
   * Retrieves doodle and renders it.
   *
   * @param {Function} applyStroke method to apply stroke to Doodle.
   */
  getDoodle(applyStroke) {
    $.get({
      url: '/getDoodle',
      data: {doodleId: this.props.params.id},
      success: (doodle) => {
        doodle.strokes.sort((s1, s2) => s1.ts - s2.ts).map(applyStroke);
      },
      error: (xhr, status, err) => {
        console.error(status, err);
      },
    });
  }
  /**
   * Renders doodle.
   *
   * @return {Element}
   */
  render() {
    return (
      <div>
        <p>
          Doodle {this.props.params.id} |
          <Link to={`/replay/${this.props.params.id}`}>Watch Replay</Link>
        </p>
        <Doodle init={this.getDoodle.bind(this)} />
      </div>
    );
  }
}

module.exports = {
  DoodleView: withRouter(DoodleView),
};
