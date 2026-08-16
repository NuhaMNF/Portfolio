"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { Send, CheckCircle2, Mail, ArrowUpRight, Calendar } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { CopyEmailButton, MeetingLinkButton } from "@/components/ui/QuickContactActions";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  return (
    <section id="contact" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>07 / Connect</span>
        </div>

        {/* Heading */}
        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Let&apos;s start a <span className="display-italic text-[var(--fg-soft)]">conversation</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              Open to internship opportunities, data analysis projects, and software development collaborations.
            </p>
          </div>
        </div>

        {/* Contact Console Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Message Form */}
          <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/75 p-7 md:p-8 backdrop-blur-xl shadow-lg">
            <h3 className="font-medium text-[18px] text-[var(--fg)] mb-6">Send a Message</h3>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-[var(--state-done)]/30 bg-[var(--state-done)]/10 p-6 text-center"
              >
                <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--state-done)] mb-3" />
                <h4 className="font-medium text-[16px] text-[var(--fg)]">Message Sent Successfully</h4>
                <p className="mt-1.5 text-[14px] text-[var(--fg-soft)]">
                  Thank you for reaching out. I will get back to you promptly!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="btn-glass mt-5 px-4 py-1.5 font-mono text-[12px]"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg-mute)] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Silva"
                    className="w-full rounded-lg border border-[var(--rule)] bg-[var(--surface-2)]/60 px-4 py-2.5 font-sans text-[14px] text-[var(--fg)] outline-none transition-colors focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg-mute)] mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="w-full rounded-lg border border-[var(--rule)] bg-[var(--surface-2)]/60 px-4 py-2.5 font-sans text-[14px] text-[var(--fg)] outline-none transition-colors focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg-mute)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we collaborate?"
                    className="w-full rounded-lg border border-[var(--rule)] bg-[var(--surface-2)]/60 p-4 font-sans text-[14px] text-[var(--fg)] outline-none transition-colors focus:border-[var(--accent)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  data-cursor="run"
                  className="btn-glass btn-glass--accent inline-flex w-full items-center justify-center gap-2 py-3 font-mono text-[13px] rounded-lg shadow-sm disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct Channels */}
          <div className="space-y-4">
            {/* Quick Action Banner */}
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface-2)]/60 p-4 backdrop-blur-md">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                // Fast Connect Options
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <MeetingLinkButton />
                <CopyEmailButton variant="pill" />
              </div>
            </div>

            {/* Email Directly Card with Copy Action */}
            <div className="group flex items-center justify-between rounded-xl border border-[var(--rule)] bg-[var(--surface)]/70 p-5 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 hover:shadow-md">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="view"
                className="flex items-center gap-3.5 min-w-0 flex-1"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">Email Directly</div>
                  <div className="font-medium text-[15px] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors truncate">
                    {profile.email}
                  </div>
                </div>
              </a>
              <div className="flex items-center gap-2 pl-2 shrink-0">
                <CopyEmailButton variant="chip" />
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="view"
                  title="Open mail client"
                  className="btn-glass flex h-7 w-7 items-center justify-center rounded-md text-[var(--fg-faint)] hover:text-[var(--accent)] transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* GitHub Card */}
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              className="group flex items-center justify-between rounded-xl border border-[var(--rule)] bg-[var(--surface)]/70 p-5 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                  <GithubIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">GitHub Profile</div>
                  <div className="font-medium text-[15px] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    github.com/NuhaMNF
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* LinkedIn Card */}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              className="group flex items-center justify-between rounded-xl border border-[var(--rule)] bg-[var(--surface)]/70 p-5 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                  <LinkedinIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">LinkedIn</div>
                  <div className="font-medium text-[15px] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    linkedin.com/in/nuhanizar
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}