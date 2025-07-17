"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Calendar, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/useUser"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { NAVIGATION, UI_CONFIG } from "@/lib/constants"

// Icon mapping for navigation
const iconMap = {
  Activity,
  Calendar,
  Settings,
}

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAdmin, loading } = useUser()

  // Handle scroll effect for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > UI_CONFIG.SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show loading state for navigation while checking admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm" 
          : "bg-white border-b border-gray-100"
      )}>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">DevTracker</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {NAVIGATION.map((item) => {
                if ('adminOnly' in item && item.adminOnly && !isAdmin) return null

                const isActive = pathname === item.href
                const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      isActive 
                        ? "bg-gray-100 text-gray-900" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Clerk UserButton */}
            <UserButton appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }} />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="container py-4 space-y-2">
              {NAVIGATION.map((item) => {
                if ('adminOnly' in item && item.adminOnly && !isAdmin) return null

                const isActive = pathname === item.href
                const IconComponent = iconMap[item.icon as keyof typeof iconMap]

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.name}
                    {'adminOnly' in item && item.adminOnly && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        Admin
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content - flex-1 makes it take remaining space */}
      <main className="flex-1 container py-6">{children}</main>

      {/* Footer - mt-auto pushes it to bottom on large screens, normal on mobile */}
      <footer className="border-t py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2024 DevTracker. Built for efficient team activity tracking.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">Version 1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
