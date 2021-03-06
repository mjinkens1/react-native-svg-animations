import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import { Animated, Dimensions } from 'react-native';
import { svgPathProperties } from 'svg-path-properties';

import Path from '../AnimatedSVG';

const { height, width } = Dimensions.get('window');
class AnimatedSVGPath extends Component {
  static propTypes = {
    d: PropTypes.string.isRequired,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeLinecap: PropTypes.string,
    duration: PropTypes.number,
    height: PropTypes.number,
    delay: PropTypes.number,
    width: PropTypes.number,
    scale: PropTypes.number,
    fill: PropTypes.string,
    loop: PropTypes.bool,
    initialOffset: PropTypes.number
  };

  static defaultProps = {
    strokeColor: 'black',
    strokeWidth: 1,
    strokeLinecap: 'butt',
    duration: 1000,
    delay: 1000,
    fill: 'none',
    scale: 1,
    height,
    width,
    loop: true,
    initialOffset: 0
  };

  constructor(props) {
    super(props);
    const { d, initialOffset } = this.props;
    const properties = svgPathProperties(d);
    this.length = properties.getTotalLength();
    this.strokeDashoffset = new Animated.Value(this.length - initialOffset);
  }

  animate = () => {
    const { delay, duration, initialOffset, loop } = this.props;
    this.strokeDashoffset.setValue(this.length - initialOffset);
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this.strokeDashoffset, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true
      })
    ]).start(() => {
      if (loop) {
        this.animate();
      }
    });
  };

  componentDidMount() {
    this.animate();
  }

  render() {
    const {
      d,
      fill,
      scale,
      width,
      height,
      strokeColor,
      strokeWidth,
      strokeLinecap
    } = this.props;
    return (
      <Svg height={height * scale + 5} width={width * scale + 5}>
        <Path
          strokeDasharray={[this.length, this.length]}
          strokeDashoffset={this.strokeDashoffset}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          stroke={strokeColor}
          scale={scale}
          fill={fill}
          d={d}
        />
      </Svg>
    );
  }
}

/* Export ==================================================================== */

module.exports = AnimatedSVGPath;
module.exports.details = {
  title: 'AnimatedSVGPath'
};
