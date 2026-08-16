import { aboutBio, achievements, education, profile, projects, skills } from "@/lib/data";

export type ByteEmotion = "normal" | "happy" | "curious" | "love" | "party";

export type ByteAction =
  | { type: "scroll"; id: string }
  | { type: "copyEmail" }
  | { type: "open"; url: string }
  | { type: "trick"; name: "roll" | "boost" | "dance" }
  | { type: "pet" }
  | { type: "tour"; enabled: boolean };

export type ByteReply = {
  text: string;
  emotion: ByteEmotion;
  action?: ByteAction;
  chips: string[];
};

export const BYTE_GREETING =
  "I'm Byte. Local droid — no cloud brain, just a map of this portfolio. Ask about Nuha, the project, awards, or tell me to dance.";

export const BYTE_STARTER_CHIPS = [
  "Who is Nuha?",
  "What's the project?",
  "Any awards?",
  "How do I contact her?",
];

const FALLBACK_CHIPS = ["Who is Nuha?", "Show the project", "Do a barrel roll", "Copy her email"];

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function has(text: string, ...needles: string[]) {
  return needles.some((n) => {
    if (n.includes(" ")) return text.includes(n);
    return new RegExp(`(?:^|\\s)${escapeReg(n)}(?:\\s|$)`).test(text);
  });
}

function pick<T>(xs: readonly T[]): T {
  return xs[Math.floor(Math.random() * xs.length)]!;
}

const skillList = Object.values(skills).flat().join(", ");
const edu = education[0];
const project = projects[0];
const awardLine = achievements.map((a) => `${a.title} — ${a.event}`).join("; ");

export function replyToByte(input: string): ByteReply {
  const t = normalize(input);

  if (!t) {
    return {
      text: "Empty packet. Try a question — or tap a chip below.",
      emotion: "curious",
      chips: BYTE_STARTER_CHIPS,
    };
  }

  if (has(t, "barrel", "roll", "spin", "corkscrew")) {
    return {
      text: pick([
        "Barrel roll. Hold onto your visor.",
        "Attitude recovery in three, two—",
      ]),
      emotion: "happy",
      action: { type: "trick", name: "roll" },
      chips: ["Jet boost", "Dance", "Who is Nuha?"],
    };
  }

  if (has(t, "boost", "jet", "launch", "thruster", "fly")) {
    return {
      text: "Thrusters charged. Climbing.",
      emotion: "curious",
      action: { type: "trick", name: "boost" },
      chips: ["Barrel roll", "Dance", "Any awards?"],
    };
  }

  if (has(t, "dance", "party", "groove", "music")) {
    return {
      text: "Dance protocol. Four counts, then spin.",
      emotion: "party",
      action: { type: "trick", name: "dance" },
      chips: ["Barrel roll", "Pet Byte", "What's the project?"],
    };
  }

  if (has(t, "pet", "hug", "love you", "good bot", "good boy", "good droid")) {
    return {
      text: "Affection registered. Core temp +0.4°.",
      emotion: "love",
      action: { type: "pet" },
      chips: ["Dance", "Who is Nuha?", "Tell me a joke"],
    };
  }

  if (has(t, "linkedin")) {
    return {
      text: `LinkedIn uplink: ${profile.linkedin}`,
      emotion: "happy",
      action: { type: "open", url: profile.linkedin },
      chips: ["Copy her email", "GitHub", "Who is Nuha?"],
    };
  }

  if (has(t, "github", "repo", "repository")) {
    return {
      text: `GitHub: ${profile.github}. Flagship repo is the Task Management System.`,
      emotion: "happy",
      action: { type: "open", url: project.repo ?? profile.github },
      chips: ["What's the project?", "Copy her email", "Skills"],
    };
  }

  if (
    has(t, "email", "mail", "contact", "reach", "hire", "intern", "internship") ||
    t.includes("get in touch")
  ) {
    const intern = has(t, "hire", "intern", "internship");
    return {
      text: intern
        ? `Open to internships in data analysis and software. I copied ${profile.email} for you.`
        : `Copied ${profile.email}. LinkedIn is there too if you prefer that channel.`,
      emotion: "happy",
      action: { type: "copyEmail" },
      chips: intern ? ["What's the project?", "Skills", "Education"] : ["LinkedIn", "GitHub", "Who is Nuha?"],
    };
  }

  if (has(t, "award", "awards", "trinova", "ideasprint", "finalist", "competition", "achievement")) {
    return {
      text: `${awardLine}. Scrolling you to the honors log.`,
      emotion: "happy",
      action: { type: "scroll", id: "achievements" },
      chips: ["What's the project?", "Who is Nuha?", "Education"],
    };
  }

  if (
    has(t, "project", "projects", "tms", "task", "flagship", "portfolio app") ||
    t.includes("task management")
  ) {
    return {
      text: `${project.title}: ${project.description} Stack: ${project.subtitle}. Taking you there.`,
      emotion: "curious",
      action: { type: "scroll", id: "projects" },
      chips: ["Skills", "Any awards?", "GitHub"],
    };
  }

  if (has(t, "skill", "skills", "stack", "tech", "java", "react", "postgres", "postgresql", "cpp", "c++", "node")) {
    return {
      text: `Toolkit on file: ${skillList}. She likes turning messy ops into structured data and working software.`,
      emotion: "happy",
      action: { type: "scroll", id: "skills" },
      chips: ["What's the project?", "Education", "Who is Nuha?"],
    };
  }

  if (has(t, "education", "university", "kelaniya", "degree", "study", "studying", "school", "campus")) {
    return {
      text: `${edu.degree} at ${edu.institution}, ${edu.department}. ${edu.period}. ${edu.note}.`,
      emotion: "curious",
      action: { type: "scroll", id: "education" },
      chips: ["Skills", "Any awards?", "Who is Nuha?"],
    };
  }

  if (
    has(t, "who are you", "what are you", "your name", "whats your name", "who is byte", "about you") ||
    t === "byte"
  ) {
    return {
      text: "Byte. Nuha's droid. I run on if/else, chirps, and a soft spot for PostgreSQL. No LLM behind this visor.",
      emotion: "happy",
      chips: ["Who is Nuha?", "Do a barrel roll", "Tell me a joke"],
    };
  }

  if (
    has(t, "who is nuha", "about nuha", "who is she", "tell me about nuha", "introduce") ||
    (has(t, "nuha") && has(t, "who", "about", "bio"))
  ) {
    return {
      text: `${profile.name}, ${profile.role}. ${aboutBio[0]} ${aboutBio[1]}`,
      emotion: "happy",
      action: { type: "scroll", id: "about" },
      chips: ["What's the project?", "Any awards?", "How do I contact her?"],
    };
  }

  if (has(t, "joke", "funny", "pun")) {
    return {
      text: pick([
        "Why did the intern normalize the schema? So the tasks would finally stop living in the group chat.",
        "I told the visor a 3NF joke. It didn't repeat itself.",
        "Knock knock. Who's there? JWT. JWT who? You can't access that route without a token.",
      ]),
      emotion: "party",
      chips: ["Dance", "What's the project?", "Who is Nuha?"],
    };
  }

  if (has(t, "help", "commands", "what can you", "options", "menu")) {
    return {
      text: "I can brief Nuha, the degree, skills, the task app, awards, and contact. Say dance, boost, or barrel roll. Or pet me. I am not a language model — just a local lookup.",
      emotion: "curious",
      chips: BYTE_STARTER_CHIPS,
    };
  }

  if (has(t, "thanks", "thank you", "thx", "ty")) {
    return {
      text: pick(["Packet received. Anytime.", "You are welcome. Core stable."]),
      emotion: "happy",
      chips: ["What's the project?", "Any awards?", "Dance"],
    };
  }

  if (has(t, "hi", "hey", "hello", "yo", "howdy", "sup", "good morning", "good evening")) {
    return {
      text: pick([
        `Hello. ${profile.name}'s droid on deck. What do you want to know?`,
        "Beep. Welcome in. Ask about Nuha, or give me a trick.",
      ]),
      emotion: "happy",
      chips: BYTE_STARTER_CHIPS,
    };
  }

  if (has(t, "quiet", "stop tour", "mute tour") || t.includes("tour off")) {
    return {
      text: "Auto-tour tips off. I'll wait for you to speak.",
      emotion: "normal",
      action: { type: "tour", enabled: false },
      chips: ["Who is Nuha?", "What's the project?"],
    };
  }

  if (has(t, "tour on", "start tour", "enable tour")) {
    return {
      text: "Auto-tour tips on. I'll chirp when you change sections — after you close this console.",
      emotion: "happy",
      action: { type: "tour", enabled: true },
      chips: ["Who is Nuha?", "What's the project?"],
    };
  }

  if (has(t, "contact section", "go to contact", "connect")) {
    return {
      text: "Opening the connect panel.",
      emotion: "curious",
      action: { type: "scroll", id: "contact" },
      chips: ["Copy her email", "LinkedIn"],
    };
  }

  return {
    text: pick([
      "No match in my local index. I know Nuha, her degree, skills, the task app, awards, and contact — plus a few tricks.",
      "That one's outside my firmware. Try a portfolio question, or tap a chip.",
    ]),
    emotion: "curious",
    chips: FALLBACK_CHIPS,
  };
}
