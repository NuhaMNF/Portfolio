"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playModalOpen } from "@/lib/sound";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeen = sessionStorage.getItem("nuha-intro-seen");
    if (hasSeen) {
      setShow(false);
      setFinished(true);
      return;
    }
    
    // Play sound after monogram assembly (around 1.5s)
    const soundTimer = setTimeout(() => {
      try {
        playModalOpen();
      } catch (e) {}
    }, 1200);

    // End loading screen after 2.2s
    const hideTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("nuha-intro-seen", "true");
    }, 2200);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!mounted || finished) return null;

  return (
    <AnimatePresence onExitComplete={() => setFinished(true)}>
      {show && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--bg)] overflow-hidden"
        >
          <div className="flex flex-col items-center z-10 relative">
            <motion.div 
              className="flex font-serif text-[clamp(72px,10vw,120px)] leading-none text-[var(--fg)] tracking-tighter"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {/* Left N */}
              <motion.div className="flex" variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}>
                <motion.div 
                  className="w-[1ch] inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: 90 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                >N</motion.div>
              </motion.div>
              {/* Right N */}
              <motion.div className="flex ml-2" variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}>
                <motion.div 
                  className="w-[1ch] inline-block text-[var(--accent)]"
                  variants={{
                    hidden: { opacity: 0, y: -40, rotateX: -90 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                >N</motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="mt-8 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <div className="font-mono text-[var(--accent)] tracking-[0.3em] text-sm md:text-base">
                NUHA NIZAR
              </div>
              <motion.div 
                className="font-mono text-[var(--fg-mute)] text-xs md:text-sm tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Management & IT · University of Kelaniya
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
