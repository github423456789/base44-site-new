import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== 'days' && timerComponents.length === 0) {
        // Don't push leading zero values, unless it's days
        return;
    }

    if (timeLeft[interval] !== undefined) {
      timerComponents.push(
        <div key={interval} className="text-center">
          <span className="text-2xl font-bold text-slate-800">{String(timeLeft[interval]).padStart(2, '0')}</span>
          <span className="block text-xs text-slate-500 uppercase">{interval}</span>
        </div>
      );
    }
  });

  return (
    <div className="flex justify-center gap-4">
      {timerComponents.length ? timerComponents : <span>Match time!</span>}
    </div>
  );
}