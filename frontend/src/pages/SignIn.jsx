import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </a>
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
                footerActionLink: 'text-indigo-600 hover:text-indigo-500'
              }
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 