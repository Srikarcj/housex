import { useState, useEffect } from 'react';

export const useNetwork = () => {
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    effectiveType: navigator.connection?.effectiveType,
    downlink: navigator.connection?.downlink,
    rtt: navigator.connection?.rtt,
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        online: true,
      }));
    };

    const handleOffline = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        online: false,
      }));
    };

    const handleChange = () => {
      setNetworkStatus({
        online: navigator.onLine,
        effectiveType: navigator.connection?.effectiveType,
        downlink: navigator.connection?.downlink,
        rtt: navigator.connection?.rtt,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.connection?.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.connection?.removeEventListener('change', handleChange);
    };
  }, []);

  return networkStatus;
};

export default useNetwork; 