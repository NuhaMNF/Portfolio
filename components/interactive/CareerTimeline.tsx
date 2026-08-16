'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Code2, Award, Trophy, Sparkles } from 'lucide-react';
import { playSelect } from '@/lib/sound';

const timelineData = [
  { year: '2025', month: 'Jan', title: 'Enrolled at University of Kelaniya', description: 'BSc (Hons) in Management & Information Technology — Department of Industrial Management', icon: GraduationCap, tag: 'Academic' },
  { year: '2025', month: 'Mar', title: 'First Full-Stack Application', description: 'Built the Task Management System using React.js, Node.js, and PostgreSQL with normalized 3NF relational schema', icon: Code2, tag: 'Engineering' },
  { year: '2025', month: 'Jun', title: 'Top 10 Finalist — IdeaSprint', description: 'Selected among the Top 10 Finalists at the IdeaSprint Innovation Competition hosted by the University of Kelaniya', icon: Award, tag: 'Competition' },
  { year: '2025', month: 'Aug', title: 'Top 10 Finalist — Trinova Youth Innovation', description: 'Recognized at the Trinova Youth Innovation Competition organized by CINEC Campus for combining management insight with technology', icon: Trophy, tag: 'Competition' },
  { year: '2025–2028', month: '', title: 'Active Academic Candidate', description: 'Continuing multidisciplinary coursework in Software Engineering, Data Analytics, Operations Management, and Enterprise Systems at the University of Kelaniya', icon: Sparkles, tag: 'Ongoing' }
];

const tagColors: Record<string, string> = {
  'Academic': 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20',
  'Engineering': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Competition': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Ongoing': 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20 animate-pulse'
};

export function CareerTimeline() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    try {
      playSelect();
    } catch (e) {
      // Ignore if sound not supported
    }
  };

  return (
    <section id="timeline" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
              Journey · Career Timeline
            </span>
          </div>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl text-[var(--fg)]">
            From classroom to code to <span className="display-italic text-[var(--fg-soft)]">competition.</span>
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-12 md:pl-24">
          {/* Vertical line */}
          <div className="absolute left-0 top-8 bottom-8 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/50 to-transparent" />
          
          <div className="space-y-10">
            {timelineData.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeIndex === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleSelect(index)}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-6 sm:-left-12 md:-left-24 top-8 -translate-x-[0.5px] -translate-y-1/2 flex items-center justify-center transition-all duration-300 z-10 ${isActive ? 'scale-150' : 'group-hover:scale-125'}`}>
                    <div className={`h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] transition-all duration-300 ${isActive ? 'animate-pulse shadow-[0_0_20px_var(--accent)]' : ''}`} />
                  </div>
                  
                  {/* Horizontal Connector Line */}
                  <div className="absolute -left-6 sm:-left-12 md:-left-24 top-8 w-6 sm:w-12 md:w-24 h-px bg-gradient-to-r from-[var(--accent)]/50 to-transparent -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                  <motion.div 
                    animate={{ scale: isActive ? 1.02 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`rounded-2xl border transition-colors duration-300 ${isActive ? 'border-[var(--accent)]/50 bg-[var(--surface)]' : 'border-[var(--rule-soft)] bg-[var(--surface)]/80'} backdrop-blur-xl p-5 sm:p-6 overflow-hidden`}
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-shrink-0">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300 ${isActive ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--surface-hover)] text-[var(--fg-muted)] group-hover:text-[var(--accent)]'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="font-mono text-xs text-[var(--fg-muted)]">
                            {item.month ? `${item.month} ${item.year}` : item.year}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider border ${tagColors[item.tag] || tagColors['Academic']}`}>
                            {item.tag}
                          </span>
                        </div>
                        <h3 className={`text-xl font-medium transition-colors duration-300 ${isActive ? 'text-[var(--fg)] mb-3' : 'text-[var(--fg-soft)] group-hover:text-[var(--fg)] mb-2'}`}>
                          {item.title}
                        </h3>
                        
                        <motion.div 
                          initial={false}
                          animate={{ 
                            height: isActive ? 'auto' : 'auto', 
                          }}
                          className="text-sm leading-relaxed text-[var(--fg-muted)]"
                        >
                          <p className={`transition-all duration-300 ${isActive ? "line-clamp-none opacity-100" : "line-clamp-2 opacity-80 group-hover:opacity-100"}`}>
                            {item.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
