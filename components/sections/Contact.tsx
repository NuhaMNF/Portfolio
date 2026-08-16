"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/lib/data";
import { Send, Mail, ArrowUpRight, CheckCircle2, RotateCcw, Loader2, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { CopyEmailButton, MeetingLinkButton } from "@/components/ui/QuickContactActions";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { playSelect } from "@/lib/sound";
import { showToast } from "@/components/ui/ToastNotification";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    // Basic email validation
    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setStatus("sending");
    playSelect(1);

    setTimeout(() => {
      setStatus("sent");
      playSelect(3);
      showToast("Message Prepared!", `Dispatched to ${profile.email}`, "sparkle");

      // Launch email client fallback with prefilled fields
      const mailSubject = encodeURIComponent(
        form.subject.trim() || `Portfolio inquiry from ${form.name}`
      );
      const mailBody = encodeURIComponent(
        `Hi Nuha,\n\n${form.message}\n\n—\nSender: ${form.name}\nEmail: ${form.email}`
      );
      window.location.href = `mailto:${profile.email}?subject=${mailSubject}&body=${mailBody}`;
    }, 700);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setStatus("idle");
    setError(null);
  };

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
              Open to internships, software engineering roles, and data analytics opportunities. Direct email is the fastest way to reach me.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Interactive Form Card */}
          <SpotlightCard className="p-7 md:p-8 shadow-xl">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[var(--state-done)]/40 bg-[var(--state-done)]/10 text-[var(--state-done)] shadow-lg shadow-[var(--state-done)]/10">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-serif text-[24px] font-normal text-[var(--fg)]">
                    Message Dispatched!
                  </h3>
                  <p className="mt-2 max-w-md text-[14.5px] leading-[1.65] text-[var(--fg-soft)]">
                    Thank you, <span className="font-semibold text-[var(--fg)]">{form.name}</span>. Your message has been prepared and addressed to{" "}
                    <span className="font-mono text-[13px] text-[var(--accent)]">{profile.email}</span>.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      data-cursor="view"
                      className="btn-glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-[12px] text-[var(--fg-soft)] hover:text-[var(--fg)] shadow-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Send another message</span>
                    </button>
                    <CopyEmailButton variant="pill" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-4 mb-6">
                    <div>
                      <h3 className="text-[18px] font-medium text-[var(--fg)]">Send a direct message</h3>
                      <p className="mt-0.5 text-[13px] text-[var(--fg-mute)]">
                        Addresses your note directly to {profile.email}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                      <Sparkles className="h-3 w-3" />
                      Live Form
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-[12px] text-rose-400">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--fg-mute)]"
                        >
                          Your Name <span className="text-[var(--accent)]">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Jane Doe"
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-xl border border-[var(--rule)] bg-[var(--surface-2)]/70 px-4 py-2.5 font-sans text-[14px] text-[var(--fg)] outline-hidden transition-colors focus:border-[var(--accent)] placeholder:text-[var(--fg-faint)]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--fg-mute)]"
                        >
                          Your Email <span className="text-[var(--accent)]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="jane@example.com"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-[var(--rule)] bg-[var(--surface-2)]/70 px-4 py-2.5 font-sans text-[14px] text-[var(--fg)] outline-hidden transition-colors focus:border-[var(--accent)] placeholder:text-[var(--fg-faint)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--fg-mute)]"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="Internship opportunity / Collaboration inquiry"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full rounded-xl border border-[var(--rule)] bg-[var(--surface-2)]/70 px-4 py-2.5 font-sans text-[14px] text-[var(--fg)] outline-hidden transition-colors focus:border-[var(--accent)] placeholder:text-[var(--fg-faint)]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--fg-mute)]"
                      >
                        Message <span className="text-[var(--accent)]">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Hi Nuha, I came across your portfolio and would like to discuss..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-xl border border-[var(--rule)] bg-[var(--surface-2)]/70 p-4 font-sans text-[14px] text-[var(--fg)] outline-hidden transition-colors focus:border-[var(--accent)] placeholder:text-[var(--fg-faint)] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      data-cursor="run"
                      className="btn-glass btn-glass--accent inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 font-mono text-[13px] shadow-sm disabled:opacity-50"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Preparing Dispatch...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Send Message to {profile.name}</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </SpotlightCard>

          {/* Direct Channels Column */}
          <div className="space-y-4">
            {/* Quick Action Banner */}
            <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)]/60 p-5 backdrop-blur-md">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-2.5">
                // Instant Connections
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <MeetingLinkButton />
                <CopyEmailButton variant="pill" />
              </div>
            </div>

            {/* Email Channel Card */}
            <div className="group flex items-center justify-between rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-5 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 hover:shadow-md">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="view"
                className="flex min-w-0 flex-1 items-center gap-3.5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-xs">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
                    Primary Email
                  </div>
                  <div className="truncate text-[15px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                    {profile.email}
                  </div>
                </div>
              </a>
              <div className="flex shrink-0 items-center gap-2 pl-2">
                <CopyEmailButton variant="chip" />
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="view"
                  title="Open mail client"
                  className="btn-glass flex h-8 w-8 items-center justify-center rounded-lg text-[var(--fg-faint)] transition-colors hover:text-[var(--accent)]"
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
              className="group flex items-center justify-between rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-5 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-xs">
                  <GithubIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
                    GitHub Profile
                  </div>
                  <div className="text-[15px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                    github.com/NuhaMNF
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--fg-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
            </a>

            {/* LinkedIn Card */}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              className="group flex items-center justify-between rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-5 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-xs">
                  <LinkedinIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
                    LinkedIn
                  </div>
                  <div className="text-[15px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                    linkedin.com/in/nuhanizar
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--fg-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
