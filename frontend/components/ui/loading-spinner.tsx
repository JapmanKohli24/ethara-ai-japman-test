"use client"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
      </div>
      <span className="ml-3 text-muted-foreground">Loading...</span>
    </div>
  )
}
