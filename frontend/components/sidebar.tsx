"use client"

import { useState } from "react"
import { Users, Calendar, Home, ChevronLeft, ChevronRight, Building2 } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: "home" | "employees" | "attendance" | "departments") => void
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: Calendar,
    },
    {
      id: "departments",
      label: "Departments",
      icon: Building2,
    },
  ]

  return (
    <aside
      className={`border-r border-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        {!isCollapsed && (
          <>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-primary">Ethara AI</h1>
              <p className="text-sm text-sidebar-foreground/60">Made by Japman Singh Kohli</p>
            </div>
          </>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:text-sidebar-primary transition-colors p-1"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id as "home" | "employees" | "attendance" | "departments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
          <p>Ethara AI HRMS</p>
        </div>
      )}
    </aside>
  )
}
