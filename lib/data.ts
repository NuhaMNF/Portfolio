// All portfolio content. Single source of truth.

export const profile = {
  name: "Nuha Nizar",
  role: "Management & IT Undergraduate",
  initials: "NN",
  email: "nuhanizar16@gmail.com",
  location: "University of Kelaniya, LK",
  tagline:
    "An Undergraduate in Management & IT, eager to apply technical and data-focused skills in a professional setting. Passionate about data analysis, innovation, and solving problems through technology. Committed to growing into a role that combines management insight with data driven decision making.",
  github: "https://github.com/NuhaMNF",
  linkedin: "https://linkedin.com/in/nuhanizar",
  twitter: "",
};

export const heroClassCode = `class NuhaNizar:
    role = "Management & IT Undergraduate"
    university = "University of Kelaniya"
    department = "Industrial Management"
    interests = [
        "Data Analysis",
        "Software Development",
        "Database Systems",
        "Business & Management",
        "Technology & Innovation"
    ]

    def introduce(self):
        return "Combining management insight with data-driven decision making."

nuha = NuhaNizar()
nuha.introduce()`;

export const aboutDict = `nuha = {
    "degree": "BSc (Hons) in Management & Information Technology",
    "university": "University of Kelaniya",
    "department": "Department of Industrial Management",
    "timeline": "2025 – 2028",
    "expected_completion": 2028,
    "areas_of_interest": [
        "Data Analysis",
        "Software Development",
        "Database Systems",
        "Business & Management",
        "Technology & Innovation"
    ],
    "focus": "management insight + data-driven decisions"
}`;

export const aboutBio = [
  "An Undergraduate in Management & IT, eager to apply technical and data-focused skills in a professional setting. Passionate about data analysis, innovation, and solving problems through technology.",
  "Committed to growing into a role that combines management insight with data driven decision making.",
];

export const stats = [
  { label: "flagship project", value: 1, suffix: "" },
  { label: "finalist awards", value: 2, suffix: "" },
  { label: "focus areas", value: 5, suffix: "" },
  { label: "languages", value: 3, suffix: "" },
];

export const philosophy = [
  { label: "data analysis", value: 92 },
  { label: "software development", value: 88 },
  { label: "database systems", value: 90 },
  { label: "business & management", value: 94 },
  { label: "technology & innovation", value: 95 },
];

export const skills = {
  "Areas of Interest": [
    "Data Analysis",
    "Software Development",
    "Database Systems",
    "Business & Management",
    "Technology & Innovation",
  ],
  "Languages & Paradigms": ["Java", "C++", "JavaScript", "OOP"],
  "Web & Backend": ["React.js", "Node.js", "REST API"],
  "Database & Design": ["MySQL", "PostgreSQL", "Database Design"],
  "Tools & Practices": ["Git & GitHub", "Debugging", "Team Collaboration"],
};

export const skillsRadar = [
  { axis: "Data Analysis", value: 92 },
  { axis: "Software Dev", value: 88 },
  { axis: "Database Systems", value: 90 },
  { axis: "Business & Mgmt", value: 94 },
  { axis: "Innovation", value: 95 },
];

export const projects = [
  {
    id: "task-management",
    cellId: "01",
    title: "Task Management System",
    subtitle: "React.js · Node.js · PostgreSQL · REST API",
    year: 2025,
    category: "Full-Stack Web Application",
    description:
      "A web-based task management system designed to help users efficiently create, organize, assign, track, and manage tasks. The system improves task organization and collaboration by providing a centralized platform for managing tasks and their progress.",
    problem:
      "Workplace productivity and team transparency suffered from fragmented communication and untracked task assignments across disparate tools.",
    solution:
      "Engineered a centralized web platform featuring an interactive React.js frontend, secure Node.js REST API, and PostgreSQL relational database with role-based assignment and live notifications.",
    architecture: [
      "React.js Single Page App (Vite / Tailwind / HSL Tokens)",
      "       │",
      "       ├──► REST API Gateway (Node.js / Express)",
      "       │       ├── JWT Authentication & Route Guards",
      "       │       ├── Task Management & Role Assignment",
      "       │       ├── Comment Threading & File Attachments",
      "       │       └── Real-time Notification Dispatcher",
      "       │",
      "       └──► Relational Database (PostgreSQL)",
      "               ├── Normalized Task & User Schemas",
      "               └── Audit Log Triggers",
    ].join("\n"),
    tech: ["React.js", "Node.js", "PostgreSQL", "REST API", "Git & GitHub"],
    repo: "https://github.com/NuhaMNF/Task-Management-System.git",
    demo: null,
    metrics: [
      { label: "year", value: "2025" },
      { label: "frontend", value: "React.js" },
      { label: "backend", value: "Node.js" },
      { label: "database", value: "PostgreSQL" },
    ],
    features: [
      "Task creation, priority tagging (Low / Med / High), and due date scheduling",
      "Multi-member task assignment with role tracking (Project Manager, Collaborator)",
      "Collaborative task comment threads with attachment support",
      "Real-time notification audit center with instant read/unread status updates",
      "Normalized PostgreSQL database persistence and REST API endpoints",
    ],
    images: [
      {
        id: "presentation",
        title: "Project presentation",
        tag: "On stage",
        src: "/projects/task-management/presentation.png",
        description: "Presenting the problem, solution, and product flow to a live audience.",
      },
      {
        id: "team",
        title: "Team",
        tag: "Team",
        src: "/projects/task-management/team.png",
        description: "Team photograph from the collaboration event.",
      },
      {
        id: "tasks-table",
        title: "All Tasks Directory & Filters",
        tag: "Task Table View",
        src: "/projects/task-management/tasks-table.jpg",
        description: "Task table with status and priority filtering, assignment tags, and deadline tracking.",
      },
      {
        id: "task-details",
        title: "Task Configuration & Comments",
        tag: "Task Modal Editor",
        src: "/projects/task-management/task-details.jpg",
        description: "Task modal editor featuring dynamic assignee selection, due date picker, and collaborative comments thread.",
      },
      {
        id: "notifications",
        title: "Live Activity & Notifications",
        tag: "Notifications Center",
        src: "/projects/task-management/notifications.jpg",
        description: "Real-time activity audit feed tracking task assignment changes and team status updates.",
      },
    ],
    links: [
      {
        label: "github repository",
        url: "https://github.com/NuhaMNF/Task-Management-System.git",
      },
    ],
  },
];

export const achievements = [
  {
    title: "Top 10 Finalist",
    event: "IdeaSprint",
    org: "University of Kelaniya",
    description:
      "Selected among the Top 10 finalists in an innovation-focused competition.",
  },
  {
    title: "Top 10 Finalist",
    event: "Trinova Youth Innovation Competition",
    org: "CINEC Campus",
    description:
      "Selected among the Top 10 finalists, demonstrating innovation and problem-solving skills.",
  },
];

export const education = [
  {
    degree: "BSc (Hons) in Management & Information Technology",
    institution: "University of Kelaniya",
    department: "Department of Industrial Management",
    focus: [
      "Data Analysis",
      "Software Development",
      "Database Systems",
      "Business & Management",
      "Technology & Innovation",
    ],
    period: "2025 – 2028",
    note: "Expected completion: 2028",
  },
];

export const navItems = [
  { id: "hero", cellId: "01", label: "introduce", tag: "py", type: "code", isSub: false },
  { id: "about", cellId: "02", label: "about", tag: "md", type: "md", isSub: false },
  { id: "skills", cellId: "03", label: "capabilities", tag: "py", type: "code", isSub: false },
  { id: "projects", cellId: "04", label: "projects", tag: "sys", type: "code", isSub: false },
  { id: "education", cellId: "05", label: "education", tag: "edu", type: "md", isSub: false },
  { id: "achievements", cellId: "06", label: "achievements", tag: "log", type: "md", isSub: false },
  { id: "contact", cellId: "07", label: "connect", tag: "io", type: "code", isSub: false },
];

export const bootSequence = [
  { line: ">>> python portfolio.py", delay: 0 },
  { line: "", delay: 200 },
  { line: "Initializing Nuha Nizar...", delay: 250 },
  { line: "Loading education (University of Kelaniya)... ✓", delay: 350 },
  { line: "Loading skills & interests... ✓", delay: 500 },
  { line: "Loading projects & achievements... ✓", delay: 650 },
  { line: "", delay: 800 },
  { line: "Runtime ready.", delay: 1000 },
  { line: "", delay: 1200 },
  { line: ">>> run()", delay: 1400 },
];

export const commands = [
  { id: "hero", label: "go to introduce", shortcut: "g h" },
  { id: "about", label: "go to about", shortcut: "g a" },
  { id: "skills", label: "go to capabilities", shortcut: "g s" },
  { id: "projects", label: "go to projects", shortcut: "g p" },
  { id: "education", label: "go to education", shortcut: "g ed" },
  { id: "achievements", label: "go to achievements", shortcut: "g ac" },
  { id: "contact", label: "go to connect", shortcut: "g c" },
  { id: "github", label: "open github", shortcut: "gh" },
  { id: "linkedin", label: "open linkedin", shortcut: "li" },
  { id: "hire", label: "connect / hire", shortcut: "!" },
  { id: "help", label: "show help", shortcut: "?" },
  { id: "theme", label: "toggle theme", shortcut: "t" },
  { id: "glow", label: "cycle key glow gradient", shortcut: "k" },
  { id: "bg", label: "toggle background (grid / stars)", shortcut: "b" },
];

export const personalityAnnotations: Array<{
  id: string;
  section: string;
  text: string;
  tone?: "warm" | "wry" | "quiet";
}> = [
  { id: "p1", section: "hero", text: "Department of Industrial Management · Kelaniya", tone: "warm" },
  { id: "p2", section: "about", text: "combining management insight with data driven decision making", tone: "quiet" },
  { id: "p3", section: "skills", text: "Data Analysis · Software · Databases · Management", tone: "warm" },
  { id: "p5", section: "projects", text: "team projects, database architecture, and full stack systems", tone: "wry" },
  { id: "p6", section: "contact", text: "open to data analysis and software development opportunities", tone: "quiet" },
];

export const skillsGraph = {
  center: { id: "nuha", label: "NUHA", weight: 100 },
  domains: [
    {
      id: "data",
      label: "Data Analysis",
      weight: 92,
      tools: ["Data Analysis", "MySQL", "PostgreSQL", "Database Design"],
    },
    {
      id: "sw",
      label: "Software Dev",
      weight: 88,
      tools: ["Java", "C++", "OOP", "Debugging"],
    },
    {
      id: "web",
      label: "Web Systems",
      weight: 86,
      tools: ["React.js", "Node.js", "REST API", "Git & GitHub"],
    },
    {
      id: "db",
      label: "Databases",
      weight: 90,
      tools: ["MySQL", "PostgreSQL", "Relational Models"],
    },
    {
      id: "biz",
      label: "Management",
      weight: 94,
      tools: ["Business & Mgmt", "Decision Making", "Innovation"],
    },
  ],
};
