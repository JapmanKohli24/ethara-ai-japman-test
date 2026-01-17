"use client"

import { useState } from "react"
import { Plus, Trash2, Search, Building2, RotateCcw } from "lucide-react"
import AddDepartmentModal from "@/components/modals/add-department-modal"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorAlert } from "@/components/ui/error-alert"
import useDepartments from "@/hooks/use-departments"

export default function DepartmentManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [operationError, setOperationError] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const { departments, loading, error, addDepartment, deleteDepartment, seedDepartments } = useDepartments()

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddDepartment = async (data: {
    name: string
    description?: string
  }) => {
    setOperationError(null)
    try {
      await addDepartment(data)
      setIsAddModalOpen(false)
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "Failed to add department")
    }
  }

  const handleDeleteDepartment = async (name: string) => {
    setOperationError(null)
    try {
      await deleteDepartment(name)
    } catch {
      setOperationError("Failed to delete department")
    }
  }

  const handleSeedDepartments = async () => {
    setOperationError(null)
    setSeeding(true)
    try {
      await seedDepartments()
    } catch {
      setOperationError("Failed to load default departments")
    } finally {
      setSeeding(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground mt-1">Manage your organization's departments</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Department
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
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Departments Grid */}
      {filteredDepartments.length === 0 ? (
        <div className="bg-card rounded-lg border border-border">
          <EmptyState
            icon={<Building2 className="w-12 h-12" />}
            title={searchTerm ? "No departments found" : "No departments yet"}
            description={searchTerm ? "Try adjusting your search" : "Add your first department or load defaults to get started"}
            action={{
              label: "Add Department",
              onClick: () => setIsAddModalOpen(true),
            }}
          />
          {!searchTerm && departments.length === 0 && (
            <div className="flex justify-center pb-6">
              <button
                onClick={handleSeedDepartments}
                disabled={seeding}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} />
                {seeding ? "Loading..." : "Load Default Departments"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((department) => (
            <div
              key={department.name}
              className="bg-card rounded-lg border border-border p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-md group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{department.name}</h3>
                    {department.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{department.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDepartment(department.name)}
                  className="text-destructive hover:bg-destructive/10 p-2 rounded transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                  title="Delete department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {isAddModalOpen && <AddDepartmentModal onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddDepartment} />}
    </div>
  )
}
