import { Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import {
  Home,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Bot,
  Mail,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Contact', href: '/contact', icon: Mail },
    { name: 'Design Diary', href: '/design-diary', icon: BookOpen },
    ...(isSignedIn ? [
      { name: 'Bookings', href: '/bookings', icon: Calendar },
      { name: 'Profile', href: '/profile', icon: User },
      { name: 'AI Assistant', href: '/ai-query', icon: Bot }
    ] : [])
  ];

  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative">
                  <div className="relative flex items-center">
                    <div className="relative w-11 h-11">
                      <div className="absolute inset-0 bg-white rounded-xl shadow-md">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-600 rounded-tl"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-600 rounded-br"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-6 h-6">
                            <div className="absolute left-0 top-0 w-1 h-6 bg-blue-600 rounded-full"></div>
                            <div className="absolute left-0 top-2.5 w-6 h-1 bg-blue-600 rounded-full"></div>
                            <div className="absolute right-0 top-0 w-1 h-6 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-3">
                      <div className="relative">
                        <span className="text-2xl font-bold">
                          <span className="text-gray-800">House</span>
                          <span className="text-blue-600">X</span>
                        </span>
                        <div className="absolute -bottom-1 left-0 w-full">
                          <div className="h-0.5 w-1/2 bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <span className="text-sm text-gray-700">
                  {user?.fullName}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/sign-in"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden w-full">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isSignedIn ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.fullName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
                <div className="ml-auto">
                  <NotificationBell />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/sign-in"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

<style jsx>{`
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) skewX(-15deg);
    }
    100% {
      transform: translateX(200%) skewX(-15deg);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 3s infinite;
  }
  
  .animate-float {
    animation: float 2s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float 2s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
`}</style> 