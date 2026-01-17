"use client"

import { useState } from "react"
import { Calendar, Search, ChevronDown, ChevronRight, Trash2, Pencil, X, Check } from "lucide-react"
import MarkAttendanceModal from "@/components/modals/mark-attendance-modal"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorAlert } from "@/components/ui/error-alert"
import useAttendance from "@/hooks/use-attendance"

export default function AttendanceManagement() {
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [operationError, setOperationError] = useState<string | null>(null)
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set())
  const [clearing, setClearing] = useState<string | null>(null) // null, "all", or employeeId
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<"Present" | "Absent">("Present")
  const [processingRecord, setProcessingRecord] = useState<string | null>(null)
  const { attendanceRecords, employees, loading, error, markAttendance, clearAllAttendance, clearEmployeeAttendance, deleteAttendanceRecord, updateAttendanceRecord } = useAttendance()

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleMarkAttendance = async (data: {
    employeeId: string
    date: string
    status: "Present" | "Absent"
  }) => {
    setOperationError(null)
    try {
      await markAttendance(data)
      setIsMarkModalOpen(false)
      setSelectedEmployeeId("")
    } catch {
      setOperationError("Failed to mark attendance")
    }
  }

  const getEmployeeAttendance = (employeeId: string) => {
    return attendanceRecords.filter((record) => record.employeeId === employeeId)
  }

  const getAttendanceCounts = (employeeId: string) => {
    const records = getEmployeeAttendance(employeeId)
    const present = records.filter((r) => r.status === "Present").length
    const absent = records.filter((r) => r.status === "Absent").length
    return { present, absent, total: records.length }
  }

  const toggleExpanded = (employeeId: string) => {
    setExpandedEmployees((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId)
      } else {
        newSet.add(employeeId)
      }
      return newSet
    })
  }

  const isExpanded = (employeeId: string) => expandedEmployees.has(employeeId)

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear ALL attendance records? This cannot be undone.")) {
      return
    }
    setOperationError(null)
    setClearing("all")
    try {
      await clearAllAttendance()
    } catch {
      setOperationError("Failed to clear all attendance records")
    } finally {
      setClearing(null)
    }
  }

  const handleClearEmployee = async (employeeId: string, employeeName: string) => {
    if (!confirm(`Are you sure you want to clear all attendance records for ${employeeName}? This cannot be undone.`)) {
      return
    }
    setOperationError(null)
    setClearing(employeeId)
    try {
      await clearEmployeeAttendance(employeeId)
    } catch {
      setOperationError(`Failed to clear attendance for ${employeeName}`)
    } finally {
      setClearing(null)
    }
  }

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this attendance record?")) {
      return
    }
    setOperationError(null)
    setProcessingRecord(recordId)
    try {
      await deleteAttendanceRecord(recordId)
    } catch {
      setOperationError("Failed to delete attendance record")
    } finally {
      setProcessingRecord(null)
    }
  }

  const startEditRecord = (recordId: string, currentStatus: "Present" | "Absent") => {
    setEditingRecordId(recordId)
    setEditStatus(currentStatus)
  }

  const cancelEdit = () => {
    setEditingRecordId(null)
  }

  const handleUpdateRecord = async (recordId: string) => {
    setOperationError(null)
    setProcessingRecord(recordId)
    try {
      await updateAttendanceRecord(recordId, { status: editStatus })
      setEditingRecordId(null)
    } catch {
      setOperationError("Failed to update attendance record")
    } finally {
      setProcessingRecord(null)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground mt-1">Track and manage employee attendance</p>
          </div>
          <div className="flex items-center gap-2">
            {attendanceRecords.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={clearing === "all"}
                className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {clearing === "all" ? "Clearing..." : "Clear All"}
              </button>
            )}
            <button
              onClick={() => setIsMarkModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              Mark Attendance
            </button>
          </div>
        </div>
      </div>

      {(error || operationError) && (
        <ErrorAlert title="Error" message={error || operationError || "An error occurred"} />
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by employee name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Attendance List */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-card rounded-lg border border-border">
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            title={searchTerm ? "No employees found" : "No employees available"}
            description={searchTerm ? "Try adjusting your search" : "Add employees first to track attendance"}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEmployees.map((employee) => {
            const employeeAttendance = getEmployeeAttendance(employee.employeeId)
            const { present, absent, total } = getAttendanceCounts(employee.employeeId)
            const expanded = isExpanded(employee.employeeId)
            
            return (
              <div
                key={employee.employeeId}
                className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleExpanded(employee.employeeId)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div className="text-muted-foreground transition-transform duration-200">
                      {expanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{employee.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                    </div>
                  </button>
                  
                  <div className="flex items-center gap-4">
                    {/* Attendance counts - always visible */}
                    {total > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-foreground font-medium">{present}</span>
                          <span className="text-muted-foreground">Present</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="text-foreground font-medium">{absent}</span>
                          <span className="text-muted-foreground">Absent</span>
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedEmployeeId(employee.employeeId)
                        setIsMarkModalOpen(true)
                      }}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-90 transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>

                {/* Collapsible content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  {employeeAttendance.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No attendance records yet</p>
                  ) : (
                    <div>
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => handleClearEmployee(employee.employeeId, employee.fullName)}
                          disabled={clearing === employee.employeeId}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-all duration-200 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          {clearing === employee.employeeId ? "Clearing..." : "Clear Records"}
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Date</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                              <th className="text-right py-2 px-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employeeAttendance.map((record) => {
                              const isEditing = editingRecordId === record._id
                              const isProcessing = processingRecord === record._id
                              
                              return (
                                <tr
                                  key={record._id}
                                  className="border-b border-border/50 hover:bg-muted/30 transition-colors duration-200"
                                >
                                  <td className="py-2 px-3 text-foreground">{new Date(record.date).toLocaleDateString()}</td>
                                  <td className="py-2 px-3">
                                    {isEditing ? (
                                      <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value as "Present" | "Absent")}
                                        className="px-2 py-1 rounded text-xs font-medium border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                      >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                      </select>
                                    ) : (
                                      <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                                          record.status === "Present"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}
                                      >
                                        {record.status}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      {isEditing ? (
                                        <>
                                          <button
                                            onClick={() => handleUpdateRecord(record._id!)}
                                            disabled={isProcessing}
                                            className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors disabled:opacity-50"
                                            title="Save"
                                          >
                                            <Check className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={cancelEdit}
                                            disabled={isProcessing}
                                            className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors disabled:opacity-50"
                                            title="Cancel"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => startEditRecord(record._id!, record.status)}
                                            disabled={isProcessing}
                                            className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors disabled:opacity-50"
                                            title="Edit"
                                          >
                                            <Pencil className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteRecord(record._id!)}
                                            disabled={isProcessing}
                                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Mark Attendance Modal */}
      {isMarkModalOpen && (
        <MarkAttendanceModal
          employees={employees}
          preSelectedEmployeeId={selectedEmployeeId}
          onClose={() => {
            setIsMarkModalOpen(false)
            setSelectedEmployeeId("")
          }}
          onSubmit={handleMarkAttendance}
        />
      )}
    </div>
  )
}
