import React, { useState, useEffect } from 'react';
import Button from './shared/button';
// Helper function to format remaining time
const calculateTimeLeft = (deadline) => {
  const difference = new Date(deadline) - new Date();
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

const Timer = ({ config }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(config.deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(config.deadline));
    }, 1000);

    return () => clearInterval(timer);
  }, [config.deadline]);

  return (
    <div className='p-6 justify-center items-center md:items-start lg:items-start flex flex-col'>
      <h2 className="text-2xl font-bold mb-4">{config.title}</h2>
    <div className="grid auto-cols-max grid-flow-col gap-4 md:gap-2 text-center "> 
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-neutral rounded-box text-neutral-content flex flex-col font-bold">
          <span className="countdown font-mono text-5xl md:text-3xl">
        <span  aria-live="polite" aria-label="15">{value}</span>
      </span>
      {unit}
    </div>
      ))}
    </div>
    <div className="mt-4">
    <Button textColor="text-brandWhite dark:text-brandBlue font-bold"
    bgColor="bg-brandGreen dark:bg-brandWhite"
    text="Shop Now"/> 
    </div>
    </div>
  );
};

export default Timer;

