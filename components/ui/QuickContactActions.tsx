"use client";

import { useState } from "react";
import { copyEmailToClipboard } from "./ToastNotification";
import { Copy, Check, Calendar, Mail, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";

export function CopyEmailButton({
  className = "",
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "button" | "chip";
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await copyEmailToClipboard(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={onCopy}
        data-cursor="view"
        title="Copy email to clipboard"
        className={`inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule)] bg-[var(--surface-2)]/80 px-2.5 py-1 font-mono text-[11px] text-[var(--fg-soft)] hover:border-[var(--accent)]/50 hover:text-[var(--fg)] transition-all shadow-2xs ${className}`}
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-[var(--state-done)]" />
            <span className="text-[var(--state-done)] font-medium">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 text-[var(--accent)]" />
            <span>Copy</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      data-cursor="view"
      className={`btn-glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-[12px] text-[var(--fg-soft)] transition-all hover:border-[var(--accent)]/50 hover:text-[var(--fg)] shadow-xs ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[var(--state-done)]" />
          <span className="text-[var(--state-done)] font-medium">Email Copied to Clipboard</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>Copy {profile.email}</span>
        </>
      )}
    </button>
  );
}

export function MeetingLinkButton({ className = "" }: { className?: string }) {
  const meetingMailto = `mailto:${profile.email}?subject=Introductory%20Meeting%20Request%20-%20Nuha%20Nizar&body=Hi%20Nuha%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20schedule%20a%20brief%20call%20or%20meeting%20with%20you%20regarding%20...%0A%0ABest%20regards%2C`;

  return (
    <a
      href={meetingMailto}
      data-cursor="view"
      className={`btn-glass btn-glass--accent inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-[12px] shadow-sm ${className}`}
    >
      <Calendar className="h-3.5 w-3.5" />
      <span>Schedule Quick Chat</span>
      <ArrowUpRight className="h-3 w-3" />
    </a>
  );
}
