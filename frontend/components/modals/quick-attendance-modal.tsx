"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import useEmployees from "@/hooks/use-employees"

interface QuickAttendanceModalProps {
  onClose: () => void
  onSubmit: (data: {
    employeeId: string
    date: string
    status: "Present" | "Absent"
  }) => Promise<void>
}

export default function QuickAttendanceModal({ onClose, onSubmit }: QuickAttendanceModalProps) {
  const { employees, loading: employeesLoading } = useEmployees()
  const [employeeName, setEmployeeName] = useState("")
  const [status, setStatus] = useState<"Present" | "Absent">("Present")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState<Array<{ employeeId: string; fullName: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  const handleNameChange = (value: string) => {
    setEmployeeName(value)
    setSelectedEmployee(null)

    if (value.trim()) {
      const filtered = employees.filter((emp) => emp.fullName.toLowerCase().includes(value.toLowerCase()))
      setFilteredEmployees(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredEmployees([])
      setShowSuggestions(false)
    }
  }

  const handleSelectEmployee = (emp: { employeeId: string; fullName: string }) => {
    setEmployeeName(emp.fullName)
    setSelectedEmployee(emp.employeeId)
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedEmployee) {
      setError("Please select an employee from the list")
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        employeeId: selectedEmployee,
        date: new Date().toISOString().split("T")[0],
        status,
      })
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

          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-1">Employee Name *</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => employeeName && setShowSuggestions(true)}
              placeholder="Start typing employee name..."
              disabled={employeesLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
            />

            {showSuggestions && filteredEmployees.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.employeeId}
                    type="button"
                    onClick={() => handleSelectEmployee(emp)}
                    className="w-full text-left px-3 py-2 hover:bg-muted transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-foreground text-sm"
                  >
                    {emp.fullName}
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && employeeName && filteredEmployees.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 p-3 text-sm text-muted-foreground text-center">
                No employees found
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Status for Today</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStatus("Present")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  status === "Present"
                    ? "bg-green-500/20 border-2 border-green-500 text-green-600"
                    : "bg-muted border-2 border-transparent text-foreground hover:border-green-500/50 hover:bg-green-500/10"
                }`}
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => setStatus("Absent")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  status === "Absent"
                    ? "bg-red-500/20 border-2 border-red-500 text-red-600"
                    : "bg-muted border-2 border-transparent text-foreground hover:border-red-500/50 hover:bg-red-500/10"
                }`}
              >
                Absent
              </button>
            </div>
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
              disabled={loading || !selectedEmployee}
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
