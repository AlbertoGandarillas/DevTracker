'use client'

import { usePathname } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import { AppLayout } from '@/components/app-layout'

interface SignInLayoutProps {
  children: React.ReactNode
}

export function SignInLayout({ children }: SignInLayoutProps) {
  const pathname = usePathname()
  const isSignInPage = pathname?.startsWith('/sign-in')

  if (isSignInPage) {
    // For sign-in page, render without AuthGuard and AppLayout
    return <>{children}</>
  }

  // For all other pages, render with AuthGuard and AppLayout
  return (
    <AuthGuard>
      <AppLayout>
        {children}
      </AppLayout>
    </AuthGuard>
  )
} 