import Link from "next/link"

interface LogoProps {
  showText?: boolean
  className?: string
  href?: string
}

export function Logo({ showText = true, className = "", href = "/" }: LogoProps) {
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      {showText && (
        <span className="font-bold text-xl text-gray-900">DevTracker</span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2">
        {logoContent}
      </Link>
    )
  }

  return logoContent
} 