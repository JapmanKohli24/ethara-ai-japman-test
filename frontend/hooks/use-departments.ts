"use client"

import { useState, useCallback, useEffect } from "react"

interface Department {
  name: string
  description?: string
}

export default function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const addDepartment = useCallback(async (newDepartment: Department) => {
    setError(null)
    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDepartment),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add department")
      }

      const result = await response.json()
      setDepartments((prev) => [...prev, result.data])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const deleteDepartment = useCallback(async (name: string) => {
    setError(null)
    try {
      const response = await fetch(`/api/departments/${encodeURIComponent(name)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete department")
      }

      setDepartments((prev) => prev.filter((dept) => dept.name !== name))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const fetchDepartments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/departments")
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      const result = await response.json()
      setDepartments(result.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const seedDepartments = useCallback(async () => {
    setError(null)
    try {
      const response = await fetch("/api/departments/seed", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to seed departments")
      }

      const result = await response.json()
      setDepartments(result.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  return { departments, loading, error, addDepartment, deleteDepartment, fetchDepartments, seedDepartments }
}
