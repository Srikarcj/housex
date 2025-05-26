import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useNotification = () => {
  const showSuccess = useCallback((message) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
      },
    });
  }, []);

  const showError = useCallback((message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    });
  }, []);

  const showInfo = useCallback((message) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#3B82F6',
        color: '#fff',
      },
    });
  }, []);

  const showWarning = useCallback((message) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#F59E0B',
        color: '#fff',
      },
    });
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

export default useNotification; 