import React, { useState, useEffect } from 'react';
import moment from 'moment';

const TimerCountdown = ({ startTimeISO, endTimeISO }) => {
  const calculateRemainingTime = () => {
    const startTime = moment(startTimeISO);
    const endTime = moment(endTimeISO);
    const now = moment();

    if (now.isAfter(endTime)) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const diff = endTime.diff(now, 'seconds');

    if (diff > 0) {
      const duration = moment.duration(diff, 'seconds');
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      return { hours, minutes, seconds };
    }

    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>Remaining Time:</div>
      <div>
        {String(remainingTime.hours).padStart(2, '0')}:
        {String(remainingTime.minutes).padStart(2, '0')}:
        {String(remainingTime.seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default TimerCountdown;
