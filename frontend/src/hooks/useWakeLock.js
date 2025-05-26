import { useState, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      if (isSupported) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
      }
    } catch (error) {
      console.error('Failed to request wake lock:', error);
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLock) {
        await wakeLock.release();
        setWakeLock(null);
      }
    } catch (error) {
      console.error('Failed to release wake lock:', error);
    }
  }, [wakeLock]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock, requestWakeLock]);

  return {
    isSupported,
    isActive: !!wakeLock,
    requestWakeLock,
    releaseWakeLock,
  };
};

export default useWakeLock; 