import { useState, useEffect } from 'react';

export const useDeviceMotion = () => {
  const [motion, setMotion] = useState({
    acceleration: {
      x: null,
      y: null,
      z: null,
    },
    accelerationIncludingGravity: {
      x: null,
      y: null,
      z: null,
    },
    rotationRate: {
      alpha: null,
      beta: null,
      gamma: null,
    },
    interval: null,
  });

  useEffect(() => {
    const handleMotion = (event) => {
      setMotion({
        acceleration: {
          x: event.acceleration?.x,
          y: event.acceleration?.y,
          z: event.acceleration?.z,
        },
        accelerationIncludingGravity: {
          x: event.accelerationIncludingGravity?.x,
          y: event.accelerationIncludingGravity?.y,
          z: event.accelerationIncludingGravity?.z,
        },
        rotationRate: {
          alpha: event.rotationRate?.alpha,
          beta: event.rotationRate?.beta,
          gamma: event.rotationRate?.gamma,
        },
        interval: event.interval,
      });
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  return motion;
};

export default useDeviceMotion; 