import { useState, useEffect } from 'react';

export const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  });

  useEffect(() => {
    const handleOrientation = (event) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute,
      });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return orientation;
};

export default useDeviceOrientation; 