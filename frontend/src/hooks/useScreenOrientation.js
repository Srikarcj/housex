import { useState, useEffect } from 'react';

export const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState({
    angle: 0,
    type: 'landscape-primary',
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation({
        angle: window.screen.orientation.angle,
        type: window.screen.orientation.type,
      });
    };

    if (window.screen.orientation) {
      handleOrientationChange();
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  const lockOrientation = async (type) => {
    try {
      if (window.screen.orientation) {
        await window.screen.orientation.lock(type);
      }
    } catch (error) {
      console.error('Failed to lock orientation:', error);
    }
  };

  const unlockOrientation = async () => {
    try {
      if (window.screen.orientation) {
        await window.screen.orientation.unlock();
      }
    } catch (error) {
      console.error('Failed to unlock orientation:', error);
    }
  };

  return {
    orientation,
    lockOrientation,
    unlockOrientation,
  };
};

export default useScreenOrientation; 