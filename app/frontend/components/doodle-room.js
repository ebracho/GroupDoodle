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
  }
  /** Installs socket handlers and joins doodle room. */
  componentDidMount() {
    this.installHandlers();
    this.socket.emit('joinRoom', this.props.params.id);
  }
  /** Leave rooom and disconnect socket when component unmounts. */
  componentWillUnmount() {
    this.socket.emit('leaveRoom', this.props.params.id);
    this.socket.disconnect();
  }
  /** Installs auth handlers then doodle handlers if authenticated. */
  installHandlers() {
    this.socket.on('connect', () => {
      this.socket.emit('authentication', {session: this.session});
      this.socket.on('unauthorized', () => {
        console.error('Unable to authenticate with websocket server.');
      });
      this.socket.on('authenticated', () => {
        this.installDoodleHandlers();
      });
    });
  }
  /** Installs doodle handlers. */
  installDoodleHandlers() {
    this.socket.on('stroke', this.strokeHandler);
    this.socket.on('terminate', this.terminateHandler);
    this.socket.on('bar', this.pongHandler);
  }
  /**
   * Handles incoming stroke packet
   *
   * @param {Stroke} stroke
   */
  strokeHandler(stroke) {
    this.refs.doodle.applyStroke(stroke);
  }
  /** Handles incoming terminate packet */
  terminateHandler() {
  }
  /** Handles incoming 'pong' packet. */
  pongHandler() {
    console.log('>pong');
  }
  /** Sends ping packet */
  ping() {
    console.log('<ping');
    this.socket.emit('foo');
  }
  /** @param {Stroke} stroke */
  broadcastStroke(stroke) {
    this.socket.emit('stroke', this.props.params.id, stroke);
  }
  /** @param {Color} color */
  setDoodleStrokeStyle(color) {
    this.refs.doodle.setStrokeStyle(color.hex);
  }
  /**
   * Renders doodle and color selector.
   *
   * @return {Element} Component DOM element.
   */
  render() {
    return (
      <div>
        <h2>Hello from Room {this.props.params.id}!</h2>
        <Doodle ref='doodle' onStroke={this.broadcastStroke.bind(this)}/>
        <SketchPicker color='#fff'
          onChangeComplete={this.setDoodleStrokeStyle.bind(this)} />
      </div>
    );
  }
}

module.exports = {DoodleRoom: withRouter(DoodleRoom)};
