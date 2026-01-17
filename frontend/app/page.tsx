"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import HomePage from "@/components/sections/home"
import EmployeeManagement from "@/components/sections/employee-management"
import AttendanceManagement from "@/components/sections/attendance-management"
import DepartmentManagement from "@/components/sections/department-management"

type Section = "home" | "employees" | "attendance" | "departments"

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("home")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {activeSection === "home" && <HomePage />}
            {activeSection === "employees" && <EmployeeManagement />}
            {activeSection === "departments" && <DepartmentManagement />}
            {activeSection === "attendance" && <AttendanceManagement />}
          </div>
        </main>
      </div>
    </div>
  )
}
