"use client"

import { AlertCircle } from "lucide-react"

interface ErrorAlertProps {
  title: string
  message: string
  onDismiss?: () => void
}

export function ErrorAlert({ title, message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
