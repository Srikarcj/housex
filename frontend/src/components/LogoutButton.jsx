import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertCircle } from 'lucide-react';

const LogoutButton = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowConfirm(true)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Confirm Logout</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to log out?
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogoutButton; 