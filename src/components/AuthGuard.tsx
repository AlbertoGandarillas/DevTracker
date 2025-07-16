'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [isValidated, setIsValidated] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      validateUser();
    }
  }, [isLoaded, user]);

  const validateUser = async () => {
    try {
      const response = await fetch('/api/auth/validate');
      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setIsValidated(true);
        setIsUnauthorized(false);
      } else if (data.unauthorized) {
        setIsUnauthorized(true);
        setIsValidated(false);
      } else {
        console.error('Validation error:', data.error);
        setIsValidated(false);
      }
    } catch (error) {
      console.error('Error validating user:', error);
      setIsValidated(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6c47ff]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Let Clerk handle the sign-in flow
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Access Denied
            </h2>
            <p className="text-red-600 mb-4">
              This email address is not authorized to access DevTracker.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Only authorized team members can access this application.
            </p>
            <SignOutButton>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6c47ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 