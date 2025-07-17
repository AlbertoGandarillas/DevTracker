import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  title?: string
  className?: string
  showIcon?: boolean
  retry?: () => void
}

export function ErrorMessage({ 
  message, 
  title, 
  className, 
  showIcon = true, 
  retry 
}: ErrorMessageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      {showIcon && <AlertCircle className="h-12 w-12 text-red-500 mb-4" />}
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
} 