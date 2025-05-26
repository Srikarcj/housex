import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`);
        setUserData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn, user?.id]);

  const updateUserData = async (data) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        data
      );
      setUserData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating user data:', err);
      throw err;
    }
  };

  const value = {
    userData,
    loading,
    error,
    updateUserData,
    isSignedIn,
    user
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext; 