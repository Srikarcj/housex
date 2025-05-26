import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

export const useAuth = () => {
  const { isLoaded, userId, getToken } = useClerkAuth();
  const { user } = useUser();
  const { userData, loading: userDataLoading } = useUserContext();
  const navigate = useNavigate();

  const isAuthenticated = isLoaded && !!userId;
  const isLoading = !isLoaded || userDataLoading;

  const signOut = async () => {
    try {
      await window.Clerk.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getAuthToken = async () => {
    try {
      return await getToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    userData,
    signOut,
    getAuthToken,
  };
};

export default useAuth; 