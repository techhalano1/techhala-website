import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "TechHala — AI that ships",
    description:
      "TechHala builds AI systems that plan, write, run, and operate software — and extend the same intelligence to robots and edge devices. AI SDLC, AIOps, AI Robot, and custom AI Solutions.",
    ogTitle: "TechHala — AI SDLC, AIOps, AI Robot & AI Solutions",
  },
  nav: {
    solutions: "Solutions",
    product: "HAL-SDLC",
    work: "Work",
    about: "About",
    contact: "Contact",
    bookDemo: "Book a demo",
    menu: "Menu",
    close: "Close",
  },
  common: {
    learnMore: "Learn more",
    viewAll: "View all",
    back: "Back",
    talkToUs: "Talk to us",
    industry: "Industry",
    challenge: "Challenge",
    solution: "Solution",
    results: "Results",
    relatedSolution: "Related solution",
    theme: "Toggle theme",
    language: "Language",
  },
  home: {
    hero: {
      eyebrow: "AI engineering studio",
      title: "AI that",
      highlight: "ships.",
      subtitle:
        "From intent to production — we build AI that plans, writes, verifies, and operates software, and bring the same intelligence to robots and the physical world.",
      primaryCta: "Book a demo",
      secondaryCta: "Explore solutions",
      terminal: [
        {
          cmd: 'hal plan "Customer portal with SSO and usage dashboard"',
          out: [
            "✓ Template selected: fullstack-feature",
            "✓ 6 sub-PRPs, 3 execution phases, DAG resolved",
            "✓ Architecture notes + acceptance criteria written",
          ],
        },
        {
          cmd: "hal execute",
          out: [
            "→ Phase 1/3: auth-service, schema  (2 agents)",
            "→ Phase 2/3: api, dashboard-ui     (2 agents)",
            "→ Phase 3/3: e2e-tests             (1 agent)",
          ],
        },
        {
          cmd: "hal review",
          out: [
            "10 personas · 0 P0 · 1 P2 autofixed",
            "Score 91/100 — APPROVED",
            "✓ Pull request opened with full audit trail",
          ],
        },
      ],
    },
    pillars: {
      eyebrow: "What we do",
      title: "Four pillars, one intelligence layer",
      subtitle:
        "Whether the problem lives in your codebase, your production systems, your factory floor, or your customer experience — we bring the same disciplined, traceable AI approach.",
    },
    lifecycle: {
      eyebrow: "How we work",
      title: "One loop from idea to operations",
      subtitle:
        "Most AI tools stop at code suggestions. We cover the whole lifecycle so that what gets built also gets verified, shipped, and kept healthy.",
      steps: [
        { name: "Ideate", desc: "Turn vague goals into ranked, feasible opportunities." },
        { name: "Plan", desc: "Structured specs with acceptance criteria and dependency graphs." },
        { name: "Build", desc: "Specialized agents implement in parallel, within your standards." },
        { name: "Verify", desc: "Independent multi-persona review, tests, and security gates." },
        { name: "Ship", desc: "Conventional commits, PRs, and a complete audit trail." },
        { name: "Operate", desc: "AIOps watches production, finds root causes, and remediates." },
      ],
    },
    product: {
      eyebrow: "Flagship product",
      title: "HAL-SDLC — the AI software development lifecycle engine",
      body:
        "Describe what you want in plain language. HAL produces a reviewable plan, orchestrates specialized agents to build it, and puts every deliverable through adversarial review before a pull request is opened. Every decision is traceable.",
      bullets: [
        "Plans, not prompts: structured specs your team can review before code exists",
        "Multi-agent execution across dependency phases",
        "Adversarial review with 10 personas and severity scoring",
        "Deploys inside your environment — your code never leaves",
      ],
      stats: [
        { value: "35+", label: "CLI commands" },
        { value: "10", label: "review personas" },
        { value: "8", label: "specialized templates" },
        { value: "100%", label: "traceable decisions" },
      ],
      cta: "See HAL-SDLC",
    },
    work: {
      eyebrow: "Selected work",
      title: "Solutions in production",
      subtitle: "A few of the systems we've designed and delivered.",
    },
    trust: {
      title: "Built on a modern, open ecosystem",
      items: [
        "OpenAI",
        "Anthropic",
        "ElevenLabs",
        "D-ID",
        "Cursor",
        "Model Context Protocol",
        "Next.js",
        "Python",
        "Kubernetes",
        "Playwright",
      ],
    },
    cta: {
      title: "Have a system to build — or one to keep running?",
      body: "Tell us about it. We'll come back with a concrete approach, not a slide deck.",
      button: "Start a conversation",
    },
  },
  solutions: {
    title: "Solutions",
    subtitle:
      "Four areas where we apply AI end-to-end — with the engineering rigor to put it in production.",
    sectionLabels: {
      problem: "The problem",
      approach: "Our approach",
      capabilities: "Capabilities",
      outcomes: "Outcomes",
      useCases: "Typical use cases",
    },
    items: [
      {
        slug: "ai-sdlc",
        name: "AI SDLC",
        tagline: "Turn business intent into traceable, reviewed, working software.",
        summary:
          "An AI-driven software development lifecycle: plan, build, verify, and ship with specialized agents — and keep humans in control of every decision.",
        problem: {
          title: "Code assistants speed up typing. They don't speed up delivery.",
          body:
            "Teams adopting AI coding tools see faster snippets but the same bottlenecks: unclear requirements, unreviewed output, inconsistent standards, and no record of why something was built. The result is more code with less confidence.",
        },
        approach: {
          title: "Lifecycle first, code second",
          steps: [
            {
              title: "Structured planning",
              body: "Business intent becomes a plan with acceptance criteria, architecture notes, and a dependency graph — reviewable before any code exists.",
            },
            {
              title: "Orchestrated build",
              body: "Specialized agents implement in parallel by phase, grounded in your conventions, documentation, and past decisions.",
            },
            {
              title: "Independent verification",
              body: "Separate reviewer agents score every deliverable across correctness, quality, security, and tests. Nothing merges on trust alone.",
            },
            {
              title: "Continuous learning",
              body: "Each cycle captures learnings back into the knowledge layer, so the next plan is better than the last.",
            },
          ],
        },
        capabilities: [
          { title: "HAL-SDLC platform", body: "Our engine for AI-driven planning, execution, and review — deployed inside your environment." },
          { title: "Agent enablement", body: "Skills, rules, and context so agents follow your architecture and standards." },
          { title: "Knowledge layer", body: "Your docs, ADRs, and codebase distilled into a searchable wiki agents actually use." },
          { title: "Quality gates", body: "Multi-persona review, security audit, test generation, and pre-ship polish." },
          { title: "IDE & MCP integration", body: "Works with Cursor and any MCP-compatible tooling your developers already use." },
          { title: "Adoption program", body: "Pilot, measure, and roll out across teams with clear governance." },
        ],
        outcomes: [
          "Faster idea-to-PR cycle with fewer review rounds",
          "Consistent standards across teams and repositories",
          "A complete audit trail for every AI-generated change",
          "Developers focused on judgment, not boilerplate",
        ],
        useCases: [
          "Modernizing a legacy platform module by module",
          "Building internal tools and customer portals at speed",
          "Scaling engineering output without scaling headcount",
          "Regulated environments that require traceability",
        ],
        cta: "Discuss an AI SDLC pilot",
      },
      {
        slug: "aiops",
        name: "AIOps",
        tagline: "Operations that detect, explain, and fix themselves.",
        summary:
          "Bring AI to production operations: anomaly detection, root-cause analysis, and guided or automated remediation across your infrastructure and applications.",
        problem: {
          title: "Alerts are cheap. Understanding is expensive.",
          body:
            "Modern systems generate more signals than any on-call team can read. Incidents take hours because the hard part isn't seeing the alert — it's correlating logs, metrics, traces, and changes to find the real cause.",
        },
        approach: {
          title: "From noise to root cause to action",
          steps: [
            { title: "Unify signals", body: "Connect metrics, logs, traces, deployments, and tickets into one operational context." },
            { title: "Detect intelligently", body: "Baseline normal behavior and surface real anomalies, not threshold noise." },
            { title: "Explain", body: "LLM-assisted root-cause analysis that correlates changes and dependencies into a readable incident narrative." },
            { title: "Remediate", body: "Runbooks executed by agents with approval gates — from guided suggestions to full auto-remediation." },
          ],
        },
        capabilities: [
          { title: "Anomaly detection", body: "Adaptive baselines across services, infrastructure, and business KPIs." },
          { title: "Root-cause analysis", body: "Change-aware correlation with plain-language explanations." },
          { title: "Agentic runbooks", body: "Codified remediation with human approval where it matters." },
          { title: "Incident copilot", body: "Chat-based assistant that answers 'what changed?' and 'who is affected?'." },
          { title: "Capacity & cost", body: "Forecasting and right-sizing recommendations for cloud spend." },
          { title: "Observability integration", body: "Works with your existing stack — Prometheus, Grafana, Datadog, ELK, and more." },
        ],
        outcomes: [
          "Shorter mean time to detect and resolve",
          "Fewer false-positive pages for on-call teams",
          "Incident reports written as the incident unfolds",
          "Lower cloud cost through data-driven right-sizing",
        ],
        useCases: [
          "24/7 operations for customer-facing platforms",
          "Kubernetes and microservice environments",
          "Hybrid and multi-cloud estates",
          "Teams moving from reactive to proactive operations",
        ],
        cta: "Discuss an AIOps assessment",
      },
      {
        slug: "ai-robot",
        name: "AI Robot",
        tagline: "Perception and decision-making for robots, cameras, and the edge.",
        summary:
          "Computer vision, edge inference, and agentic control that turn cameras and robots into systems that understand their environment and act on it.",
        problem: {
          title: "Sensors everywhere, intelligence nowhere.",
          body:
            "Cameras and robots collect enormous amounts of data, but most of it is reviewed after the fact — if at all. Turning perception into timely, reliable action requires models that run at the edge and decision logic that operators can trust.",
        },
        approach: {
          title: "See, understand, act",
          steps: [
            { title: "Perception", body: "Detection, tracking, and scene understanding tuned to your environment and hardware." },
            { title: "Edge deployment", body: "Optimized models running on-device for low latency, privacy, and resilience without connectivity." },
            { title: "Agentic control", body: "Event-driven logic and LLM reasoning that translate what is seen into safe, auditable actions." },
            { title: "Intelligent hub", body: "A central layer that coordinates devices, aggregates insights, and integrates with your systems." },
          ],
        },
        capabilities: [
          { title: "AI camera systems", body: "Safety, quality inspection, occupancy, and workflow analytics from existing camera feeds." },
          { title: "Edge inference", body: "Model optimization and deployment on Jetson, ARM, and industrial gateways." },
          { title: "Robot integration", body: "Perception and task planning for mobile and manipulation robots." },
          { title: "Digital twin & simulation", body: "Validate behavior in simulation before it reaches the floor." },
          { title: "Fleet management", body: "Monitor, update, and operate devices at scale." },
          { title: "Human-in-the-loop", body: "Review, override, and feedback loops that keep operators in control." },
        ],
        outcomes: [
          "Real-time alerts instead of after-the-fact review",
          "Higher consistency in inspection and safety compliance",
          "Data that flows into operations instead of sitting on disks",
          "Systems that keep working when the network doesn't",
        ],
        useCases: [
          "Manufacturing quality and safety monitoring",
          "Smart buildings, retail, and logistics analytics",
          "Warehouse and service robots",
          "Infrastructure inspection",
        ],
        cta: "Discuss a vision or robotics project",
      },
      {
        slug: "ai-solutions",
        name: "AI Solutions",
        tagline: "Custom AI products — from assistants to generative media.",
        summary:
          "End-to-end design and delivery of AI applications: enterprise assistants, voice and avatar companions, knowledge hubs, and generative content pipelines.",
        problem: {
          title: "A demo takes a day. A product takes discipline.",
          body:
            "Prototypes with large language models are easy. Reliable products — with grounding in your data, guardrails, evaluation, cost control, and a great user experience — are where most initiatives stall.",
        },
        approach: {
          title: "Product thinking with engineering rigor",
          steps: [
            { title: "Discover", body: "Identify the highest-value use cases and define what success looks like." },
            { title: "Design", body: "Conversation, voice, and interface design grounded in real user workflows." },
            { title: "Build", body: "Retrieval, orchestration, evaluation, and integration with your systems." },
            { title: "Run", body: "Monitoring, cost management, and continuous improvement after launch." },
          ],
        },
        capabilities: [
          { title: "Enterprise assistants", body: "Virtual assistants grounded in your knowledge, integrated with your tools." },
          { title: "Voice & avatar experiences", body: "Real-time speech-to-speech companions with lifelike, lip-synced avatars." },
          { title: "Knowledge hubs & RAG", body: "Turn documents and data into answers your teams and customers can trust." },
          { title: "Generative media", body: "Image and video generation pipelines for marketing, film, and product content." },
          { title: "Geospatial & data products", body: "Map-based and data-rich applications built for scale and search visibility." },
          { title: "Evaluation & guardrails", body: "Quality, safety, and cost controls measured continuously." },
        ],
        outcomes: [
          "AI experiences customers actually use — and return to",
          "Answers grounded in your data, with sources",
          "Predictable costs and measurable quality",
          "A platform you own, not a vendor lock-in",
        ],
        useCases: [
          "Customer service and sales assistants",
          "Companion and education apps",
          "Internal knowledge and expert systems",
          "Content and media production",
        ],
        cta: "Discuss an AI product",
      },
    ],
  },
  product: {
    eyebrow: "Product",
    title: "HAL-SDLC",
    subtitle:
      "The Heuristic AI Lifecycle for software development. Describe intent in plain language — HAL plans, orchestrates specialized agents, reviews adversarially, and ships with a full audit trail. Deployed privately, inside your environment.",
    primaryCta: "Request a private demo",
    secondaryCta: "Explore the AI SDLC approach",
    workflow: {
      title: "How it works",
      steps: [
        { name: "Plan", desc: "One sentence of intent becomes a structured pack: index, sub-tasks, architecture notes, acceptance criteria, and a dependency graph." },
        { name: "Validate", desc: "Structural gates score the plan before anyone writes code. Plan-level bugs are fixed where they're cheapest." },
        { name: "Execute", desc: "Agents implement in parallel by phase — engineers, reviewers, and planners each with a defined role." },
        { name: "Review", desc: "Independent reviewers with 10 personas score every deliverable with severity and confidence. Bounded autofix handles the small stuff." },
        { name: "Ship", desc: "Conventional commits, pull requests, and a complete decision log — ready for human approval." },
        { name: "Compound", desc: "Learnings are captured into the knowledge layer so the next cycle starts smarter." },
      ],
    },
    features: {
      title: "What sets it apart",
      items: [
        { title: "Plans your team can review", body: "Every build starts from a specification with explicit acceptance criteria and evidence — not from a chat transcript." },
        { title: "Multi-agent orchestration", body: "Dependency-aware phases assign work to specialized agents and keep them coordinated." },
        { title: "Adversarial review", body: "Architecture, security, performance, and adversarial personas review independently. Findings carry severity and confidence." },
        { title: "Three-layer knowledge", body: "Your documents, distilled and compiled into an interlinked wiki that agents query before they build." },
        { title: "Solo and full modes", body: "Lightweight flow for single-developer tasks; full orchestration for multi-service work. Same quality bar." },
        { title: "Privacy by default", body: "Runs in your environment. Sensitive names and terms are redacted from generated artifacts automatically." },
      ],
    },
    audiences: {
      title: "Who it's for",
      items: [
        { title: "Engineering leaders", body: "Scale delivery with governance, standards, and visibility built in." },
        { title: "Platform & DevEx teams", body: "Give every developer the same context, conventions, and quality gates." },
        { title: "Regulated industries", body: "Traceability from requirement to commit satisfies audit and compliance needs." },
      ],
    },
    delivery: {
      title: "Delivery & licensing",
      body: "HAL-SDLC is licensed privately to organizations and deployed within your own infrastructure. Commercial terms, support tiers, and update cadence are defined per agreement.",
      items: [
        "Private distribution — tagged releases or checksummed archives",
        "Works with Cursor and MCP-compatible tooling",
        "Installation, onboarding, and support included per tier",
        "Optional customization of templates, skills, and review personas",
      ],
    },
    faq: {
      title: "Frequently asked",
      items: [
        { q: "Does HAL replace our developers?", a: "No. HAL removes boilerplate and coordination overhead so developers spend their time on judgment, architecture, and review. A human approves every pull request." },
        { q: "Which languages and stacks are supported?", a: "HAL is stack-agnostic at the planning and review level and ships templates for TypeScript, Python, and common web and service architectures. Additional stacks are added through templates and distillations." },
        { q: "Where does our code go?", a: "Nowhere. HAL runs inside your environment and connects to the model providers you approve. Generated artifacts stay in your repositories." },
        { q: "How do we start?", a: "A short pilot on a real backlog item: we install HAL, plan and execute together, and measure cycle time and review quality against your baseline." },
      ],
    },
  },
  work: {
    title: "Work",
    subtitle: "Selected solutions we've designed and delivered. Details are shared under NDA where required.",
    items: [
      {
        slug: "enterprise-virtual-assistant",
        title: "Enterprise virtual assistant for a retail group",
        client: "Retail & consumer",
        industry: "Retail",
        pillar: "ai-solutions",
        summary: "A multilingual virtual assistant that answers customer and staff questions from company knowledge and connects to internal systems.",
        challenge: "Support teams handled repetitive questions across channels while policies and product information changed weekly. Existing chatbots were rule-based and fell behind.",
        solution: "We designed a retrieval-grounded assistant with conversation design tailored to the brand, connected to knowledge sources and internal APIs, with evaluation and escalation to human agents built in.",
        results: ["Consistent answers across web and messaging channels", "Knowledge updates reflected without retraining", "Clear handoff to human agents with full context"],
      },
      {
        slug: "voice-ai-companion",
        title: "Real-time voice companion with lip-synced avatars",
        client: "Consumer app",
        industry: "Consumer & education",
        pillar: "ai-solutions",
        summary: "A speech-to-speech companion app where users create characters with their own persona, voice, and animated avatar.",
        challenge: "Deliver natural, low-latency voice conversations with expressive video avatars across iOS, Android, and web — with a small team.",
        solution: "We built a multimodal pipeline — speech recognition, in-character reasoning, high-quality speech synthesis, and lip-synced video — behind a mobile-first experience for creating and talking with companions.",
        results: ["Cross-platform release from a single codebase", "Persona-consistent conversations with custom voices", "Video avatars synchronized to generated speech"],
      },
      {
        slug: "generative-film-pipeline",
        title: "Generative image & video pipeline for film concepts",
        client: "Media & entertainment",
        industry: "Media",
        pillar: "ai-solutions",
        summary: "A production pipeline that turns scripts and prompts into consistent concept imagery and short video sequences.",
        challenge: "Concept development for film required many iterations of visuals and motion tests that were slow and expensive to produce traditionally.",
        solution: "We built an orchestrated pipeline using state-of-the-art image and video generation models with prompt management, style consistency, and review workflows for the creative team.",
        results: ["Concept iterations in hours instead of weeks", "Consistent visual style across scenes", "Creative team focused on direction, not tooling"],
      },
      {
        slug: "geospatial-heritage-platform",
        title: "Nationwide geospatial heritage platform",
        client: "Culture & tourism",
        industry: "Public & tourism",
        pillar: "ai-solutions",
        summary: "A bilingual, map-based registry of more than 3,000 cultural sites with AI-assisted data enrichment and search-optimized pages.",
        challenge: "Site information was scattered across sources, inconsistent, and unavailable in a modern, searchable format.",
        solution: "We built automated ingestion and AI-assisted enrichment pipelines, a clustered interactive map, and thousands of statically generated bilingual pages optimized for search and mobile.",
        results: ["3,000+ sites mapped and enriched", "Fast, static-first pages ranking for local search", "Bilingual content with province, route, and festival discovery"],
      },
      {
        slug: "ai-sdlc-adoption",
        title: "AI SDLC engine built with itself",
        client: "TechHala",
        industry: "Software",
        pillar: "ai-sdlc",
        summary: "HAL-SDLC's own skills, agents, and services are planned, built, and reviewed by HAL — the strongest test of the approach.",
        challenge: "Prove that AI-driven planning and multi-agent execution can produce production-grade software with traceability, not just demos.",
        solution: "Every new capability — from review personas to internal APIs — runs through HAL's plan → execute → review → ship loop, with learnings compounded back into the knowledge layer.",
        results: ["Self-bootstrapping platform with a full decision log", "Independent review on every deliverable", "Methodology validated before offering it to customers"],
      },
    ],
  },
  about: {
    title: "About TechHala",
    subtitle: "An AI engineering studio building systems that plan, build, operate, and perceive.",
    mission: {
      title: "Our mission",
      body: "Make AI a dependable engineering discipline — traceable, reviewable, and in production — across software, operations, and the physical world.",
    },
    values: [
      { title: "Traceable by default", body: "Every AI decision should have a reason you can read and a record you can audit." },
      { title: "Humans in control", body: "Agents do the work; people make the calls. We design for approval gates, not blind automation." },
      { title: "Production over demos", body: "We measure ourselves by what runs reliably for users, not what looks good in a video." },
      { title: "Compound learning", body: "Every project feeds knowledge back into the next one — for us and for our clients." },
    ],
    story: {
      title: "Our story",
      paragraphs: [
        "TechHala started with a simple frustration: AI could write code, but nobody could explain why it wrote what it did — or trust it enough to ship. We set out to build the missing lifecycle around AI: planning, verification, and operations.",
        "That work became HAL-SDLC, our AI software development lifecycle engine, and shaped how we approach every problem — from keeping production systems healthy to teaching cameras and robots to act on what they see.",
        "Today we partner with organizations in Vietnam and internationally to design, build, and operate AI systems that hold up in the real world.",
      ],
    },
    stats: [
      { value: "4", label: "solution pillars" },
      { value: "1", label: "flagship platform" },
      { value: "VN + Global", label: "clients served" },
      { value: "100%", label: "human-approved delivery" },
    ],
  },
  contact: {
    title: "Let's talk",
    subtitle: "Tell us about the system you want to build or operate. We reply within two business days with a concrete next step.",
    form: {
      name: "Name",
      email: "Work email",
      company: "Company",
      topic: "I'm interested in",
      topics: ["AI SDLC / HAL-SDLC", "AIOps", "AI Robot & Vision", "AI Solutions", "Partnership", "Other"],
      message: "What are you working on?",
      submit: "Send message",
      sending: "Sending…",
      success: "Thanks — we've received your message and will be in touch shortly.",
      error: "Something went wrong. Please email us directly instead.",
    },
    aside: {
      title: "Prefer email?",
      body: "Reach the team directly and we'll route you to the right person.",
      email: "hello@techhala.com",
      location: "Vietnam · working with clients worldwide",
    },
  },
  footer: {
    tagline: "AI that ships — across software, operations, and the physical world.",
    solutions: "Solutions",
    company: "Company",
    rights: "All rights reserved.",
  },
};
