import React, { useState } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { User, Paintbrush, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'user',
      title: 'Homeowner',
      description: 'Find and book professional services for your home',
      icon: User,
      color: 'bg-green-500'
    },
    {
      id: 'painter',
      title: 'Painter',
      description: 'Offer your painting services to homeowners',
      icon: Paintbrush,
      color: 'bg-blue-500'
    },
    {
      id: 'builder',
      title: 'Builder',
      description: 'Provide construction and renovation services',
      icon: Building2,
      color: 'bg-purple-500'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    const selectedRoleData = roles.find(role => role.id === roleId);
    toast.success(`Successfully selected ${selectedRoleData.title} account type`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your role to get started
          </p>
        </div>

        {!selectedRole ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {roles.map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role.id)}
                className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className={`absolute top-0 left-0 w-full h-2 ${role.color} rounded-t-xl`} />
                <div className="flex flex-col items-center text-center">
                  <role.icon className="w-12 h-12 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">{role.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{role.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Sign up as {roles.find(r => r.id === selectedRole)?.title}
              </h3>
              <button
                onClick={() => setSelectedRole(null)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                Change role
              </button>
            </div>
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
                  footerActionLink: 'text-indigo-600 hover:text-indigo-500'
                }
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              redirectUrl="/"
              afterSignUpUrl="/onboarding"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage; 