"use client"

import { useState, useCallback, useEffect } from "react"

interface Employee {
  employeeId: string
  fullName: string
  email: string
  department: string
}

export default function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const addEmployee = useCallback(async (newEmployee: Employee) => {
    setError(null)
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      })

      if (!response.ok) {
        throw new Error("Failed to add employee")
      }

      const result = await response.json()
      setEmployees((prev) => [...prev, result.data])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const deleteEmployee = useCallback(async (employeeId: string) => {
    setError(null)
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete employee")
      }

      setEmployees((prev) => prev.filter((emp) => emp.employeeId !== employeeId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
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

  return { employees, loading, error, addEmployee, deleteEmployee, fetchEmployees }
}
