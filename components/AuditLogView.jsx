"use client";

import React, { useState } from "react";
import { 
  History, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  Sparkles, 
  Download,
  AlertCircle 
} from "lucide-react";
import Modal from "./Modal";
import { ACTION_META, ACTION_TYPES } from "../lib/audit";
import { formatTimestamp, matchesQuery } from "../lib/format";

export default function AuditLogView({ logs, onClearLogs }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      matchesQuery(log.targetPerson, searchTerm) ||
      matchesQuery(log.targetProject, searchTerm) ||
      matchesQuery(log.details, searchTerm) ||
      matchesQuery(log.actor, searchTerm) ||
      matchesQuery(log.action, searchTerm);

    const matchesAction = filterAction === "ALL" || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action) => {
    const meta = ACTION_META[action];
    const label = meta?.label || action;
    const pillClass = meta?.pillClass || "info";

    switch (action) {
      case ACTION_TYPES.ACCESS_GRANTED:
        return (
          <span className={`pill ${pillClass}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {label}
          </span>
        );
      case ACTION_TYPES.ACCESS_REVOKED:
        return (
          <span className={`pill ${pillClass}`}>
            <XCircle className="w-3.5 h-3.5" />
            {label}
          </span>
        );
      case ACTION_TYPES.ADMIN_LOGIN:
        return (
          <span className={`pill ${pillClass}`}>
            <Shield className="w-3.5 h-3.5" />
            {label}
          </span>
        );
      default:
        return (
          <span className={`pill ${pillClass}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {label}
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ["Timestamp", "Action Event", "Actor", "Target Person", "Target Project", "Details", "IP Address"];
    const rows = logs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.action}"`,
      `"${log.actor}"`,
      `"${log.targetPerson}"`,
      `"${log.targetProject}"`,
      `"${(log.details || "").replace(/"/g, '""')}"`,
      `"${log.ipAddress || "—"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jira_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header & Controls */}
      <div className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="pill primary mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text)]">System Audit Logs</h2>
          <p className="text-xs text-[var(--text-2)] mt-1">Real-time chronicle of administrator actions, provisioning events, and permission shifts.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Action Filter */}
          <div className="field !mb-0 min-w-[150px]">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="!py-1.5 !px-3 text-xs"
            >
              <option value="ALL">All Event Types</option>
              {Object.entries(ACTION_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="search">
            <Search className="w-3.5 h-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail..."
            />
          </div>

          {/* Export CSV Button */}
          {logs.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="btn btn-ghost btn-sm"
              title="Export Audit Log CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          )}

          {/* Clear Logs */}
          {logs.length > 0 && (
            <button
              onClick={() => setIsConfirmClearOpen(true)}
              title="Clear audit log history"
              className="btn btn-danger btn-sm"
              aria-label="Clear audit log history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Logs Table Container */}
      <div className="table overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action Event</th>
                <th>Target Person</th>
                <th>Task Project</th>
                <th>Details & Payload</th>
                <th>Actor</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-elev)] transition-colors">
                    <td className="font-mono text-[var(--text-3)] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="font-bold text-[var(--text)] whitespace-nowrap">
                      {log.targetPerson}
                    </td>
                    <td className="text-[var(--primary)] font-semibold whitespace-nowrap">
                      {log.targetProject}
                    </td>
                    <td className="text-[var(--text-2)] max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="font-mono text-[var(--text-3)] text-[11px] whitespace-nowrap">
                      {log.actor}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-3)]">
                    No matching audit log entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Logs */}
      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        title="Confirm Log Archival"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--risk-soft)] border border-[var(--risk)] text-xs text-[var(--risk)]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="leading-snug">
              Are you sure you want to clear all <strong>{logs.length}</strong> audit log records? An archival entry will be recorded in the system audit trail.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={() => setIsConfirmClearOpen(false)} className="btn btn-ghost btn-sm">
              Cancel
            </button>
            <button
              onClick={() => {
                onClearLogs();
                setIsConfirmClearOpen(false);
              }}
              className="btn btn-danger btn-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirm Clear</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
