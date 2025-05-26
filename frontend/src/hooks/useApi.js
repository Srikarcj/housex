import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthToken } = useAuth();

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const token = await getAuthToken();
        const response = await apiFunction(...args, token);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, getAuthToken]
  );

  return {
    data,
    loading,
    error,
    execute,
  };
};

export default useApi; 