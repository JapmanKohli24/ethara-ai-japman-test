"use client"

import { useState, useMemo } from "react"
import { Plus, Calendar, Users, UserCheck, UserX } from "lucide-react"
import useEmployees from "@/hooks/use-employees"
import useAttendance from "@/hooks/use-attendance"
import AddEmployeeModal from "@/components/modals/add-employee-modal"
import QuickAttendanceModal from "@/components/modals/quick-attendance-modal"
import { ErrorAlert } from "@/components/ui/error-alert"

export default function HomePage() {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isQuickAttendanceOpen, setIsQuickAttendanceOpen] = useState(false)
  const [addEmployeeError, setAddEmployeeError] = useState<string | null>(null)
  const [attendanceError, setAttendanceError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const { employees, addEmployee } = useEmployees()
  const { attendanceRecords, markAttendance } = useAttendance()

  // Get attendance for selected date
  const attendanceByDate = useMemo(() => {
    const selectedDateObj = new Date(selectedDate)
    selectedDateObj.setHours(0, 0, 0, 0)
    
    return attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === selectedDateObj.getTime()
    })
  }, [attendanceRecords, selectedDate])

  // Get employee details for each attendance record
  const attendanceWithDetails = useMemo(() => {
    return attendanceByDate.map((record) => {
      const employee = employees.find((e) => e.employeeId === record.employeeId)
      return {
        ...record,
        fullName: employee?.fullName || record.employeeId,
        department: employee?.department || "Unknown",
      }
    })
  }, [attendanceByDate, employees])

  const presentEmployees = attendanceWithDetails.filter((r) => r.status === "Present")
  const absentEmployees = attendanceWithDetails.filter((r) => r.status === "Absent")

  const handleAddEmployee = async (data: {
    employeeId: string
    fullName: string
    email: string
    department: string
  }) => {
    setAddEmployeeError(null)
    try {
      await addEmployee(data)
      setIsAddEmployeeOpen(false)
    } catch {
      setAddEmployeeError("Failed to add employee")
    }
  }

  const handleMarkAttendance = async (data: {
    employeeId: string
    date: string
    status: "Present" | "Absent"
  }) => {
    setAttendanceError(null)
    try {
      await markAttendance(data)
      setIsQuickAttendanceOpen(false)
    } catch {
      setAttendanceError("Failed to mark attendance")
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-5xl font-bold text-foreground mb-2">Welcome to Ethara AI HRMS</h1>
      </div>

      {addEmployeeError && <ErrorAlert title="Error" message={addEmployeeError} />}
      {attendanceError && <ErrorAlert title="Error" message={attendanceError} />}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Employee Card */}
        <button
          onClick={() => setIsAddEmployeeOpen(true)}
          className="group relative overflow-hidden bg-card border border-border rounded-xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">Add Employee</h2>
              <p className="text-muted-foreground">Quickly add a new team member to your organization</p>
            </div>
          </div>
        </button>

        {/* Update Attendance Card */}
        <button
          onClick={() => setIsQuickAttendanceOpen(true)}
          className="group relative overflow-hidden bg-card border border-border rounded-xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">Mark Attendance</h2>
              <p className="text-muted-foreground">Update attendance for an employee today</p>
            </div>
          </div>
        </button>
      </div>

      {/* Attendance by Date Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Attendance by Date</h2>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>

        {attendanceByDate.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No data available!</p>
            <p className="text-sm text-muted-foreground mt-1">
              No attendance records found for {new Date(selectedDate).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Present Employees */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-green-800 dark:text-green-300">
                  Present ({presentEmployees.length})
                </h3>
              </div>
              {presentEmployees.length === 0 ? (
                <p className="text-sm text-green-600 dark:text-green-400">No employees marked present</p>
              ) : (
                <ul className="space-y-2">
                  {presentEmployees.map((record) => (
                    <li
                      key={record._id || record.employeeId}
                      className="flex items-center justify-between py-2 px-3 bg-white dark:bg-green-900/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{record.fullName}</p>
                        <p className="text-xs text-muted-foreground">{record.department}</p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Absent Employees */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Absent ({absentEmployees.length})
                </h3>
              </div>
              {absentEmployees.length === 0 ? (
                <p className="text-sm text-red-600 dark:text-red-400">No employees marked absent</p>
              ) : (
                <ul className="space-y-2">
                  {absentEmployees.map((record) => (
                    <li
                      key={record._id || record.employeeId}
                      className="flex items-center justify-between py-2 px-3 bg-white dark:bg-red-900/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{record.fullName}</p>
                        <p className="text-xs text-muted-foreground">{record.department}</p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddEmployeeOpen && (
        <AddEmployeeModal onClose={() => setIsAddEmployeeOpen(false)} onSubmit={handleAddEmployee} />
      )}
      {isQuickAttendanceOpen && (
        <QuickAttendanceModal onClose={() => setIsQuickAttendanceOpen(false)} onSubmit={handleMarkAttendance} />
      )}
    </div>
  )
}
