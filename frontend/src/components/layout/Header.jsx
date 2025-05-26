import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';

const Header = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            HouseX
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-600 hover:text-blue-600">
              Services
            </Link>
            <Link to="/professionals" className="text-gray-600 hover:text-blue-600">
              Professionals
            </Link>
            {isSignedIn ? (
              <>
                <Link to="/bookings" className="text-gray-600 hover:text-blue-600">
                  My Bookings
                </Link>
                <div className="flex items-center space-x-4">
                  <NotificationBell />
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <img
                        src={user?.imageUrl}
                        alt={user?.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user?.fullName}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/sign-in"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              to="/services"
              className="block text-gray-600 hover:text-blue-600"
            >
              Services
            </Link>
            <Link
              to="/professionals"
              className="block text-gray-600 hover:text-blue-600"
            >
              Professionals
            </Link>
            {isSignedIn ? (
              <>
                <Link
                  to="/bookings"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-gray-600 hover:text-blue-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/sign-in"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 