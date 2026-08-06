"use client";

import React, { useState, useEffect } from "react";
import SignInPage from "../components/SignInPage";
import Dashboard from "../components/Dashboard";
import { getStoredData, saveStoredData } from "../lib/mockData";

export default function Page() {
  const [adminUser, setAdminUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize data from LocalStorage or Default Mock Data
  useEffect(() => {
    const data = getStoredData();
    setProjects(data.projects);
    setPeople(data.people);
    setLogs(data.logs);

    const storedAdmin = localStorage.getItem("jira_admin_user");
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        if (parsed && parsed.email === "admin@jira.internal" && parsed.role === "System Master Admin") {
          setAdminUser(parsed);
        } else {
          localStorage.removeItem("jira_admin_user");
        }
      } catch (e) {
        localStorage.removeItem("jira_admin_user");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save changes to local storage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      saveStoredData(projects, people, logs);
    }
  }, [projects, people, logs, isLoaded]);

  // Handle Admin Sign In
  const handleLoginSuccess = (userPayload) => {
    setAdminUser(userPayload);
    if (typeof window !== "undefined") {
      localStorage.setItem("jira_admin_user", JSON.stringify(userPayload));
    }

    // Append Login Audit Log
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "Admin (Provisioning Master)",
      action: "ADMIN_LOGIN",
      targetPerson: userPayload.name,
      targetProject: "Security Vault",
      details: "Single Admin authenticated via Glitter Blue Security Gateway",
      ipAddress: "192.168.1.104",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Handle Logout
  const handleLogout = () => {
    setAdminUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("jira_admin_user");
    }
  };

  // Handle Granting or Revoking Access
  const handleToggleAccess = (userId, projectId, actionType) => {
    const targetUser = people.find((p) => p.id === userId);
    const targetProject = projects.find((p) => p.id === projectId);

    if (!targetUser || !targetProject) return;

    const userHasAccess = (targetUser.accessibleProjectIds || []).includes(projectId);
    let updatedPeople = [...people];
    let updatedProjects = [...projects];

    if (actionType === "GRANT") {
      if (userHasAccess) return; // No-op, already granted

      // Add projectId to user
      updatedPeople = updatedPeople.map((u) => {
        if (u.id === userId) {
          const ids = u.accessibleProjectIds || [];
          if (!ids.includes(projectId)) {
            return { ...u, accessibleProjectIds: [...ids, projectId] };
          }
        }
        return u;
      });

      // Add userId to project
      updatedProjects = updatedProjects.map((p) => {
        if (p.id === projectId) {
          const ids = p.assignedUserIds || [];
          if (!ids.includes(userId)) {
            return { ...p, assignedUserIds: [...ids, userId] };
          }
        }
        return p;
      });

      // Add Audit Log
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: adminUser?.name || "Admin (Provisioning Master)",
        action: "ACCESS_GRANTED",
        targetPerson: targetUser.name,
        targetProject: targetProject.name,
        details: `Granted access to ${targetProject.name} (${targetProject.accessibleDashboards} dashboards)`,
        ipAddress: "192.168.1.104",
      };
      setLogs((prev) => [newLog, ...prev]);

    } else if (actionType === "REVOKE") {
      if (!userHasAccess) return; // No-op, already revoked

      // Remove projectId from user
      updatedPeople = updatedPeople.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            accessibleProjectIds: (u.accessibleProjectIds || []).filter((id) => id !== projectId),
          };
        }
        return u;
      });

      // Remove userId to project
      updatedProjects = updatedProjects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            assignedUserIds: (p.assignedUserIds || []).filter((id) => id !== userId),
          };
        }
        return p;
      });

      // Add Audit Log
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: adminUser?.name || "Admin (Provisioning Master)",
        action: "ACCESS_REVOKED",
        targetPerson: targetUser.name,
        targetProject: targetProject.name,
        details: `Revoked access to ${targetProject.name} & associated dashboard permissions`,
        ipAddress: "192.168.1.104",
      };
      setLogs((prev) => [newLog, ...prev]);
    }

    setPeople(updatedPeople);
    setProjects(updatedProjects);
  };

  // Clear Audit Logs
  const handleClearLogs = () => {
    setLogs([]);
  };

  // Dynamic Add Project
  const handleAddProject = () => {
    const name = prompt("Enter new Task Project Name:");
    if (!name || !name.trim()) return;

    const key = prompt("Enter Project Key (e.g. PROJ-NEW):", `PROJ-${Math.floor(100 + Math.random() * 900)}`);
    if (!key || !key.trim()) return;

    const dashboardsStr = prompt("Enter number of accessible dashboards for this project:", "4");
    const dashboards = parseInt(dashboardsStr) || 3;

    const newProject = {
      id: `proj-${Date.now()}`,
      key: key.trim().toUpperCase(),
      name: name.trim(),
      description: "Custom provisioned task project with analytical dashboards.",
      category: "Internal Operations",
      accessibleDashboards: dashboards,
      assignedUserIds: [],
      securityLevel: "Standard Internal",
    };

    setProjects((prev) => [newProject, ...prev]);

    // Log event
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "Admin (Provisioning Master)",
      action: "PROJECT_PROVISIONED",
      targetPerson: adminUser?.name || "System Admin",
      targetProject: newProject.name,
      details: `Provisioned new Task Project '${newProject.name}' with ${dashboards} linked dashboards`,
      ipAddress: "192.168.1.104",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Dynamic Add User
  const handleAddUser = () => {
    const name = prompt("Enter Person Full Name:");
    if (!name || !name.trim()) return;

    const email = prompt("Enter Email address:", `${name.toLowerCase().replace(/\s+/g, ".")}@jira.internal`);
    if (!email || !email.trim()) return;

    const role = prompt("Enter Job Title / Role:", "Software Engineer");
    const validRole = (role && role.trim()) ? role.trim() : "Team Member";

    const colorBgs = ["bg-purple-600", "bg-[#0052cc]", "bg-[#0070f3]", "bg-teal-600", "bg-rose-600", "bg-amber-600"];
    const randomBg = colorBgs[Math.floor(Math.random() * colorBgs.length)];

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: validRole,
      avatarBg: randomBg,
      accessibleProjectIds: [],
    };

    setPeople((prev) => [newUser, ...prev]);

    // Log event
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "Admin (Provisioning Master)",
      action: "USER_CREATED",
      targetPerson: newUser.name,
      targetProject: "User Directory",
      details: `Registered new user '${newUser.name}' (${newUser.role}) in directory`,
      ipAddress: "192.168.1.104",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-[#1A1A19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Initializing Jira Provisioning Engine...</span>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <SignInPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Dashboard
      adminUser={adminUser}
      projects={projects}
      people={people}
      logs={logs}
      onLogout={handleLogout}
      onToggleAccess={handleToggleAccess}
      onClearLogs={handleClearLogs}
      onAddProject={handleAddProject}
      onAddUser={handleAddUser}
    />
  );
}
