import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null,
  });

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      error: null,
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      coordinates: { lat: null, lng: null },
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      onError({
        code: 0,
        message: 'Geolocation not supported',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, [options]);

  return location;
};

export default useGeolocation; 