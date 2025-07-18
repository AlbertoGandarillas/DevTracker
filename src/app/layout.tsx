import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AuthGuard from '@/components/AuthGuard'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/app-layout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DevTracker - Developer Activity Tracker',
  description: 'Track daily development activities and team progress',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SignedIn>
            <AuthGuard>
              <AppLayout>
                {children}
              </AppLayout>
            </AuthGuard>
          </SignedIn>
          <SignedOut>
            <div className="min-h-screen bg-background">
              <main className="container py-6">
                {children}
              </main>
            </div>
          </SignedOut>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}