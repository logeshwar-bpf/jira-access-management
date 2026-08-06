"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Layers, 
  Users, 
  LayoutDashboard, 
  History, 
  LogOut, 
  Search, 
  Plus, 
  Sparkles, 
  ChevronRight,
  UserCheck
} from "lucide-react";
import ProjectDrawer from "./ProjectDrawer";
import UserDrawer from "./UserDrawer";
import AuditLogView from "./AuditLogView";
import ThemeToggle from "./ThemeToggle";

export default function Dashboard({ 
  adminUser, 
  projects, 
  people, 
  logs, 
  onLogout, 
  onToggleAccess,
  onClearLogs,
  onAddProject,
  onAddUser
}) {
  const [activeTab, setActiveTab] = useState("projects"); // 'projects' | 'people' | 'audit'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Metrics
  const totalProjects = projects.length;
  const totalPeople = people.length;
  
  const totalDashboardAccessPoints = people.reduce((acc, user) => {
    const userProjects = projects.filter((p) => user.accessibleProjectIds?.includes(p.id));
    const userDashboards = userProjects.reduce((sum, p) => sum + (p.accessibleDashboards || 0), 0);
    return acc + userDashboards;
  }, 0);

  // Filtered Lists
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPeople = people.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "AD";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="app">
      {/* GLOBAL IAM STYLED SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">◆</div>
          <div>
            <div className="brand-name">Jira Access</div>
            <div className="brand-sub">Bipolar Factory</div>
          </div>
        </div>

        {/* Navigation items matching Global IAM */}
        <nav className="nav">
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
          >
            <Layers className="w-4 h-4" />
            <span>Task Projects</span>
            <span className="nav-count primary">{totalProjects}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("people")}
            className={`nav-item ${activeTab === "people" ? "active" : ""}`}
          >
            <Users className="w-4 h-4" />
            <span>People Matrix</span>
            <span className="nav-count primary">{totalPeople}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`nav-item ${activeTab === "audit" ? "active" : ""}`}
          >
            <History className="w-4 h-4" />
            <span>Audit Log</span>
            <span className="nav-count warn">{logs.length}</span>
          </button>
        </nav>

        <div className="sidebar-foot">
          <ThemeToggle />

          <div className="user-card">
            <div className="avatar sm" style={{ background: "var(--primary)", color: "#fff", fontWeight: 800 }}>
              {getInitials(adminUser?.name)}
            </div>
            <div className="user-meta">
              <div className="user-email">{adminUser?.name || "System Admin"}</div>
              <div className="user-roles">{adminUser?.role || "Provisioning Admin"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="main">
        
        {/* TOPBAR HEADER */}
        <header className="topbar">
          <div>
            <h1 className="topbar-title">JIRA PROVISIONING</h1>
            <p className="topbar-sub">Unified Access & Project Provisioning Console</p>
          </div>

          <div className="topbar-actions">
            {activeTab !== "audit" && (
              <div className="search">
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={activeTab === "projects" ? "Filter projects..." : "Filter people..."}
                />
              </div>
            )}

            {activeTab === "projects" && (
              <button onClick={onAddProject} className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            )}

            {activeTab === "people" && (
              <button onClick={onAddUser} className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4" />
                <span>Add Person</span>
              </button>
            )}

            <button onClick={onLogout} className="btn btn-ghost btn-sm">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div className="content">
          
          {/* STAT METRICS CARDS */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Task Projects</span>
                <div className="stat-chip primary">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="stat-num">{totalProjects}</div>
              <div className="stat-foot">Allocated across {totalPeople} users</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Total People</span>
                <div className="stat-chip ok">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="stat-num">{totalPeople}</div>
              <div className="stat-foot ok">100% Admin Managed</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Dashboard Views</span>
                <div className="stat-chip primary">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
              </div>
              <div className="stat-num">{totalDashboardAccessPoints}</div>
              <div className="stat-foot">Avg ~{Math.round(totalDashboardAccessPoints / (totalPeople || 1))} per user</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Audit Logs</span>
                <div className="stat-chip warn">
                  <History className="w-4 h-4" />
                </div>
              </div>
              <div className="stat-num">{logs.length}</div>
              <div className="stat-foot warn">Real-time recording</div>
            </div>
          </div>

          {/* TAB CONTENT 1: PROJECTS */}
          {activeTab === "projects" && (
            <div>
              <div className="section-title">Projects Directory</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project) => {
                  const assignedCount = people.filter((p) => p.accessibleProjectIds?.includes(project.id)).length;

                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="card cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="badge role font-mono">{project.key}</span>
                          <span className="badge">{project.category}</span>
                        </div>

                        <h3 className="text-base font-bold group-hover:text-[var(--primary)] transition-colors flex items-center justify-between">
                          <span>{project.name}</span>
                          <ChevronRight className="w-4 h-4 text-[var(--text-3)] group-hover:translate-x-1 transition-transform" />
                        </h3>

                        <p className="text-xs text-[var(--text-2)] mt-2 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[var(--text-3)] text-[11px] block">Assigned People</span>
                          <span className="font-bold text-[var(--text)] flex items-center gap-1 mt-0.5">
                            <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                            {assignedCount} People
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--text-3)] text-[11px] block">Dashboards</span>
                          <span className="font-bold text-[var(--text)] flex items-center gap-1 mt-0.5">
                            <LayoutDashboard className="w-3.5 h-3.5 text-[var(--info)]" />
                            {project.accessibleDashboards} Views
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: PEOPLE */}
          {activeTab === "people" && (
            <div>
              <div className="section-title">Access Matrix & Directory</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPeople.map((user) => {
                  const userProjects = user.accessibleProjectIds || [];
                  const userDashboardCount = projects
                    .filter((p) => userProjects.includes(p.id))
                    .reduce((sum, p) => sum + (p.accessibleDashboards || 0), 0);

                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="card cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-11 h-11 rounded-xl ${user.avatarBg || "bg-[#5B5BD6]"} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold truncate group-hover:text-[var(--primary)] transition-colors">
                              {user.name}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-[var(--text-3)] group-hover:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-xs text-[var(--primary)] font-semibold mt-0.5">{user.role}</p>
                          <p className="text-xs text-[var(--text-3)] truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2 rounded-xl bg-[var(--bg-elev)] border border-[var(--border)]">
                          <span className="text-[11px] text-[var(--text-3)] block">Projects</span>
                          <span className="font-extrabold text-[var(--text)] flex items-center gap-1 mt-0.5">
                            <Layers className="w-3.5 h-3.5 text-[var(--primary)]" />
                            {userProjects.length} Projects
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-[var(--bg-elev)] border border-[var(--border)]">
                          <span className="text-[11px] text-[var(--text-3)] block">Dashboards</span>
                          <span className="font-extrabold text-[var(--text)] flex items-center gap-1 mt-0.5">
                            <LayoutDashboard className="w-3.5 h-3.5 text-[var(--info)]" />
                            {userDashboardCount} Views
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div>
              <AuditLogView logs={logs} onClearLogs={onClearLogs} />
            </div>
          )}

        </div>

      </main>

      {/* DRAWERS & MODALS */}
      {selectedProject && (
        <ProjectDrawer
          project={selectedProject}
          people={people}
          onClose={() => setSelectedProject(null)}
          onToggleAccess={onToggleAccess}
        />
      )}

      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          projects={projects}
          onClose={() => setSelectedUser(null)}
          onToggleAccess={onToggleAccess}
        />
      )}

    </div>
  );
}
