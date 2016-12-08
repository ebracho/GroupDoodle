import $ from 'jquery';
import React from 'react';
import {withRouter} from 'react-router';
import io from 'socket.io-client';
import {getSession} from './auth';
import {SketchPicker} from 'react-color';
import Doodle from './doodle';

/**  */
class DoodleRoom extends React.Component {
  /**
   * Loads session and initializes socket.
   *
   * @param {Properties} props
   */
  constructor(props) {
    super(props);
    this.session = getSession();
    this.socket = io();
    this.state = {
      roomInfo: {},
    };
  }
  /** Installs socket handlers and joins doodle room. */
  componentDidMount() {
    this.getRoomInfo();
    this.installHandlers();
    this.socket.emit('joinRoom', this.props.params.id);
  }
  /** Retrieves room owner's userId and updates state. */
  getRoomInfo() {
    $.get({
      url: '/getDoodleRoom',
      data: {roomId: this.props.params.id},
      success: (roomInfo) => {
        this.setState({roomInfo});
      },
    });
  }
  /**
   * Returns whether user is owner of room
   *
   * @return {Boolean}
   */
  isOwner() {
    return this.state.roomInfo.owner === getSession().userId;
  }
  /** Leave rooom and disconnect socket when component unmounts. */
  componentWillUnmount() {
    this.socket.emit('leaveRoom', this.props.params.id);
    this.socket.disconnect();
  }
  /** Installs auth handlers then all other handlers if authenticated */
  installHandlers() {
    this.socket.on('connect', () => {
      this.socket.emit('authentication', {session: this.session});
      this.socket.on('unauthorized', () => {
        console.error('Unable to authenticate with websocket server.');
      });
      this.socket.on('authenticated', () => {
        this.socket.on('terminate', (doodleId) => {
          console.log(doodleId);
          this.props.router.replace(`/doodle/${doodleId}`);
        });
      });
    });
  }
  /** @param {Stroke} stroke */
  broadcastStroke(stroke) {
    this.socket.emit('stroke', this.props.params.id, stroke);
  }
  /** @param {Color} color */
  setDoodleStrokeStyle(color) {
    this.doodle.setStrokeStyle(color.hex);
  }
  /** Publishes doodle */
  publishDoodle() {
    this.socket.emit('publishDoodle', this.props.params.id);
  }
  /**
   * Renders doodle and color selector.
   *
   * @return {Element} Component DOM element.
   */
  render() {
    let publishButtonStyle = {
      display: this.isOwner() ? 'block' : 'none',
    };
    return (
      <div>

        <Doodle
          mutable='true'
          ref={(doodle) => {
            this.doodle = doodle;
          }}
          /* Register stroke event handlers */
          init={(applyStroke) => {
            this.socket.on('stroke', applyStroke);
            /* Sort strokeHistory by timestamp before applying */
            this.socket.on('strokeHistory', (strokeHistory) => {
              console.log(`Applying ${strokeHistory.length} strokes.`);
              strokeHistory.sort((s1, s2) => s1.ts-s2.ts).map(applyStroke);
            });
          }}
          onStroke={this.broadcastStroke.bind(this)}
        />

        <SketchPicker color='#fff'
          onChangeComplete={this.setDoodleStrokeStyle.bind(this)}
        />

        <button onClick={this.publishDoodle.bind(this)}
          style={publishButtonStyle}
          className='btn btn-primary'>
          PublishDoodle
        </button>

      </div>
    );
  }
}

module.exports = {DoodleRoom: withRouter(DoodleRoom)};
