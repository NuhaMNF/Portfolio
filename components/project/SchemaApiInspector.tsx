"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Server, Copy, Check, Terminal, Key, Shield, ArrowRight } from "lucide-react";
import { playSelect } from "@/lib/sound";
import { showToast } from "@/components/ui/ToastNotification";

type TabMode = "schema" | "api";

const POSTGRES_TABLES = [
  {
    name: "users",
    description: "Team accounts, authentication roles, and permission levels",
    columns: [
      { name: "id", type: "UUID", isPk: true, note: "DEFAULT gen_random_uuid()" },
      { name: "full_name", type: "VARCHAR(120)", note: "NOT NULL" },
      { name: "email", type: "VARCHAR(255)", note: "UNIQUE, NOT NULL" },
      { name: "role", type: "VARCHAR(40)", note: "DEFAULT 'developer'" },
      { name: "created_at", type: "TIMESTAMPTZ", note: "DEFAULT NOW()" },
    ],
  },
  {
    name: "tasks",
    description: "Core work items with status, priority, and assignment tracking",
    columns: [
      { name: "id", type: "UUID", isPk: true, note: "DEFAULT gen_random_uuid()" },
      { name: "title", type: "VARCHAR(255)", note: "NOT NULL" },
      { name: "description", type: "TEXT", note: "Nullable" },
      { name: "priority", type: "VARCHAR(20)", note: "CHECK (low, medium, high)" },
      { name: "status", type: "VARCHAR(30)", note: "CHECK (todo, in_progress, completed)" },
      { name: "assignee_id", type: "UUID", isFk: true, fkRef: "users(id)", note: "ON DELETE SET NULL" },
      { name: "due_date", type: "DATE", note: "Nullable" },
      { name: "created_at", type: "TIMESTAMPTZ", note: "DEFAULT NOW()" },
    ],
  },
  {
    name: "task_comments",
    description: "Collaborative discussion threads and activity comments per task",
    columns: [
      { name: "id", type: "UUID", isPk: true, note: "PRIMARY KEY" },
      { name: "task_id", type: "UUID", isFk: true, fkRef: "tasks(id)", note: "ON DELETE CASCADE" },
      { name: "author_id", type: "UUID", isFk: true, fkRef: "users(id)", note: "ON DELETE CASCADE" },
      { name: "content", type: "TEXT", note: "NOT NULL" },
      { name: "created_at", type: "TIMESTAMPTZ", note: "DEFAULT NOW()" },
    ],
  },
  {
    name: "notifications",
    description: "Real-time activity audit log and team event stream",
    columns: [
      { name: "id", type: "UUID", isPk: true, note: "PRIMARY KEY" },
      { name: "recipient_id", type: "UUID", isFk: true, fkRef: "users(id)" },
      { name: "task_id", type: "UUID", isFk: true, fkRef: "tasks(id)" },
      { name: "action_type", type: "VARCHAR(50)", note: "assignment | status_change | comment" },
      { name: "is_read", type: "BOOLEAN", note: "DEFAULT FALSE" },
      { name: "created_at", type: "TIMESTAMPTZ", note: "DEFAULT NOW()" },
    ],
  },
];

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/tasks",
    description: "Query tasks with dynamic status, priority, and assignee filters",
    status: "200 OK",
    response: {
      status: "success",
      count: 2,
      data: [
        {
          id: "e4a781b0-9f12-4c28-98e3-f0a12e345b67",
          title: "Implement PostgreSQL Notification Audit Log",
          priority: "high",
          status: "in_progress",
          assignee: { name: "Nuha Nizar", email: "nuhanizar16@gmail.com" },
          dueDate: "2025-09-30",
        },
        {
          id: "7bc392e1-88d4-4a52-bfa1-d492e8174f19",
          title: "Design Responsive Tasks Table with Priority Badges",
          priority: "medium",
          status: "completed",
          assignee: { name: "Nuha Nizar", email: "nuhanizar16@gmail.com" },
          dueDate: "2025-09-15",
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/api/v1/tasks",
    description: "Create a new task and dispatch notification to assignee",
    status: "201 Created",
    response: {
      status: "created",
      task: {
        id: "c82f91a4-56b1-419b-a312-d9e018247ca8",
        title: "Setup REST API Endpoints with Node.js & Express",
        priority: "high",
        status: "todo",
        assignee_id: "user_01",
        createdAt: "2025-08-20T10:14:00Z",
      },
    },
  },
  {
    method: "PATCH",
    path: "/api/v1/tasks/:id/status",
    description: "Update task status lifecycle and record audit event",
    status: "200 OK",
    response: {
      status: "updated",
      id: "c82f91a4-56b1-419b-a312-d9e018247ca8",
      previousStatus: "in_progress",
      newStatus: "completed",
      updatedAt: "2025-08-20T11:45:00Z",
    },
  },
  {
    method: "GET",
    path: "/api/v1/notifications",
    description: "Retrieve real-time activity feed for authenticated user",
    status: "200 OK",
    response: {
      unreadCount: 1,
      notifications: [
        {
          id: "notif_902",
          action: "task_assigned",
          message: "You were assigned to 'Database Schema Normalization'",
          timeAgo: "10m ago",
          isRead: false,
        },
      ],
    },
  },
];

export function SchemaApiInspector() {
  const [activeTab, setActiveTab] = useState<TabMode>("schema");
  const [selectedTable, setSelectedTable] = useState<number>(1); // Default to 'tasks' table
  const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (text: string, label: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      playSelect(3);
      setCopied(label);
      showToast("Copied to Clipboard!", label, "copy");
      setTimeout(() => setCopied(null), 2200);
    } catch {}
  };

  const getFullSqlDdl = () => {
    return `-- PostgreSQL Schema for Task Management System
-- Database: task_management_db (Normalized 3NF)

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(40) DEFAULT 'developer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(30) CHECK (status IN ('todo', 'in_progress', 'completed')),
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_notif_recipient ON notifications(recipient_id, is_read);`;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface)] shadow-2xl backdrop-blur-xl">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] bg-[var(--surface-2)]/80 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSelect(1);
              setActiveTab("schema");
            }}
            data-cursor="view"
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[11.5px] font-medium transition-all ${
              activeTab === "schema"
                ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--fg)] shadow-xs"
                : "border-transparent text-[var(--fg-mute)] hover:text-[var(--fg)]"
            }`}
          >
            <Database className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>PostgreSQL Relational Schema</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSelect(2);
              setActiveTab("api");
            }}
            data-cursor="view"
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[11.5px] font-medium transition-all ${
              activeTab === "api"
                ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--fg)] shadow-xs"
                : "border-transparent text-[var(--fg-mute)] hover:text-[var(--fg)]"
            }`}
          >
            <Server className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>REST API & Payloads</span>
          </button>
        </div>

        {activeTab === "schema" ? (
          <button
            type="button"
            onClick={() => copyCode(getFullSqlDdl(), "Full PostgreSQL DDL")}
            data-cursor="view"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[10.5px] text-[var(--fg-soft)] hover:border-[var(--accent)]/50 hover:text-[var(--fg)] transition-colors shadow-2xs"
          >
            {copied === "Full PostgreSQL DDL" ? (
              <>
                <Check className="h-3 w-3 text-[var(--state-done)]" />
                <span className="text-[var(--state-done)]">Copied Schema</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-[var(--accent)]" />
                <span>Copy SQL DDL</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              copyCode(
                JSON.stringify(API_ENDPOINTS[selectedEndpoint].response, null, 2),
                `${API_ENDPOINTS[selectedEndpoint].method} ${API_ENDPOINTS[selectedEndpoint].path} JSON`
              )
            }
            data-cursor="view"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[10.5px] text-[var(--fg-soft)] hover:border-[var(--accent)]/50 hover:text-[var(--fg)] transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-[var(--state-done)]" />
                <span className="text-[var(--state-done)]">Copied JSON</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-[var(--accent)]" />
                <span>Copy JSON Response</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="p-5 md:p-6">
        <AnimatePresence mode="wait">
          {activeTab === "schema" ? (
            <motion.div
              key="schema"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]"
            >
              {/* Left Table Selector */}
              <div className="space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                  // Relational Tables (3NF)
                </div>
                {POSTGRES_TABLES.map((tbl, idx) => {
                  const isSel = selectedTable === idx;
                  return (
                    <button
                      key={tbl.name}
                      type="button"
                      onClick={() => {
                        playSelect(idx);
                        setSelectedTable(idx);
                      }}
                      data-cursor="view"
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        isSel
                          ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
                          : "border-[var(--rule-soft)] bg-[var(--surface)] hover:bg-[var(--surface-2)]/50"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-mono text-[13px] font-semibold text-[var(--fg)] flex items-center gap-1.5">
                          <Terminal className="h-3.5 w-3.5 text-[var(--accent)]" />
                          <span>{tbl.name}</span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-[var(--fg-mute)] truncate">
                          {tbl.columns.length} columns
                        </div>
                      </div>
                      {isSel && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Table Column Viewer */}
              <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--bg-paper)]/50 p-5 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule-soft)] pb-3.5">
                  <div>
                    <h4 className="font-mono text-[16px] font-bold text-[var(--accent)] flex items-center gap-2">
                      <span>TABLE: {POSTGRES_TABLES[selectedTable].name}</span>
                    </h4>
                    <p className="text-[12.5px] text-[var(--fg-soft)] mt-0.5">
                      {POSTGRES_TABLES[selectedTable].description}
                    </p>
                  </div>
                  <span className="rounded bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-[10px] uppercase text-[var(--fg-mute)]">
                    Engine: PostgreSQL 16
                  </span>
                </div>

                {/* Columns Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left font-mono text-[12px]">
                    <thead>
                      <tr className="border-b border-[var(--rule-soft)] text-[10.5px] uppercase tracking-wider text-[var(--fg-faint)]">
                        <th className="pb-2.5">Column Name</th>
                        <th className="pb-2.5">Type</th>
                        <th className="pb-2.5">Key</th>
                        <th className="pb-2.5">Constraints / Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--rule-soft)]/50">
                      {POSTGRES_TABLES[selectedTable].columns.map((col) => (
                        <tr key={col.name} className="hover:bg-[var(--surface-2)]/30">
                          <td className="py-2.5 font-semibold text-[var(--fg)]">
                            {col.name}
                          </td>
                          <td className="py-2.5 text-[var(--accent)]">{col.type}</td>
                          <td className="py-2.5">
                            {col.isPk ? (
                              <span className="inline-flex items-center gap-1 rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[9.5px] font-bold text-[var(--accent)]">
                                <Key className="h-2.5 w-2.5" /> PK
                              </span>
                            ) : col.isFk ? (
                              <span className="inline-flex items-center gap-1 rounded bg-sky-500/15 px-1.5 py-0.5 text-[9.5px] font-bold text-sky-400">
                                FK → {col.fkRef}
                              </span>
                            ) : (
                              <span className="text-[var(--fg-faint)]">—</span>
                            )}
                          </td>
                          <td className="py-2.5 text-[var(--fg-mute)] text-[11px]">
                            {col.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]"
            >
              {/* Left Endpoints List */}
              <div className="space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                  // Express REST Endpoints
                </div>
                {API_ENDPOINTS.map((ep, idx) => {
                  const isSel = selectedEndpoint === idx;
                  const isGet = ep.method === "GET";
                  const isPost = ep.method === "POST";
                  return (
                    <button
                      key={ep.path + ep.method}
                      type="button"
                      onClick={() => {
                        playSelect(idx);
                        setSelectedEndpoint(idx);
                      }}
                      data-cursor="view"
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        isSel
                          ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
                          : "border-[var(--rule-soft)] bg-[var(--surface)] hover:bg-[var(--surface-2)]/50"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold uppercase ${
                              isGet
                                ? "bg-emerald-500/15 text-emerald-400"
                                : isPost
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-purple-500/15 text-purple-400"
                            }`}
                          >
                            {ep.method}
                          </span>
                          <span className="font-mono text-[12px] font-medium text-[var(--fg)] truncate">
                            {ep.path}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-[var(--fg-mute)] truncate">
                          {ep.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right JSON Response Preview */}
              <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--bg-paper)]/70 p-5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-3">
                  <div className="flex items-center gap-2 font-mono text-[12px]">
                    <span className="font-bold text-[var(--accent)]">
                      {API_ENDPOINTS[selectedEndpoint].method}
                    </span>
                    <span className="text-[var(--fg)]">
                      {API_ENDPOINTS[selectedEndpoint].path}
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-emerald-400">
                    STATUS: {API_ENDPOINTS[selectedEndpoint].status}
                  </span>
                </div>

                <p className="mt-3 text-[12.5px] text-[var(--fg-soft)]">
                  {API_ENDPOINTS[selectedEndpoint].description}
                </p>

                {/* Syntax Highlighted JSON Box */}
                <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--rule-soft)] bg-black/75 p-4 font-mono text-[12px] text-zinc-200">
                  <pre className="m-0">
                    <code>{JSON.stringify(API_ENDPOINTS[selectedEndpoint].response, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
