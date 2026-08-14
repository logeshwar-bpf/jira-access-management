"use client";

import React, { useState } from "react";
import { 
  Layers, 
  Users, 
  LayoutDashboard, 
  History, 
  LogOut, 
  Search, 
  Plus, 
  ChevronRight,
  Menu,
  X,
  Trash2,
  AlertCircle
} from "lucide-react";
import ProjectDrawer from "./ProjectDrawer";
import UserDrawer from "./UserDrawer";
import AuditLogView from "./AuditLogView";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";
import AddProjectModal from "./AddProjectModal";
import AddUserModal from "./AddUserModal";
import Modal from "./Modal";
import { matchesQuery } from "../lib/format";

export default function Dashboard({ 
  adminUser, 
  projects, 
  people, 
  logs, 
  onLogout, 
  onToggleAccess,
  onClearLogs,
  onCreateProject,
  onCreateUser,
  onDeleteProject,
  onDeleteUser
}) {
  const [activeTab, setActiveTab] = useState("projects"); // 'projects' | 'people' | 'audit'
  
  // Stored as IDs to derive live objects on render (prevents stale drawer state)
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal Dialog States
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'project' | 'user', id, name }

  // Derived active items (always fresh)
  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
  const selectedUser = people.find((u) => u.id === selectedUserId) ?? null;

  // Tab change handler resets search query
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  // Metrics
  const totalProjects = projects.length;
  const totalPeople = people.length;
  
  // Total permission points (sum of accessible dashboards across assigned user permissions)
  const totalPermissionPoints = people.reduce((acc, user) => {
    const userProjects = projects.filter((p) => user.accessibleProjectIds?.includes(p.id));
    const userDashboards = userProjects.reduce((sum, p) => sum + (p.accessibleDashboards || 0), 0);
    return acc + userDashboards;
  }, 0);

  // Filtered Lists using safe query matcher
  const filteredProjects = projects.filter(
    (p) =>
      matchesQuery(p.name, searchTerm) ||
      matchesQuery(p.key, searchTerm) ||
      matchesQuery(p.category, searchTerm) ||
      matchesQuery(p.description, searchTerm)
  );

  const filteredPeople = people.filter(
    (u) =>
      matchesQuery(u.name, searchTerm) ||
      matchesQuery(u.email, searchTerm) ||
      matchesQuery(u.role, searchTerm)
  );

  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === "project") {
      onDeleteProject(itemToDelete.id);
      if (selectedProjectId === itemToDelete.id) setSelectedProjectId(null);
    } else if (itemToDelete.type === "user") {
      onDeleteUser(itemToDelete.id);
      if (selectedUserId === itemToDelete.id) setSelectedUserId(null);
    }
    setItemToDelete(null);
  };

  return (
    <div className="app">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-overlay mobile-open" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="brand">
            <div className="brand-logo">◆</div>
            <div>
              <div className="brand-name">Jira Access</div>
              <div className="brand-sub">Bipolar Factory</div>
            </div>
          </div>
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-ghost btn-sm md:hidden p-1"
              aria-label="Close sidebar menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="nav">
          <button
            type="button"
            onClick={() => handleTabChange("projects")}
            className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
          >
            <Layers className="w-4 h-4" />
            <span>Task Projects</span>
            <span className="nav-count primary">{totalProjects}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("people")}
            className={`nav-item ${activeTab === "people" ? "active" : ""}`}
          >
            <Users className="w-4 h-4" />
            <span>People Matrix</span>
            <span className="nav-count primary">{totalPeople}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("audit")}
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
            <Avatar name={adminUser?.name || "Provisioning Admin"} bg="var(--primary)" size="sm" />
            <div className="user-meta">
              <div className="user-email">{adminUser?.name || "Provisioning Admin"}</div>
              <div className="user-roles">{adminUser?.role || "System Admin"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="main">
        {/* TOPBAR HEADER */}
        <header className="topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-ghost btn-sm md:hidden p-1.5"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="topbar-title">JIRA PROVISIONING</h1>
              <p className="topbar-sub">Unified Access & Project Provisioning Console</p>
            </div>
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
              <button onClick={() => setIsAddProjectOpen(true)} className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            )}

            {activeTab === "people" && (
              <button onClick={() => setIsAddUserOpen(true)} className="btn btn-primary btn-sm">
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
                <span>Dashboard Access Points</span>
                <div className="stat-chip primary">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
              </div>
              <div className="stat-num">{totalPermissionPoints}</div>
              <div className="stat-foot">Avg ~{Math.round(totalPermissionPoints / (totalPeople || 1))} per user</div>
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
              <div className="tab-header">
                <div className="section-title !mb-0">Projects Directory</div>
                <span className="count-badge">
                  Showing {filteredProjects.length} of {projects.length}
                </span>
              </div>

              {filteredProjects.length > 0 ? (
                <div className="cards-grid">
                  {filteredProjects.map((project) => {
                    const assignedCount = people.filter((p) => p.accessibleProjectIds?.includes(project.id)).length;

                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                        className="project-card"
                      >
                        <div>
                          <div className="project-card-top">
                            <div className="project-card-badges">
                              <span className="badge role font-mono">{project.key}</span>
                              <span className="badge">{project.category}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete({ type: "project", id: project.id, name: project.name });
                              }}
                              className="icon-btn-danger"
                              title="Decommission project"
                              aria-label={`Delete project ${project.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="project-card-body">
                            <h3 className="project-card-title">
                              <span>{project.name}</span>
                              <ChevronRight className="project-chevron" />
                            </h3>
                            <p className="project-card-desc">{project.description}</p>
                          </div>
                        </div>

                        <div className="project-card-metrics">
                          <div className="metric-capsule">
                            <span className="metric-capsule-lbl">Assigned Team</span>
                            <span className="metric-capsule-val">
                              <Users className="metric-icon primary" />
                              {assignedCount} People
                            </span>
                          </div>
                          <div className="metric-capsule">
                            <span className="metric-capsule-lbl">Dashboards</span>
                            <span className="metric-capsule-val">
                              <LayoutDashboard className="metric-icon info" />
                              {project.accessibleDashboards} Views
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-filter-state">
                  <Search className="empty-filter-icon" />
                  <p className="empty-filter-title">No projects match &quot;{searchTerm}&quot;</p>
                  <p className="empty-filter-sub">Try refining your search terms or provision a new task project.</p>
                  <button onClick={() => setSearchTerm("")} className="btn btn-ghost btn-sm mt-2">
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 2: PEOPLE */}
          {activeTab === "people" && (
            <div>
              <div className="tab-header">
                <div className="section-title !mb-0">Access Matrix & Directory</div>
                <span className="count-badge">
                  Showing {filteredPeople.length} of {people.length}
                </span>
              </div>

              {filteredPeople.length > 0 ? (
                <div className="cards-grid">
                  {filteredPeople.map((user) => {
                    const userProjects = user.accessibleProjectIds || [];
                    const userDashboardCount = projects
                      .filter((p) => userProjects.includes(p.id))
                      .reduce((sum, p) => sum + (p.accessibleDashboards || 0), 0);

                    return (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className="people-card"
                      >
                        <div className="people-card-top">
                          <Avatar name={user.name} bg={user.avatarBg} size="lg" />

                          <div className="people-card-info">
                            <div className="people-card-header-row">
                              <h3 className="people-card-name">{user.name}</h3>
                              <div className="people-card-actions">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setItemToDelete({ type: "user", id: user.id, name: user.name });
                                  }}
                                  className="icon-btn-danger"
                                  title="Remove team member"
                                  aria-label={`Delete user ${user.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <ChevronRight className="project-chevron" />
                              </div>
                            </div>
                            <div className="people-card-role-row">
                              <span className="badge role">{user.role}</span>
                            </div>
                            <div className="people-card-email">{user.email}</div>
                          </div>
                        </div>

                        <div className="project-card-metrics">
                          <div className="metric-capsule">
                            <span className="metric-capsule-lbl">Assigned Projects</span>
                            <span className="metric-capsule-val">
                              <Layers className="metric-icon primary" />
                              {userProjects.length} Projects
                            </span>
                          </div>

                          <div className="metric-capsule">
                            <span className="metric-capsule-lbl">Dashboard Access</span>
                            <span className="metric-capsule-val">
                              <LayoutDashboard className="metric-icon info" />
                              {userDashboardCount} Views
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-filter-state">
                  <Search className="empty-filter-icon" />
                  <p className="empty-filter-title">No team members match &quot;{searchTerm}&quot;</p>
                  <p className="empty-filter-sub">Try adjusting your search filter or register a new team member.</p>
                  <button onClick={() => setSearchTerm("")} className="btn btn-ghost btn-sm mt-2">
                    Clear Filter
                  </button>
                </div>
              )}
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
          onClose={() => setSelectedProjectId(null)}
          onToggleAccess={onToggleAccess}
        />
      )}

      {selectedUser && (
        <UserDrawer
          user={people.find((p) => p.id === selectedUser.id) || selectedUser}
          projects={projects}
          onClose={() => setSelectedUserId(null)}
          onToggleAccess={onToggleAccess}
        />
      )}

      {/* Creation Modals */}
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onSubmit={onCreateProject}
        existingProjects={projects}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSubmit={onCreateUser}
        existingPeople={people}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title={`Confirm Deletion`}
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--risk-soft)] border border-[var(--risk)] text-xs text-[var(--risk)]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="leading-snug">
              Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={() => setItemToDelete(null)} className="btn btn-ghost btn-sm">
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger btn-sm">
              <Trash2 className="w-4 h-4" />
              <span>Confirm Delete</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
