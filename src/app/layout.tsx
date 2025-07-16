import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AuthGuard from '@/components/AuthGuard'
import { Toaster } from '@/components/ui/sonner'

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
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <UserButton />
              </header>
              {children}
            </AuthGuard>
          </SignedIn>
          <SignedOut>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignInButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3fd8] transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </header>
            {children}
          </SignedOut>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}