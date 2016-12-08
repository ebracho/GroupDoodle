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
    this.state = {
      rooms: [],
      doodles: [],
    };
    this.getRooms();
    this.roomPoll = setInterval(this.getRooms.bind(this), 2000);
    this.getDoodles();
    this.doodlePoll = setInterval(this.getDoodles.bind(this), 2000);
  }
  /** Terminates room polling */
  componentWillUnmount() {
    clearInterval(this.roomPoll);
    clearInterval(this.doodlePoll);
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
      success: (rooms) => {
        this.setState({rooms});
      },
      error: (xhr, status, error) => {
        console.error(status, error);
      },
    });
  }
  /** Populates state with published doodle ids */
  getDoodles() {
    $.get({
      url: '/getDoodles',
      success: (doodles) => {
        this.setState({doodles});
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
    let roomsElement = this.state.rooms.length === 0 ?
      <h4>No Active Rooms |
        <Link onClick={this.createRoom.bind(this)}> Create Room</Link>
      </h4> :
      <div>
        <h4>Active Rooms |
          <Link onClick={this.createRoom.bind(this)}> Create Room</Link>
        </h4>
        <div className='list-group'>
          {this.state.rooms.map((room) => {
            return (
              <Link to={`/room/${room.roomId}`} className='list-group-item'
                key={room.roomId}>
                {room.roomId}
              </Link>
            );
          })}
        </div>
      </div>;

    let doodlesElement = this.state.doodles.length === 0 ?
      <h4>No published Doodles</h4> :
      <div>
        <h4>Published Doodles</h4>
        <div className='list-group'>
          {this.state.doodles.map((doodleId) => {
            return (
              <Link to={`/doodle/${doodleId}`} className='list-group-item'
                key={doodleId}>
                {doodleId}
              </Link>
            );
          })}
        </div>
      </div>;

    return (
      <div className='row'>
        <div className='col-sm-6 col-xs-12'>
          {roomsElement}
        </div>
        <div className='col-sm-6 col-xs-12'>
          {doodlesElement}
        </div>
      </div>
    );
  }
}

module.exports = {Dashboard: withRouter(Dashboard)};
