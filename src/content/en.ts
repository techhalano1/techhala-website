import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "TechHala — AI that ships",
    description:
      "TechHala builds intelligent robots for education, AI-driven software development, and enterprise AI services — chatbots, assistants, and private AI platforms deployed in production.",
    ogTitle: "TechHala — AI Robot, AI for SDLC & AI for Enterprise",
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
        "We build intelligence that teaches through robots, that plans, writes, and verifies software, and that runs as dependable AI services inside the enterprise.",
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
      title: "Three focus areas, one intelligence layer",
      subtitle:
        "Whether the problem lives in a classroom, in your codebase, or across your organization — we bring the same disciplined, production-grade AI approach.",
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
        { name: "Operate", desc: "Monitor, evaluate, and improve AI services and systems in production." },
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
      "Three areas where we apply AI end-to-end — with the engineering rigor to put it in production.",
    sectionLabels: {
      problem: "The problem",
      approach: "Our approach",
      capabilities: "Capabilities",
      outcomes: "Outcomes",
      useCases: "Typical use cases",
    },
    items: [
      {
        slug: "ai-robot",
        name: "AI Robot",
        tagline: "Intelligent robots that teach, talk, and learn with people.",
        summary:
          "We build the intelligence layer for educational and service robots: natural conversation, speech and vision, adaptive tutoring — starting with robots that help children and adults learn English.",
        problem: {
          title: "Robots can move. Very few can hold a conversation worth having.",
          body:
            "Most educational robots run scripted dialogues that children outgrow in a week, and language learners rarely get enough real speaking practice with a patient partner. The hardware exists — what's missing is intelligence that listens, understands, adapts to each learner, and stays safe for the classroom and the home.",
        },
        approach: {
          title: "Listen, understand, teach, adapt",
          steps: [
            { title: "Natural conversation", body: "Low-latency speech-to-speech with a consistent personality, so the robot feels like a companion, not a menu." },
            { title: "Pedagogy built in", body: "Lesson plans, vocabulary progression, pronunciation feedback, and games designed with educators and mapped to CEFR levels." },
            { title: "Perception & presence", body: "Vision and voice let the robot recognize learners, read engagement, and respond with expression and gesture." },
            { title: "Learn from every session", body: "Progress tracking for teachers and parents; the tutor adapts difficulty and topics to each learner." },
          ],
        },
        capabilities: [
          { title: "English-learning companion", body: "Conversational practice, pronunciation coaching, vocabulary games, and story time — tuned for kids and adult learners." },
          { title: "Conversational brain", body: "Speech recognition, LLM reasoning with guardrails, and expressive speech synthesis — running on-device or hybrid." },
          { title: "Vision & engagement", body: "Face and gesture recognition, attention cues, and object recognition for interactive lessons." },
          { title: "Teacher & parent dashboard", body: "Session summaries, progress by skill, and content controls." },
          { title: "Robot & hardware integration", body: "Integration with humanoid, tabletop, and mobile robot platforms — motion, LEDs, screens, and sensors." },
          { title: "Safety & privacy", body: "Age-appropriate content filters, on-device processing where possible, and parental consent flows." },
        ],
        outcomes: [
          "More speaking practice per learner than any classroom can offer",
          "Engagement that lasts beyond the novelty week",
          "Measurable progress for teachers and parents",
          "One intelligence platform across robot models",
        ],
        useCases: [
          "English-learning robots for kindergartens and primary schools",
          "Home tutoring companions for children",
          "Language centers and self-study kiosks",
          "Reception, museum, and service robots that converse naturally",
        ],
        cta: "Discuss an education robot project",
      },
      {
        slug: "ai-sdlc",
        name: "AI for SDLC",
        tagline: "Turn business intent into traceable, reviewed, working software.",
        summary:
          "An AI-driven software development lifecycle: plan, build, verify, and ship with specialized agents — and keep humans in control of every decision. Powered by our HAL-SDLC platform.",
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
        slug: "ai-enterprise",
        name: "AI for Enterprise",
        tagline: "Chatbots, assistants, and AI services deployed securely inside your organization.",
        summary:
          "From customer-facing chatbots to internal copilots and private AI platforms — we design, build, deploy, and operate AI services that fit your data, your systems, and your compliance requirements.",
        problem: {
          title: "A demo takes a day. A production AI service takes discipline.",
          body:
            "Prototypes with large language models are easy. Reliable enterprise services — grounded in your data, integrated with your systems, secured, evaluated, cost-controlled, and monitored in production — are where most initiatives stall.",
        },
        approach: {
          title: "From use case to running service",
          steps: [
            { title: "Discover", body: "Identify the highest-value use cases, data sources, and success metrics with your business and IT teams." },
            { title: "Design", body: "Conversation design, knowledge architecture, and integration blueprint aligned with security and compliance." },
            { title: "Build & integrate", body: "Retrieval, orchestration, guardrails, and connectors to CRM, ERP, ticketing, and identity systems." },
            { title: "Deploy & operate", body: "Private or hybrid deployment, observability, cost management, evaluation, and continuous improvement." },
          ],
        },
        capabilities: [
          { title: "Customer service chatbots", body: "Multilingual assistants for web, app, and messaging channels — grounded in your knowledge with human handoff." },
          { title: "Employee assistants & copilots", body: "Internal copilots for HR, IT, sales, and operations that answer from policies and act in your tools." },
          { title: "Knowledge hubs & RAG", body: "Documents, databases, and tickets turned into trusted answers with citations and access control." },
          { title: "Private AI platform", body: "LLM gateway, model hosting, and vector infrastructure deployed in your cloud or on-premises." },
          { title: "AI service operations", body: "Monitoring, evaluation, cost control, and incident response for AI in production — including AIOps for your platforms." },
          { title: "Generative content & data products", body: "Image, video, and document generation pipelines plus data-rich applications built for scale." },
        ],
        outcomes: [
          "Assistants that resolve requests, not just deflect them",
          "Answers grounded in your data, with sources and permissions respected",
          "Predictable costs and measurable quality after launch",
          "A platform you own — no vendor lock-in",
        ],
        useCases: [
          "Customer support and sales assistants for retail, banking, and telecom",
          "Internal knowledge assistants for large organizations",
          "Deploying private LLM services for regulated industries",
          "Content, media, and data platforms powered by generative AI",
        ],
        cta: "Discuss an enterprise AI project",
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
        pillar: "ai-enterprise",
        summary: "A multilingual virtual assistant that answers customer and staff questions from company knowledge and connects to internal systems.",
        challenge: "Support teams handled repetitive questions across channels while policies and product information changed weekly. Existing chatbots were rule-based and fell behind.",
        solution: "We designed a retrieval-grounded assistant with conversation design tailored to the brand, connected to knowledge sources and internal APIs, with evaluation and escalation to human agents built in.",
        results: ["Consistent answers across web and messaging channels", "Knowledge updates reflected without retraining", "Clear handoff to human agents with full context"],
      },
      {
        slug: "voice-ai-companion",
        title: "Real-time voice companion for conversation practice",
        client: "Consumer app",
        industry: "Education & consumer",
        pillar: "ai-robot",
        summary: "A speech-to-speech companion where learners talk with characters that have their own persona, voice, and animated face — the conversational brain we bring to educational robots.",
        challenge: "Deliver natural, low-latency voice conversations with expressive, lip-synced avatars across iOS, Android, and web — engaging enough that learners keep practicing.",
        solution: "We built a multimodal pipeline — speech recognition, in-character reasoning with guardrails, high-quality speech synthesis, and lip-synced video — behind a mobile-first experience for creating and talking with companions.",
        results: ["Cross-platform release from a single codebase", "Persona-consistent conversations with custom voices", "Same pipeline now powering robot conversation and tutoring"],
      },
      {
        slug: "generative-film-pipeline",
        title: "Generative image & video pipeline for film concepts",
        client: "Media & entertainment",
        industry: "Media",
        pillar: "ai-enterprise",
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
        pillar: "ai-enterprise",
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
    subtitle: "An AI engineering studio building intelligence for robots, software teams, and the enterprise.",
    mission: {
      title: "Our mission",
      body: "Make AI a dependable engineering discipline — traceable, reviewable, and in production — whether it teaches a child, builds software, or serves an organization.",
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
        "That work became HAL-SDLC, our AI software development lifecycle engine, and shaped how we approach every problem — from deploying AI services inside enterprises to giving educational robots a voice that listens, understands, and teaches.",
        "Today we partner with organizations in Vietnam and internationally to design, build, and operate AI systems that hold up in the real world.",
      ],
    },
    stats: [
      { value: "3", label: "focus areas" },
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
      topics: ["AI Robot / Education", "AI for SDLC / HAL-SDLC", "AI for Enterprise", "Partnership", "Other"],
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
    tagline: "AI that ships — for robots, software teams, and the enterprise.",
    solutions: "Solutions",
    company: "Company",
    rights: "All rights reserved.",
  },
};
