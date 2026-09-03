export type PillarSlug = "ai-robot" | "ai-sdlc" | "ai-enterprise";

export const pillarSlugs: readonly PillarSlug[] = ["ai-robot", "ai-sdlc", "ai-enterprise"];

export type Pillar = {
  slug: PillarSlug;
  name: string;
  tagline: string;
  summary: string;
  problem: { title: string; body: string };
  approach: { title: string; steps: { title: string; body: string }[] };
  capabilities: { title: string; body: string }[];
  outcomes: string[];
  useCases: string[];
  cta: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  pillar: PillarSlug;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
};

export type Dictionary = {
  meta: { title: string; description: string; ogTitle: string };
  nav: {
    solutions: string;
    product: string;
    work: string;
    about: string;
    contact: string;
    bookDemo: string;
    menu: string;
    close: string;
  };
  common: {
    learnMore: string;
    viewAll: string;
    back: string;
    talkToUs: string;
    industry: string;
    challenge: string;
    solution: string;
    results: string;
    relatedSolution: string;
    theme: string;
    language: string;
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      highlight: string;
      subtitle: string;
      primaryCta: string;
      secondaryCta: string;
      terminal: { cmd: string; out: string[] }[];
    };
    pillars: { eyebrow: string; title: string; subtitle: string };
    lifecycle: {
      eyebrow: string;
      title: string;
      subtitle: string;
      steps: { name: string; desc: string }[];
    };
    product: {
      eyebrow: string;
      title: string;
      body: string;
      bullets: string[];
      stats: { value: string; label: string }[];
      cta: string;
    };
    work: { eyebrow: string; title: string; subtitle: string };
    trust: { title: string; items: string[] };
    cta: { title: string; body: string; button: string };
  };
  solutions: {
    title: string;
    subtitle: string;
    sectionLabels: {
      problem: string;
      approach: string;
      capabilities: string;
      outcomes: string;
      useCases: string;
    };
    items: Pillar[];
  };
  product: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    workflow: { title: string; steps: { name: string; desc: string }[] };
    features: { title: string; items: { title: string; body: string }[] };
    audiences: { title: string; items: { title: string; body: string }[] };
    delivery: { title: string; body: string; items: string[] };
    faq: { title: string; items: { q: string; a: string }[] };
  };
  work: {
    title: string;
    subtitle: string;
    items: CaseStudy[];
  };
  about: {
    title: string;
    subtitle: string;
    mission: { title: string; body: string };
    values: { title: string; body: string }[];
    story: { title: string; paragraphs: string[] };
    stats: { value: string; label: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      company: string;
      topic: string;
      topics: string[];
      message: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
    };
    aside: { title: string; body: string; email: string; location: string };
  };
  footer: {
    tagline: string;
    solutions: string;
    company: string;
    rights: string;
  };
};
