"use client";

import React, { useState } from "react";
import { History, Shield, CheckCircle2, XCircle, Clock, Filter, Search, Trash2, Sparkles } from "lucide-react";

export default function AuditLogView({ logs, onClearLogs }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.targetPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === "ALL" || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case "ACCESS_GRANTED":
        return (
          <span className="pill approved">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Access Granted
          </span>
        );
      case "ACCESS_REVOKED":
        return (
          <span className="pill revoked">
            <XCircle className="w-3.5 h-3.5" />
            Access Revoked
          </span>
        );
      case "ADMIN_LOGIN":
        return (
          <span className="pill primary">
            <Shield className="w-3.5 h-3.5" />
            Single Admin Login
          </span>
        );
      default:
        return (
          <span className="pill info">
            <Sparkles className="w-3.5 h-3.5" />
            {action}
          </span>
        );
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' • ' + date.toLocaleDateString();
    } catch {
      return isoString;
    }
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
          <div className="field !mb-0 min-w-[140px]">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="!py-1.5 !px-3 text-xs"
            >
              <option value="ALL">All Actions</option>
              <option value="ACCESS_GRANTED">Access Granted</option>
              <option value="ACCESS_REVOKED">Access Revoked</option>
              <option value="ADMIN_LOGIN">Admin Login</option>
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

          {/* Clear Logs */}
          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              title="Clear log history"
              className="btn btn-danger btn-sm"
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
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-elev)] transition-colors">
                    <td className="font-mono text-[var(--text-3)] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                        {formatTime(log.timestamp)}
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
                    <td className="text-[var(--text-2)] max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="font-mono text-[var(--text-3)] text-[11px] whitespace-nowrap">
                      {log.ipAddress || "192.168.1.104"}
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
    </div>
  );
}
