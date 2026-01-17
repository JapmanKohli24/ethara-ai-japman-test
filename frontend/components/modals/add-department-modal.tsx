"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface AddDepartmentModalProps {
  onClose: () => void
  onSubmit: (data: {
    name: string
    description?: string
  }) => Promise<void>
}

export default function AddDepartmentModal({ onClose, onSubmit }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name) {
      setError("Department name is required")
      return
    }

    if (formData.name.length < 2) {
      setError("Department name must be at least 2 characters")
      return
    }

    if (formData.name.length > 50) {
      setError("Department name must not exceed 50 characters")
      return
    }

    if (formData.description && formData.description.length > 200) {
      setError("Description must not exceed 200 characters")
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description || undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add department")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md mx-4 border border-border animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Add New Department</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Department Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Engineering"
              maxLength={50}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.name.length}/50 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the department..."
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/200 characters</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-200 hover:shadow-md active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
