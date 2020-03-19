import React, {
  PureComponent, Component,
} from 'react';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import {
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import {
  svgPathProperties,
} from 'svg-path-properties';

import Path from '../AnimatedSVG';

const { height, width } = Dimensions.get('window');
class AnimatedSVGPath extends Component {
  static propTypes = {
    d: PropTypes.string.isRequired,
    delay: PropTypes.number,
    duration: PropTypes.number,
    easing: PropTypes.any,
    fill: PropTypes.string,
    height: PropTypes.number,
    initialOffset: PropTypes.number,
    loop: PropTypes.bool,
    reverse: PropTypes.bool
    scale: PropTypes.number,
    strokeColor: PropTypes.string,
    strokeLinecap: PropTypes.string,
    strokeWidth: PropTypes.number,
    transform: PropTypes.string,
    width: PropTypes.number,
  };
  
  static defaultProps = {
    delay: 1000,
    duration: 1000,
    easing: Easing.easeInOut,
    fill: "none",
    height,
    initialOffset: 0.75,
    loop: true,
    reverse: false
    scale: 1,
    strokeColor: "black",
    strokeLinecap: "butt",
    strokeWidth: 1,
    transform: "",
    width,
  };
  
  constructor(props) {
    super(props);
    const { d, reverse } = this.props;
    const properties = svgPathProperties(d)
    this.length = properties.getTotalLength();
    this.strokeDashoffset = new Animated.Value(
        !reverse
          ? this.length * initialOffset
          : 0 + this.length * (1 - initialOffset)
      );
  }

  animate = () => {
    const {
      delay,
      duration,
      loop,
      easing = 'linear',
      reverse,
    } = this.props;
    this.strokeDashoffset = new Animated.Value(
        !reverse
          ? this.length * initialOffset
          : 0 + this.length * (1 - initialOffset)
      );
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this.strokeDashoffset, {
        toValue: !reverse ? 0 : this.length,
        duration: duration,
        easing: Easing[easing],
        useNativeDriver: true,
      })
    ]).start(() => {
      if (loop) {
          this.animate();
      }
    });
  }

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
      strokeLinecap,
      strokeDashArray: dashArray,
      transform,
    } = this.props;
    return (
      <Svg
        height={(height * scale) + 5}
        width={(width * scale) + 5}
      >
        <Path
          strokeDasharray={ dashArray || [this.length, this.length] }
          strokeDashoffset={this.strokeDashoffset}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          stroke={strokeColor}
          scale={scale}
          fill={fill}
          transform={transform}
          d={d}
        />
      </Svg>
    );
  }
}

/* Export ==================================================================== */

module.exports = AnimatedSVGPath;
module.exports.details = {
  title: 'AnimatedSVGPath',
};
