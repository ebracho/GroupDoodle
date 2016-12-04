import $ from 'jquery';
import React from 'react';
import {Link, withRouter} from 'react-router';

/** */
class Dashboard extends React.Component {
  /**
   * Sets initial state values and starts polling for active rooms.
   *
   * @param {Properties} props
   */
  constructor(props) {
    super(props);
    this.state = {rooms: []};
    this.getRooms();
    this.roomPollingIntervalId = setInterval(this.getRooms.bind(this), 2000);
  }
  /** Terminates room polling */
  componentWillUnmount() {
    clearInterval(this.roomPollingIntervalId);
  }
  /** Creates a Doodle Room and redirects to it. */
  createRoom() {
    $.post({
      url: '/createRoom',
      success: (room) => {
        this.props.router.replace(`/room/${room.roomId}`);
      },
      error: (xhr, status, err) => {
        console.error(status, err);
      },
    });
  }
  /** Populates state with active room meta data. */
  getRooms() {
    $.get({
      url: '/getActiveRooms',
      success: (data) => {
        this.setState({rooms: data.rooms});
      },
      error: (xhr, status, error) => {
        console.error(status, error);
      },
    });
  }
  /**
   * Renders Dashboard component.
   *
   * @return {Element} Component DOM element.
   */
  render() {
    return (
      <div>
        <h2>Hello from Dashboard!</h2>;
        <h3>Active Rooms</h3>
        <ul>
          {this.state.rooms.map((room) =>
            <li key={room.roomId}>
              <Link to={`/room/${room.roomId}`}>
                {`${room.owner} (${room.roomId})`}
              </Link>
            </li>
          )}
        </ul>
        <button onClick={this.createRoom.bind(this)}>Create Room</button>
      </div>
    );
  }
}

module.exports = {Dashboard: withRouter(Dashboard)};
