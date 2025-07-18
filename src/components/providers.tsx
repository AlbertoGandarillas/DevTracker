"use client"

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  console.log('Providers component rendering');
  
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
} 