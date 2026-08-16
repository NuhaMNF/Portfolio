// All portfolio content. Single source of truth. Easy to swap.

export const profile = {
  name: "Nuha Nizar",
  role: "AI Engineer & Developer",
  initials: "NN",
  email: "nuha@nizar.dev",
  location: "Bengaluru, IN",
  tagline: "Turning ideas, data and algorithms into intelligent experiences.",
  github: "https://github.com/nuhanizar",
  linkedin: "https://linkedin.com/in/nuhanizar",
  twitter: "https://twitter.com/nuhanizar",
};

// Hero class block — rendered with Typewriter
export const heroClassCode = `class NuhaNizar:
    name = "Nuha Nizar"
    role = "AI Engineer & Developer"
    interests = [
        "Artificial Intelligence",
        "Machine Learning",
        "Software Engineering",
        "Creative Tech",
        "Research",
    ]

    def introduce(self):
        return "Building intelligent things with code."

nuha = NuhaNizar()
nuha.introduce()`;

export const aboutDict = `nuha = {
    "curiosity": "high",
    "coffee": True,
    "building": True,
    "learning": "always",
    "shipping": True,
    "debugging": "patient",
}`;

export const aboutBio = [
  "I'm an AI engineer and developer who treats software as a medium for thought. I build systems that learn, infer, and reason — and I obsess over the small details that make them feel inevitable.",
  "My work spans machine learning, distributed systems, and the seams where they meet product. I love taking a fuzzy idea and turning it into something that runs, scales, and feels right.",
  "Outside of code, I read research papers like novels, sketch architectures on paper, and believe the best abstractions are the ones you can almost draw.",
];

export const stats = [
  { label: "models shipped", value: 12, suffix: "" },
  { label: "open-source repos", value: 27, suffix: "" },
  { label: "papers read / mo", value: 14, suffix: "" },
  { label: "cups of coffee", value: 9999, suffix: "+" },
];

export const philosophy = [
  { label: "curiosity", value: 100 },
  { label: "learning", value: 100 },
  { label: "building", value: 95 },
  { label: "shipping", value: 92 },
  { label: "patience", value: 88 },
  { label: "caffeine", value: 100 },
];

// Skills — represented as Python dict
export const skills = {
  "AI / ML": ["PyTorch", "TensorFlow", "Transformers", "LangChain", "Diffusion", "RL"],
  "Programming": ["Python", "TypeScript", "JavaScript", "C++", "Rust"],
  "Backend": ["FastAPI", "Node.js", "PostgreSQL", "Redis", "GraphQL"],
  "Frontend": ["Next.js", "React", "Three.js", "Tailwind", "Framer Motion"],
  "Data": ["Pandas", "NumPy", "dbt", "Airflow", "SQL"],
  "Cloud": ["AWS", "Azure", "Docker", "Kubernetes", "GCP"],
  "MLOps": ["Weights & Biases", "MLflow", "Triton", "Ray", "BentoML"],
  "Tools": ["Git", "Linux", "Vim", "Figma", "Notion"],
};

// Radar chart data — each category gets a 0–100 score
export const skillsRadar = [
  { axis: "AI / ML", value: 92 },
  { axis: "Backend", value: 88 },
  { axis: "Frontend", value: 78 },
  { axis: "Data", value: 85 },
  { axis: "Cloud", value: 80 },
  { axis: "MLOps", value: 74 },
];

export const experience = [
  {
    role: "AI Engineer",
    company: "Lumen Labs",
    period: "2025 — Present",
    location: "Remote",
    bullets: [
      "Architected multi-agent RAG platform serving 40k+ daily queries.",
      "Reduced inference cost 38% via quantization + speculative decoding.",
      "Led rollout of evaluation harness across 6 product teams.",
    ],
    stack: ["PyTorch", "LangChain", "AWS", "PostgreSQL"],
  },
  {
    role: "Machine Learning Engineer",
    company: "Northwind AI",
    period: "2023 — 2025",
    location: "Bengaluru, IN",
    bullets: [
      "Built a vision backbone for document understanding, +6.2 mAP.",
      "Owned the feature store; cut training data prep from days to hours.",
      "Mentored 4 engineers; introduced experiment tracking org-wide.",
    ],
    stack: ["PyTorch", "Ray", "Snowflake", "dbt"],
  },
  {
    role: "Software Engineer",
    company: "PenguinByte",
    period: "2021 — 2023",
    location: "Hybrid",
    bullets: [
      "Shipped 9 production services in TypeScript + Go.",
      "Designed event-driven order pipeline handling 12k req/s.",
      "Owned observability — cut MTTR by 41%.",
    ],
    stack: ["TypeScript", "Node.js", "Kafka", "Redis"],
  },
  {
    role: "Research Intern",
    company: "IISc Bangalore",
    period: "2020 — 2021",
    location: "Bengaluru, IN",
    bullets: [
      "Published workshop paper on sample-efficient RL.",
      "Contributed to open-source simulator used by 3 labs.",
    ],
    stack: ["PyTorch", "NumPy", "JAX"],
  },
];

export const projects = [
  {
    id: "lumen-rag",
    cellId: "5.1",
    title: "Lumen RAG",
    subtitle: "Multi-agent retrieval platform",
    year: 2025,
    category: "AI Systems",
    description: "A production multi-agent retrieval system that orchestrates query planning, hybrid search, and reranking with evaluator feedback loops.",
    problem: "Single-shot retrieval couldn't hold up to messy, multi-hop questions from real users. Faithfulness dropped >30% on adversarially-rewritten queries.",
    solution: "A planner agent decomposes the query, dual retrievers run in parallel, and a reranker + evaluator loop decides when to escalate or rewrite.",
    architecture: [
      "user → planner",
      "      ├─ retriever (lex+vec)",
      "      ├─ retriever (graph)",
      "      └─ reranker",
      "evaluator ↻ planner",
    ].join("\n"),
    tech: ["PyTorch", "LangChain", "FastAPI", "Postgres", "Redis"],
    repo: "https://github.com/nuhanizar/lumen-rag",
    demo: "https://lumen-rag.dev",
    metrics: [
      { label: "p95 latency", value: "420ms" },
      { label: "answer accuracy", value: "0.91" },
      { label: "daily queries", value: "40k+" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/lumen-rag" },
      { label: "demo", url: "https://lumen-rag.dev" },
    ],
  },
  {
    id: "cetacea",
    cellId: "5.2",
    title: "Cetacea",
    subtitle: "Diffusion model for audio synthesis",
    year: 2024,
    category: "Generative AI",
    description: "A latent diffusion model trained on field recordings. Generates 10s of coherent soundscapes conditioned on text and visual cues.",
    problem: "Audio diffusion papers existed but rarely crossed the perceptual quality bar for non-musical soundscapes — fizzly, lobotomized, lacking long-range structure.",
    solution: "Curated a 1.2k-hour field-recording corpus, added CLAP-guided conditioning, and trained a small latent U-Net with classifier-free guidance sweeps.",
    architecture: [
      "prompt → CLAP encoder",
      "      └─ latent u-net diffusion",
      "audio VAE → 10s soundscape",
      "vagus post-net (super-res)",
    ].join("\n"),
    tech: ["PyTorch", "Diffusers", "CUDA", "Triton"],
    repo: "https://github.com/nuhanizar/cetacea",
    demo: "https://cetacea.dev",
    metrics: [
      { label: "FAD score", value: "1.8" },
      { label: "param count", value: "340M" },
      { label: "FLOPS", value: "0.7T" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/cetacea" },
      { label: "demo", url: "https://cetacea.dev" },
    ],
  },
  {
    id: "tideline",
    cellId: "5.3",
    title: "Tideline",
    subtitle: "Realtime analytics for ML systems",
    year: 2024,
    category: "MLOps",
    description: "An analytics layer that streams inference logs + drift metrics into a queryable timeseries store. Web-based lab notebook for SREs.",
    problem: "SREs and ML engineers rode three different dashboards to answer one question: 'is this model degraded?' Drift, latency, and ground-truth were islands.",
    solution: "A unified ingestion layer streams everything into ClickHouse, exposed via a notebook-style query UI so an SRE can grab a notebook and dig in.",
    architecture: [
      "services → kafka → flink",
      "                  ├─ tsdb (clickhouse)",
      "                  └─ drift workers",
      "notebook UI ↔ sql + spark",
    ].join("\n"),
    tech: ["TypeScript", "Ray", "ClickHouse", "Next.js"],
    repo: "https://github.com/nuhanizar/tideline",
    demo: "https://tideline.dev",
    metrics: [
      { label: "ingestion", value: "1.2M/s" },
      { label: "p99 query", value: "85ms" },
      { label: "retention", value: "90d" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/tideline" },
      { label: "demo", url: "https://tideline.dev" },
    ],
  },
  {
    id: "meridian",
    cellId: "5.4",
    title: "Meridian",
    subtitle: "Document understanding backbone",
    year: 2023,
    category: "Computer Vision",
    description: "Vision transformer pre-trained for layout-aware document understanding. Beats prior SOTA by 6.2 mAP on three public benchmarks.",
    problem: "Generic ViTs lose the spatial coherence of documents — receipts, forms, contracts all have a grammar we were ignoring.",
    solution: "Layout-aware pre-training with masked image modeling that respects 2D structure, plus a lightweight adapter for downstream tasks.",
    architecture: [
      "ViT-L/16 backbone",
      "+ layout-aware MIM",
      "+ adapter heads (cls, ner, rel)",
      "→ 3 benchmarks, +6.2 mAP",
    ].join("\n"),
    tech: ["PyTorch", "JAX", "TPU", "W&B"],
    repo: "https://github.com/nuhanizar/meridian",
    demo: null,
    metrics: [
      { label: "mAP", value: "0.832" },
      { label: "params", value: "220M" },
      { label: "datasets", value: "3" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/meridian" },
    ],
  },
  {
    id: "graphite",
    cellId: "5.5",
    title: "Graphite",
    subtitle: "Type-safe graph runtime",
    year: 2022,
    category: "Developer Tools",
    description: "A graph-based runtime for building type-safe data pipelines in TypeScript. Live reload, schema-aware migrations, IDE-grade errors.",
    problem: "Workflow orchestrators were either magical YAML or untyped Python. We wanted the type-safety of a typed language with the expressiveness of a DAG.",
    solution: "A graph runtime that treats your pipeline as a typed AST, with a React-style dev experience: live reload, schema migrations, and errors at the line.",
    architecture: [
      "dsl.ts ─► compiler ─► graph AST",
      "                    ├─ migrate",
      "                    ├─ type-check",
      "                    └─ runtime (workers)",
      "react ui ← live ws",
    ].join("\n"),
    tech: ["TypeScript", "Rust", "GraphQL"],
    repo: "https://github.com/nuhanizar/graphite",
    demo: "https://graphite.dev",
    metrics: [
      { label: "stars", value: "3.4k" },
      { label: "downloads", value: "120k" },
      { label: "extensions", value: "12" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/graphite" },
      { label: "demo", url: "https://graphite.dev" },
    ],
  },
];

export const research = [
  {
    title: "Sample-Efficient Reinforcement Learning",
    topic: "Reinforcement Learning",
    description:
      "Curriculum-based exploration strategies that improve sample efficiency on sparse-reward benchmarks by 2.3×.",
    methodology: "Curriculum + intrinsic motivation + Hindsight Experience Replay.",
    tech: ["PyTorch", "JAX", "OpenAI Gym"],
    link: "https://arxiv.org/abs/0000.00000",
  },
  {
    title: "Latent Diffusion for Cross-Modal Generation",
    topic: "Generative AI",
    description:
      "Joint embedding of text and audio for coherent soundscape generation from natural language prompts.",
    methodology: "CLAP-guided diffusion, classifier-free guidance sweeps.",
    tech: ["Diffusers", "CLAP", "PyTorch"],
    link: "https://arxiv.org/abs/0000.00001",
  },
  {
    title: "Layout-Aware Document Transformers",
    topic: "Computer Vision",
    description:
      "ViT pre-training with spatial augmentation that respects 2D document layout, improving form understanding.",
    methodology: "Masked image modeling + structure-aware pretraining.",
    tech: ["PyTorch", "TPU", "W&B"],
    link: "https://arxiv.org/abs/0000.00002",
  },
  {
    title: "Evaluating RAG Agents at Scale",
    topic: "NLP",
    description:
      "A benchmark + harness for evaluating multi-step retrieval agents across factuality, hallucination, and grounding.",
    methodology: "Adversarial eval set + LLM-as-judge with calibrated rubrics.",
    tech: ["LangChain", "Anthropic Claude", "Postgres"],
    link: "https://arxiv.org/abs/0000.00003",
  },
];

export const education = [
  {
    degree: "M.S. Computer Science",
    institution: "IISc Bangalore",
    focus: ["AI", "Machine Learning", "Systems"],
    period: "2021 — 2023",
    thesis: "Sample-Efficient RL for Sparse Reward Environments",
  },
  {
    degree: "B.E. Computer Science",
    institution: "NIT Trichy",
    focus: ["CS", "Mathematics", "Systems"],
    period: "2017 — 2021",
    thesis: "Graph Runtimes for TypeScript Data Pipelines",
  },
];

export const activity = {
  totalCommits: 4823,
  totalPRs: 412,
  totalIssues: 89,
  totalStars: 4312,
  topLanguages: [
    { name: "Python", value: 44 },
    { name: "TypeScript", value: 28 },
    { name: "Rust", value: 11 },
    { name: "C++", value: 9 },
    { name: "Other", value: 8 },
  ],
  // 52 weeks of dummy activity data
  weeks: Array.from({ length: 52 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ({
      w,
      d,
      count: Math.floor(((Math.sin(w * 0.7 + d) + 1) / 2) * 18 + (w % 3 === 0 ? 4 : 0)),
    }))
  ).flat(),
  streak: 187,
};

// Sidebar navigation
export const navItems = [
  { id: "hero", cellId: "1", label: "Introduce" },
  { id: "about", cellId: "2", label: "About" },
  { id: "skills", cellId: "3", label: "Skills" },
  { id: "experience", cellId: "4", label: "Experience" },
  { id: "ai_lab", cellId: "4.5", label: "AI Lab" },
  { id: "projects", cellId: "5", label: "Projects" },
  { id: "research", cellId: "6", label: "Research" },
  { id: "education", cellId: "7", label: "Education" },
  { id: "activity", cellId: "8", label: "Activity" },
  { id: "contact", cellId: "9", label: "Connect" },
];

export const bootSequence = [
  { line: ">>> python portfolio.py", delay: 0 },
  { line: "", delay: 200 },
  { line: "Initializing Nuha Nizar...", delay: 250 },
  { line: "Loading skills........ ✓", delay: 350 },
  { line: "Loading projects...... ✓", delay: 500 },
  { line: "Loading experience.... ✓", delay: 650 },
  { line: "Loading research...... ✓", delay: 800 },
  { line: "", delay: 900 },
  { line: "Portfolio ready.", delay: 1100 },
  { line: "", delay: 1300 },
  { line: ">>> run()", delay: 1500 },
];

export const commands = [
  { id: "hero", label: "go to introduce", shortcut: "g h" },
  { id: "about", label: "go to about", shortcut: "g a" },
  { id: "skills", label: "go to skills", shortcut: "g s" },
  { id: "experience", label: "go to experience", shortcut: "g e" },
  { id: "ai_lab", label: "go to ai lab", shortcut: "g ai" },
  { id: "projects", label: "go to projects", shortcut: "g p" },
  { id: "research", label: "go to research", shortcut: "g r" },
  { id: "education", label: "go to education", shortcut: "g ed" },
  { id: "activity", label: "go to activity", shortcut: "g ac" },
  { id: "contact", label: "go to connect", shortcut: "g c" },
  { id: "github", label: "open github", shortcut: "gh" },
  { id: "linkedin", label: "open linkedin", shortcut: "li" },
  { id: "hire", label: "hire nuha", shortcut: "!" },
  { id: "help", label: "show help", shortcut: "?" },
  { id: "restart", label: "restart notebook", shortcut: "r" },
  { id: "surprise", label: "surprise me", shortcut: "🎲" },
  { id: "theme", label: "toggle theme (soon)", shortcut: "t" },
];

export const personalityAnnotations: Array<{ id: string; section: string; text: string; tone?: "warm" | "wry" | "quiet" }> = [
  { id: "p1", section: "hero", text: "things I enjoy building at 2am", tone: "warm" },
  { id: "p2", section: "about", text: "currently learning: rust + cuda", tone: "quiet" },
  { id: "p3", section: "skills", text: "if you're reading this, hi 👋", tone: "warm" },
  { id: "p4", section: "ai_lab", text: "this is what training feels like from the inside", tone: "quiet" },
  { id: "p5", section: "projects", text: "probably overfitting at epoch 32, but the curve looks cinematic", tone: "wry" },
  { id: "p6", section: "contact", text: "I take my coffee the way I take my code: dark, fast, slightly bitter", tone: "wry" },
];

export const skillsGraph = {
  center: { id: "nuha", label: "NUHA", weight: 100 },
  domains: [
    { id: "ai", label: "AI", weight: 92, tools: ["PyTorch", "Transformers", "LangChain", "Diffusion", "RL"] },
    { id: "ml", label: "ML", weight: 90, tools: ["PyTorch", "TensorFlow", "JAX", "scikit-learn", "NumPy"] },
    { id: "sw", label: "Software", weight: 88, tools: ["Python", "TypeScript", "Rust", "C++", "Go"] },
    { id: "web", label: "Web", weight: 78, tools: ["Next.js", "React", "Three.js", "Tailwind", "Framer"] },
    { id: "data", label: "Data", weight: 85, tools: ["Pandas", "NumPy", "dbt", "Airflow", "SQL"] },
    { id: "cloud", label: "Cloud", weight: 80, tools: ["AWS", "Azure", "Docker", "Kubernetes", "GCP"] },
    { id: "research", label: "Research", weight: 84, tools: ["PyTorch", "JAX", "TPU", "W&B", "Triton"] },
  ],
};
