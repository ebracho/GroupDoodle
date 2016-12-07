import React from 'react';

/**
 * Doodle rendering component.
 *
 * Renders a canvas element with strokes (small line segments) applied to it.
 *
 * Listens for mouse activity to apply new strokes to canvas.
 *
 * Accepts a callback function `props.onStroke` that is invoked with the stroke
 * object whenever a stroke is applied.
 *
 */
class Doodle extends React.Component {
  /**
   * Initializes the stroke state.
   *
   * @param {Propertys} props
   */
  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
      stroke: {
        prvX: 0,
        prvY: 0,
        curX: 0,
        curY: 0,
        strokeStyle: '#000',
      },
    };
  }
  /**
   * Initializes event listeners once the component is mounted.
   */
  componentDidMount() {
    this.initEventListeners();
  }
  /**
   * Returns a canvas context with specified strokeStyle
   *
   * @param {StrokeStyle} strokeStyle Hex color code for stroke
   * @return {Context}
   */
  getContext(strokeStyle) {
    let context = this.refs.canvas.getContext('2d');
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = strokeStyle;
    return context;
  }
  /**
   * Initializes all the event listeners for the doodle canvas.
   */
  initEventListeners() {
    let canvas = this.refs.canvas;
    /**
     * Updates the previous and current stroke coordinates.
     * If drawing flag is true, applies stroke with those coordinates.
     *
     * @param {Event} e
     */
    canvas.addEventListener('mousemove', (e) => {
      this.setState({
        stroke: {
          prvX: this.state.stroke.curX,
          prvY: this.state.stroke.curY,
          curX: e.pageX - canvas.offsetLeft,
          curY: e.pageY - canvas.offsetTop,
          strokeStyle: this.state.stroke.strokeStyle,
        },
      });
      let {prvX, prvY, curX, curY} = this.state.stroke;
      let mouseMoved = (prvX != prvY || curX != curY);
      if (this.state.drawing && mouseMoved) {
        this.applyStroke(this.state.stroke, true);
      }
    }, false);
    /**
     * @param {Event} e
     */
    canvas.addEventListener('mousedown', (e) => {
      this.setState({
        drawing: true,
      });
    }, false);
    /**
     * Sets drawing flag to false.
     *
     * @param {Event} e
     */
    canvas.addEventListener('mouseup', (e) => {
      this.setState({
        drawing: false,
      });
    }, false);
  }
  /**
   * Applies the given stroke to the canvas with specified strokeStyle.
   *
   * @param {StrokeCoords} stroke
   * @param {Boolean} invokeOnStroke
   */
  applyStroke(stroke, invokeOnStroke = false) {
    if (invokeOnStroke && this.props.onStroke) {
      this.props.onStroke(stroke);
    }
    let context = this.getContext(stroke.strokeStyle);
    context.beginPath();
    context.moveTo(stroke.prvX, stroke.prvY);
    context.lineTo(stroke.curX, stroke.curY);
    context.stroke();
    context.closePath();
  }
  /**
   * Updates the current stroke state's style.
   *
   * @param {StrokeStyle} strokeStyle hex color code
   */
  setStrokeStyle(strokeStyle) {
    this.setState({
      stroke: {
        prvX: this.state.stroke.prvX,
        prvY: this.state.stroke.prvY,
        curX: this.state.stroke.curX,
        curY: this.state.stroke.curY,
        strokeStyle: strokeStyle,
      },
    });
  }
  /**
   * Renders canvas with black border.
   *
   * @return {Element} canvas element.
   */
  render() {
    let style = {border: '1px solid black'};
    return <canvas ref="canvas" style={style} width={300} height={300} />;
  }
}

module.exports = Doodle;
