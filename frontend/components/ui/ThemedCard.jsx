// components/ui/ThemedCard.jsx
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export function ThemedCard({ className, ...props }) {
  return (
    <Card 
      className={cn(
        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        className
      )} 
      {...props} 
    />
  )
}

export function ThemedCardHeader({ className, ...props }) {
  return <CardHeader className={cn("text-gray-900 dark:text-gray-100", className)} {...props} />
}

export function ThemedCardTitle({ className, ...props }) {
  return <CardTitle className={cn("text-gray-900 dark:text-gray-100", className)} {...props} />
}

export function ThemedCardDescription({ className, ...props }) {
  return <CardDescription className={cn("text-gray-600 dark:text-gray-400", className)} {...props} />
}

export function ThemedCardContent({ className, ...props }) {
  return <CardContent className={cn("text-gray-700 dark:text-gray-300", className)} {...props} />
}