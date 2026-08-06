// Initial Dataset for Jira Provisioning System

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    key: "PROJ-CORE",
    name: "Payment Gateway Core",
    description: "Core banking and checkout transaction engine.",
    category: "Financial Engineering",
    accessibleDashboards: 6,
    assignedUserIds: ["usr-1", "usr-2", "usr-3", "usr-5"],
    securityLevel: "Strict / Admin Only",
  },
  {
    id: "proj-2",
    key: "PROJ-MOB",
    name: "Mobile App V2",
    description: "Next-gen iOS & Android customer native application.",
    category: "Mobile Product",
    accessibleDashboards: 4,
    assignedUserIds: ["usr-2", "usr-4", "usr-6"],
    securityLevel: "Standard Restricted",
  },
  {
    id: "proj-3",
    key: "PROJ-CLOUD",
    name: "Cloud Infrastructure",
    description: "Kubernetes orchestration, Terraform IAC & AWS clusters.",
    category: "DevOps & Platform",
    accessibleDashboards: 8,
    assignedUserIds: ["usr-1", "usr-3"],
    securityLevel: "Mission Critical",
  },
  {
    id: "proj-4",
    key: "PROJ-DS",
    name: "Design System & UI",
    description: "Glitter Blue design tokens, React component libraries.",
    category: "Product Design",
    accessibleDashboards: 3,
    assignedUserIds: ["usr-4", "usr-5", "usr-6", "usr-7"],
    securityLevel: "Public Internal",
  },
  {
    id: "proj-5",
    key: "PROJ-AI",
    name: "AI Copilot Engine",
    description: "LLM integration pipeline and RAG search indexer.",
    category: "Data Science",
    accessibleDashboards: 5,
    assignedUserIds: ["usr-1", "usr-5", "usr-7"],
    securityLevel: "Restricted Confidential",
  }
];

export const INITIAL_PEOPLE = [
  {
    id: "usr-1",
    name: "Alex Rivera",
    email: "alex.rivera@jira.internal",
    role: "Senior Lead Architect",
    avatarBg: "bg-blue-600",
    accessibleProjectIds: ["proj-1", "proj-3", "proj-5"],
  },
  {
    id: "usr-2",
    name: "Sarah Chen",
    email: "sarah.chen@jira.internal",
    role: "Fullstack Engineer",
    avatarBg: "bg-purple-600",
    accessibleProjectIds: ["proj-1", "proj-2"],
  },
  {
    id: "usr-3",
    name: "Marcus Vance",
    email: "marcus.vance@jira.internal",
    role: "DevOps Lead",
    avatarBg: "bg-cyan-600",
    accessibleProjectIds: ["proj-1", "proj-3"],
  },
  {
    id: "usr-4",
    name: "Elena Rostova",
    email: "elena.rostova@jira.internal",
    role: "UI/UX Principal",
    avatarBg: "bg-emerald-600",
    accessibleProjectIds: ["proj-2", "proj-4"],
  },
  {
    id: "usr-5",
    name: "David Kim",
    email: "david.kim@jira.internal",
    role: "Backend Engineer",
    avatarBg: "bg-indigo-600",
    accessibleProjectIds: ["proj-1", "proj-4", "proj-5"],
  },
  {
    id: "usr-6",
    name: "Priya Sharma",
    email: "priya.sharma@jira.internal",
    role: "Product Manager",
    avatarBg: "bg-amber-600",
    accessibleProjectIds: ["proj-2", "proj-4"],
  },
  {
    id: "usr-7",
    name: "Lucas Bennett",
    email: "lucas.bennett@jira.internal",
    role: "QA Automation Specialist",
    avatarBg: "bg-teal-600",
    accessibleProjectIds: ["proj-4", "proj-5"],
  }
];

export const INITIAL_LOGS = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    actor: "Admin (Provisioning Master)",
    action: "ACCESS_GRANTED",
    targetPerson: "Alex Rivera",
    targetProject: "AI Copilot Engine",
    details: "Granted read/write access to AI Copilot Engine & 5 dashboards",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
    actor: "Admin (Provisioning Master)",
    action: "ADMIN_LOGIN",
    targetPerson: "System Admin",
    targetProject: "Security Vault",
    details: "Single Admin signed in via Glitter Blue Security Gateway",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    actor: "Admin (Provisioning Master)",
    action: "ACCESS_REVOKED",
    targetPerson: "Priya Sharma",
    targetProject: "Payment Gateway Core",
    details: "Revoked project access and associated dashboard permissions",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actor: "Admin (Provisioning Master)",
    action: "PROJECT_PROVISIONED",
    targetPerson: "System Admin",
    targetProject: "Design System & UI",
    details: "Provisioned new task project with 3 linked analytical dashboards",
    ipAddress: "192.168.1.100",
  }
];

// Helper functions for LocalStorage management
export const getStoredData = () => {
  if (typeof window === "undefined") {
    return { projects: INITIAL_PROJECTS, people: INITIAL_PEOPLE, logs: INITIAL_LOGS };
  }
  
  const projects = localStorage.getItem("jira_projects");
  const people = localStorage.getItem("jira_people");
  const logs = localStorage.getItem("jira_logs");

  return {
    projects: projects ? JSON.parse(projects) : INITIAL_PROJECTS,
    people: people ? JSON.parse(people) : INITIAL_PEOPLE,
    logs: logs ? JSON.parse(logs) : INITIAL_LOGS,
  };
};

export const saveStoredData = (projects, people, logs) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jira_projects", JSON.stringify(projects));
    localStorage.setItem("jira_people", JSON.stringify(people));
    localStorage.setItem("jira_logs", JSON.stringify(logs));
  }
};
