import React, { useState, useEffect } from 'react';
import useInterval from '../hooks/useInterval';

import { colors } from '../styles/ColorPalette';
import { H5 } from '../styles/Fonts';

function Stopwatch(props) {
  const [milliseconds, setMilliseconds] = useState(0);
  const [limitSeconds, setLimitSeconds] = useState(props.seconds);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (props.running) setSeconds(limitSeconds);
  }, [limitSeconds, props.running]);

  useInterval(() => {
    if (props.running) {
      if (parseInt(milliseconds) > 0) {
        setMilliseconds(parseInt(milliseconds) - 1);
      }
      if (parseInt(milliseconds) === 0) {
        if (parseInt(seconds) === 0) {
          props.setFinish(true);
          props.setRunning(false);
        } else {
          setSeconds(parseInt(seconds) - 1);
          setMilliseconds(99);
        }
      }
    }
  }, 10);

  return (
    <H5 color={colors.gameBlue500}>
      {seconds}:{milliseconds < 10 ? `0${milliseconds}` : milliseconds}
    </H5>
  );
}

export default Stopwatch;
