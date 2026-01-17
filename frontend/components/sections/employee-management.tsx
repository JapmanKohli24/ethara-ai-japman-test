"use client"

import { useState } from "react"
import { Plus, Trash2, Search } from "lucide-react"
import AddEmployeeModal from "@/components/modals/add-employee-modal"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorAlert } from "@/components/ui/error-alert"
import useEmployees from "@/hooks/use-employees"

export default function EmployeeManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [operationError, setOperationError] = useState<string | null>(null)
  const { employees, loading, error, addEmployee, deleteEmployee } = useEmployees()

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = async (data: {
    employeeId: string
    fullName: string
    email: string
    department: string
  }) => {
    setOperationError(null)
    try {
      await addEmployee(data)
      setIsAddModalOpen(false)
    } catch {
      setOperationError("Failed to add employee")
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    setOperationError(null)
    try {
      await deleteEmployee(employeeId)
    } catch {
      setOperationError("Failed to delete employee")
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground mt-1">Manage your organization's employees</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
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
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Employees Table */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-card rounded-lg border border-border">
          <EmptyState
            icon={<Plus className="w-12 h-12" />}
            title={searchTerm ? "No employees found" : "No employees yet"}
            description={searchTerm ? "Try adjusting your search" : "Add your first employee to get started"}
            action={{
              label: "Add Employee",
              onClick: () => setIsAddModalOpen(true),
            }}
          />
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Employee ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Full Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.employeeId}
                    className="border-b border-border hover:bg-muted/20 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{employee.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{employee.fullName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{employee.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{employee.department}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteEmployee(employee.employeeId)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Delete employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && <AddEmployeeModal onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddEmployee} />}
    </div>
  )
}
