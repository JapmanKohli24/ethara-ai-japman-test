"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface Employee {
  employeeId: string
  fullName: string
  email: string
  department: string
}

interface MarkAttendanceModalProps {
  employees: Employee[]
  preSelectedEmployeeId?: string
  onClose: () => void
  onSubmit: (data: {
    employeeId: string
    date: string
    status: "Present" | "Absent"
  }) => Promise<void>
}

export default function MarkAttendanceModal({
  employees,
  preSelectedEmployeeId,
  onClose,
  onSubmit,
}: MarkAttendanceModalProps) {
  const [formData, setFormData] = useState({
    employeeId: preSelectedEmployeeId || "",
    date: new Date().toISOString().split("T")[0],
    status: "Present" as "Present" | "Absent",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.employeeId || !formData.date) {
      setError("Please select an employee and date")
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData as { employeeId: string; date: string; status: "Present" | "Absent" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark attendance")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md mx-4 border border-border animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Mark Attendance</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Employee *</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.fullName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

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
              {loading ? "Marking..." : "Mark Attendance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
