"use client"

import { useState } from "react"

import Dashboard from "../../components/Dashboard/Dashboard.jsx"



import "./Dashboardmain.css"

function DashboardPage() {
  const [workspaces, setWorkspaces] = useState([
    { id: "ws1", name: "Personal", remainingBoards: 3 },
    { id: "ws2", name: "Work", remainingBoards: 3 }
  ])

  const [boards, setBoards] = useState([
    { id: "b1", name: "Project A", workspaceId: "ws1" },
    { id: "b2", name: "Project B", workspaceId: "ws2" }
  ])

  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]?.id || null)

  return (
    <div className="app">
      <Dashboard
        workspaces={workspaces}
        setWorkspaces={setWorkspaces} // ✅ Pass setWorkspaces
        boards={boards} // ✅ Pass full boards list (not filtered)
        setBoards={setBoards} // ✅ Pass setBoards
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={setActiveWorkspace}
      />
    </div>
  )
}

export default DashboardPage