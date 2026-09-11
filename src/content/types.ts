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

export type ProductCategory = "education" | "home" | "combo" | "accessory";

export const productCategories: readonly ProductCategory[] = ["education", "home", "combo", "accessory"];

export type ProductArtVariant =
  | "mini"
  | "buddy"
  | "pro"
  | "home"
  | "care"
  | "combo-siblings"
  | "combo-study"
  | "combo-family"
  | "dock"
  | "case"
  | "cards"
  | "bag"
  | "premium";

export type ProductTint = "pink" | "yellow" | "blue" | "green" | "purple" | "peach";

export type AgeGroup = "4-8" | "6-12" | "9-15" | "family" | "seniors";

export const ageGroups: readonly AgeGroup[] = ["4-8", "6-12", "9-15", "family", "seniors"];

export type ProductColor = { id: string; name: string; hex: string };

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  art: ProductArtVariant;
  tint: ProductTint;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  sold: number;
  freeShipping: boolean;
  ages: AgeGroup[];
  ageLabel?: string;
  colors?: ProductColor[];
  badge?: string;
  audience: string;
  summary: string;
  highlights: string[];
  features: { title: string; body: string }[];
  specs: { label: string; value: string }[];
  inBox: string[];
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
    products: string;
    solutions: string;
    work: string;
    about: string;
    contact: string;
    shopNow: string;
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
  shop: {
    priceFrom: string;
    buyNow: string;
    addToOrder: string;
    viewDetails: string;
    contactUs: string;
    callUs: string;
    zalo: string;
    email: string;
    address: string;
    phone: string;
    categories: Record<ProductCategory, { name: string; short: string }>;
    ages: Record<AgeGroup, { name: string; short: string }>;
    labels: {
      audience: string;
      highlights: string;
      features: string;
      specs: string;
      inBox: string;
      related: string;
      allProducts: string;
      priceNote: string;
      freeShipping: string;
      sold: string;
      reviews: string;
      save: string;
      color: string;
      age: string;
      inStock: string;
      filterAll: string;
      filterCategory: string;
      filterAge: string;
      filterPrice: string;
      sortBy: string;
      sortOptions: { id: "popular" | "price-asc" | "price-desc" | "rating"; label: string }[];
      results: string;
      noResults: string;
      clearFilters: string;
      priceRanges: { id: string; label: string; min: number; max?: number }[];
    };
    cart: {
      title: string;
      open: string;
      close: string;
      empty: string;
      emptyCta: string;
      addToCart: string;
      added: string;
      remove: string;
      subtotal: string;
      shippingFree: string;
      checkout: string;
      continueShopping: string;
      items: string;
      quantity: string;
    };
    guarantees: { title: string; body: string }[];
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      highlight: string;
      subtitle: string;
      primaryCta: string;
      secondaryCta: string;
      bullets: string[];
      priceBadge: string;
    };
    strip: string[];
    stats: { value: string; label: string }[];
    bubbles: { robot: string; child: string };
    ages: { eyebrow: string; title: string; subtitle: string };
    categories: { eyebrow: string; title: string; subtitle: string };
    catalog: { eyebrow: string; title: string; subtitle: string };
    bundles: { eyebrow: string; title: string; subtitle: string };
    testimonials: { eyebrow: string; title: string; items: { quote: string; name: string; role: string }[] };
    why: { eyebrow: string; title: string; subtitle: string; items: { title: string; body: string }[] };
    steps: { eyebrow: string; title: string; subtitle: string; items: { name: string; desc: string }[] };
    family: { eyebrow: string; title: string; body: string; bullets: string[]; cta: string };
    faq: { title: string; items: { q: string; a: string }[] };
    solutions: { eyebrow: string; title: string; body: string; cta: string };
    cta: { title: string; body: string; primary: string; secondary: string };
  };
  products: {
    title: string;
    subtitle: string;
    items: Product[];
  };
  checkout: {
    title: string;
    subtitle: string;
    noProduct: string;
    chooseProduct: string;
    addMore: string;
    summary: string;
    quantity: string;
    shipping: string;
    total: string;
    form: {
      name: string;
      phone: string;
      email: string;
      address: string;
      note: string;
      payment: string;
      submit: string;
      sending: string;
    };
    payments: { id: "cod" | "bank" | "online"; name: string; body: string; available: boolean }[];
    success: { title: string; body: string; orderCode: string; next: string[] };
    error: string;
    support: { title: string; body: string };
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
    relatedWork: string;
    flagship: { eyebrow: string; title: string; body: string; cta: string };
    cta: { title: string; body: string; button: string };
    items: Pillar[];
  };
  product: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    terminal: { cmd: string; out: string[] }[];
    stats: { value: string; label: string }[];
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
    aside: { title: string; body: string; hours: string; visit: string };
  };
  footer: {
    tagline: string;
    products: string;
    solutions: string;
    company: string;
    contact: string;
    rights: string;
  };
};
