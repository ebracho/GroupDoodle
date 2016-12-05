import React from 'react';

/** */
class Doodle extends React.Component {
  /** @param {Propertys} props */
  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
      color: '#000',
      stroke: {
        prvX: 0,
        prvY: 0,
        curX: 0,
        curY: 0,
      },
    };
  }
  /** */
  componentDidMount() {
    this.initEventListeners();
  }
  /** @return {Context} */
  getContext() {
    let context = this.refs.canvas.getContext('2d');
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = this.state.color;
    return context;
  }
  /** */
  initEventListeners() {
    let canvas = this.refs.canvas;
    canvas.addEventListener('mousemove', (e) => {
      this.setState({
        stroke: {
          prvX: this.state.stroke.curX,
          prvY: this.state.stroke.curY,
          curX: e.pageX - canvas.offsetLeft,
          curY: e.pageY - canvas.offsetTop,
        },
      });
      let {prvX, prvY, curX, curY} = this.state.stroke;
      let mouseMoved = (prvX != prvY || curX != curY);
      if (this.state.drawing && mouseMoved) {
        this.applyStroke(this.state.stroke, true);
      }
    }, false);

    canvas.addEventListener('mousedown', (e) => {
      this.setState({
        drawing: true,
        stroke: {
          prvX: e.pageX - canvas.offsetLeft,
          prvY: e.pageY - canvas.offsetTop,
          curX: this.state.stroke.curX,
          curY: this.state.stroke.curY,
        },
      });
    }, false);

    canvas.addEventListener('mouseup', (e) => {
      this.setState({
        drawing: false,
      });
    }, false);
  }
  /**
   * @param {StrokeCoords} stroke
   * @param {Boolean} invokeOnStroke
   */
  applyStroke(stroke, invokeOnStroke = false) {
    if (invokeOnStroke && this.props.onStroke) {
      this.props.onStroke(stroke);
    }
    let context = this.getContext();
    context.beginPath();
    context.moveTo(stroke.prvX, stroke.prvY);
    context.lineTo(stroke.curX, stroke.curY);
    context.stroke();
    context.closePath();
  }
  /** @param {Color} color */
  setColor(color) {
    this.setState({
      color: color.hex,
    });
  }
  /** @return {Element} */
  render() {
    let style = {border: '1px solid black'};
    return <canvas ref="canvas" style={style} width={300} height={300} />;
  }
}

module.exports = Doodle;
