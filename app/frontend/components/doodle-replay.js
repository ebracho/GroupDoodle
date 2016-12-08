
import $ from 'jquery';
import React from 'react';
import {Link, withRouter} from 'react-router';
import Doodle from './doodle';

/** Displays a published doodle. */
class DoodleReplay extends React.Component {
  /**
   * Retrieves doodle and renders it.
   *
   * @param {Function} applyStroke method to apply stroke to Doodle.
   */
  replayDoodle(applyStroke) {
    $.get({
      url: '/getDoodle',
      data: {doodleId: this.props.params.id},
      success: (doodle) => {
        let t0 = Math.min(...doodle.strokes.map((doodle) => doodle.ts));
        doodle.strokes.forEach((stroke) => {
          setTimeout(applyStroke, stroke.ts - t0, stroke);
        });
      },
      error: (xhr, status, err) => {
        console.error(status, err);
      },
    });
  }
  /**
   * Renders doodle and passes replayDoodle as init function.
   *
   * @return {Element}
   */
  render() {
    return (
      <div>
        <p>
          Replay of
          <Link to={`/doodle/${this.props.params.id}`}>
            {` ${this.props.params.id}`}
          </Link>
        </p>
        <Doodle init={this.replayDoodle.bind(this)} />
      </div>
    );
  }
}

module.exports = {
  DoodleReplay: withRouter(DoodleReplay),
};
