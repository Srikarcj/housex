import { useCallback } from 'react';

export const useVibration = () => {
  const vibrate = useCallback((pattern) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const vibrateOnce = useCallback((duration = 200) => {
    vibrate(duration);
  }, [vibrate]);

  const vibratePattern = useCallback((pattern = [200, 100, 200]) => {
    vibrate(pattern);
  }, [vibrate]);

  const stopVibration = useCallback(() => {
    vibrate(0);
  }, [vibrate]);

  return {
    vibrate,
    vibrateOnce,
    vibratePattern,
    stopVibration,
  };
};

export default useVibration; 