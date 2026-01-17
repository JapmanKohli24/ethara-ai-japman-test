"use client"

import { useState, useCallback, useEffect } from "react"

interface Employee {
  employeeId: string
  fullName: string
  email: string
  department: string
}

interface AttendanceRecord {
  _id?: string
  employeeId: string
  date: string
  status: "Present" | "Absent"
}

export default function useAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [attendanceRes, employeesRes] = await Promise.all([fetch("/api/attendance"), fetch("/api/employees")])

        if (!attendanceRes.ok || !employeesRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const attendanceResult = await attendanceRes.json()
        const employeesResult = await employeesRes.json()

        setAttendanceRecords(attendanceResult.data || [])
        setEmployees(employeesResult.data || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const markAttendance = useCallback(async (record: AttendanceRecord) => {
    setError(null)
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        throw new Error("Failed to mark attendance")
      }

      const result = await response.json()
      // Check if this was an update (status 200) or new record (status 201)
      // For updates, we need to replace the existing record
      setAttendanceRecords((prev) => {
        const existingIndex = prev.findIndex(
          (r) => r.employeeId === result.data.employeeId && 
                 new Date(r.date).toDateString() === new Date(result.data.date).toDateString()
        )
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = result.data
          return updated
        }
        return [...prev, result.data]
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const fetchAttendanceRecords = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/attendance")
      if (!response.ok) {
        throw new Error("Failed to fetch attendance records")
      }
      const result = await response.json()
      setAttendanceRecords(result.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/employees")
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }
      const result = await response.json()
      setEmployees(result.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearAllAttendance = useCallback(async () => {
    setError(null)
    try {
      const response = await fetch("/api/attendance/clear-all", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear attendance records")
      }

      setAttendanceRecords([])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const clearEmployeeAttendance = useCallback(async (employeeId: string) => {
    setError(null)
    try {
      const response = await fetch(`/api/attendance/clear/${encodeURIComponent(employeeId)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear employee attendance")
      }

      setAttendanceRecords((prev) => prev.filter((r) => r.employeeId !== employeeId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const deleteAttendanceRecord = useCallback(async (recordId: string) => {
    setError(null)
    try {
      const response = await fetch(`/api/attendance/record/${encodeURIComponent(recordId)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete attendance record")
      }

      setAttendanceRecords((prev) => prev.filter((r) => r._id !== recordId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const updateAttendanceRecord = useCallback(async (recordId: string, data: { status?: "Present" | "Absent"; date?: string }) => {
    setError(null)
    try {
      const response = await fetch(`/api/attendance/record/${encodeURIComponent(recordId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update attendance record")
      }

      const result = await response.json()
      setAttendanceRecords((prev) => prev.map((r) => (r._id === recordId ? result.data : r)))
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  return {
    attendanceRecords,
    employees,
    loading,
    error,
    markAttendance,
    fetchAttendanceRecords,
    fetchEmployees,
    clearAllAttendance,
    clearEmployeeAttendance,
    deleteAttendanceRecord,
    updateAttendanceRecord,
  }
}
