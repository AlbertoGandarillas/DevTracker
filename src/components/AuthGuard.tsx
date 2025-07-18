'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  console.log('AuthGuard status:', status);
  console.log('AuthGuard session:', session);
  console.log('AuthGuard pathname:', pathname);

  useEffect(() => {
    // If we're on the sign-in page, don't apply authentication logic
    if (pathname?.startsWith('/sign-in')) {
      console.log('On sign-in page - skipping AuthGuard');
      return;
    }

    if (status === 'unauthenticated') {
      console.log('Redirecting to sign-in page');
      router.replace('/sign-in');
    } else if (status === 'authenticated' && pathname === '/') {
      console.log('User is authenticated on root page - redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [status, router, pathname]);

  // If we're on the sign-in page, don't apply authentication logic
  if (pathname?.startsWith('/sign-in')) {
    console.log('On sign-in page - skipping AuthGuard');
    return <>{children}</>;
  }

  if (status === 'loading') {
    console.log('Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6c47ff]"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    console.log('User is unauthenticated - showing loading while redirecting');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6c47ff]"></div>
      </div>
    );
  }

  console.log('Rendering children - user is authenticated');
  // If authenticated, show the children
  return <>{children}</>;
} 