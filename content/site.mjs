/* ==========================================================================
   SITE CONTENT — the only file the client needs to edit for copy changes.

   Placeholder convention (blueprint §16.3):
   - `null`  → missing business data. Renders a dashed lime [PLACEHOLDER] chip
               in preview builds; filtered/hidden in production builds.
   - `isPlaceholder: true` on a list item → sample entry, removed in production.
   - Strings wrapped in [SQUARE BRACKETS] → must be confirmed before launch.
   ========================================================================== */

export const site = {
  name: "AdverBright",                 // [CONFIRM] taken from the reference site
  nameSuffix: "Media",
  legalName: "AdverBright Media",      // [CONFIRM]
  url: "https://example.github.io",    // [PLACEHOLDER] set SITE_URL at build time
  email: null,                         // e.g. "hello@adverbright.com"
  phone: null,                         // optional, e.g. "+91 98xxxxxxx"
  location: null,                      // e.g. "Indore, India"
  responseTime: "24 hours",            // [CONFIRM] promise shown in hero + contact
  currency: "$",                       // [CONFIRM] reference uses USD; switch to "₹" for India
  socials: [
    { label: "Instagram", href: null },
    { label: "LinkedIn", href: null },
    { label: "YouTube", href: null },
  ],
  seo: {
    title: "AdverBright — AI-Powered Creative & Advertising Agency",
    description:
      "AI ad creatives, UGC, video and performance creative for brands that need ads people stop for. Strategy to scale, built to convert.",
  },
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "AI-powered creative agency",
  title: ["We make ads", "people", "actually", "stop for."],
  accentFrom: 3,
  lead:
    "We help ambitious brands turn attention into growth — AI ad creatives, creator content and video, made to perform on every feed.",
  micro: "Replies within 24 hours · Project-based, no retainer required", // [CONFIRM]
  footerLine: "Creative for brands that would rather be remembered than scrolled past.",
  orbitLabels: ["AI", "UGC", "Video", "Performance", "Brand"],
};

export const services = {
  index: "01",
  label: "What we do",
  title: ["Five ways to", "win the", "scroll."],
  accentFrom: 1,
  aside:
    "Each service stands on its own, and they work best together — from the first idea and hook to the version that scales your spend.",
  items: [
    {
      slug: "ai-ad-creatives",
      title: "AI Ad Creatives",
      description: "High-volume static and carousel ads, art-directed by humans and produced with AI so you can test more ideas, faster.",
      tags: ["Static ads", "Carousels", "Variations at scale"],
      preview: "service-ai",
    },
    {
      slug: "ugc-creator-ads",
      title: "UGC & Creator Ads",
      description: "Native-feeling creator content with scripts and hooks engineered for the first three seconds.",
      tags: ["Creator sourcing", "Scripts", "Hooks"],
      preview: "service-ugc",
    },
    {
      slug: "video-production",
      title: "Video Production",
      description: "Product films, motion pieces and sharp edits cut for every placement and aspect ratio.",
      tags: ["Product films", "Motion", "Edits"],
      preview: "service-video",
    },
    {
      slug: "performance-creatives",
      title: "Performance Creatives",
      description: "Structured creative testing — hooks, angles and offers — so the winners are found by data, not opinion.",
      tags: ["Hook testing", "Offer angles", "Iteration"],
      preview: "service-performance",
    },
    {
      slug: "brand-content",
      title: "Brand Content",
      description: "Social content and visual systems that make every post recognisably yours.",
      tags: ["Social content", "Visual identity", "Storytelling"],
      preview: "service-brand",
    },
  ],
};

export const work = {
  index: "02",
  label: "Selected work",
  title: ["Proof, not", "promises."],
  accentFrom: 1,
  aside: "A selection of recent campaigns — the idea, the format and what it moved.",
  projects: [
    {
      slug: "project-alpha", isPlaceholder: true,
      title: "Project Alpha", category: "AI", format: "9:16", platform: "Meta",
      client: null, result: null, image: "project-alpha",
      alt: "Chrome torus sculpture with lime light trails on a black studio background",
      brief: null, idea: null, outcome: null, year: null,
    },
    {
      slug: "project-beta", isPlaceholder: true,
      title: "Project Beta", category: "UGC", format: "4:5", platform: "Instagram",
      client: null, result: null, image: "project-beta",
      alt: "Stacked liquid-chrome form reflecting lime light on black",
      brief: null, idea: null, outcome: null, year: null,
    },
    {
      slug: "project-gamma", isPlaceholder: true,
      title: "Project Gamma", category: "Video", format: "16:9", platform: "YouTube",
      client: null, result: null, image: "project-gamma",
      alt: "Twisted chrome column lit by a lime strip light",
      brief: null, idea: null, outcome: null, year: null,
    },
    {
      slug: "project-delta", isPlaceholder: true,
      title: "Project Delta", category: "Performance", format: "1:1", platform: "Meta",
      client: null, result: null, image: "project-delta",
      alt: "Perforated chrome sphere with lime reflections",
      brief: null, idea: null, outcome: null, year: null,
    },
  ],
};

export const results = {
  index: "03",
  label: "The intent",
  title: ["Ideas are the", "means.", "Growth is", "the point."],
  accentFrom: 2,
  aside: null, // e.g. "We measure every creative against the metric you care about — CPA, ROAS or thumb-stop rate."
  statement: "Every concept we ship is tied to a number you care about.",
  stats: [
    { value: null, suffix: "%", label: "Average lift in click-through rate" },
    { value: null, suffix: "+", label: "Ad creatives delivered" },
    { value: null, suffix: "+", label: "Brands served" },
    { value: null, suffix: "%", label: "Clients who come back" },
  ],
};

export const process = {
  index: "04",
  label: "How we work",
  title: ["Brief to", "breakthrough."],
  accentFrom: 1,
  aside: "A clear five-step loop. You always know what's happening and what's next.",
  steps: [
    { title: "Discover", description: "We learn your product, audience, numbers and what has already been tried." },
    { title: "Strategize", description: "Angles, hooks and formats are mapped to each stage of your funnel." },
    { title: "Create", description: "Concepts become finished ads — static, UGC and video — in every ratio you need." },
    { title: "Test", description: "Variations go live in structured tests so results show what to keep." },
    { title: "Scale", description: "Winners get iterated and expanded; underperformers inform the next round." },
  ],
};

export const why = {
  index: "05",
  label: "The difference",
  title: ["Why brands", "choose us."],
  accentFrom: 1,
  items: [
    { title: "AI speed, human taste", description: "AI multiplies output; experienced art direction decides what's actually good." },
    { title: "Days, not weeks", description: "Short production cycles keep your ad account fed with fresh creative." },
    { title: "Volume that's useful", description: "Enough variations to test properly, each with a clear hypothesis behind it." },
    { title: "Performance mindset", description: "We judge creative by the results it drives, not by how it looks in a deck." },
    { title: "Platform-native", description: "Made for how people really scroll on Meta, TikTok, YouTube and beyond." },
  ],
};

export const founder = {
  index: "06",
  label: "The founder",
  title: ["Built by a", "creator, for", "growth-minded", "brands."],
  accentFrom: 2,
  name: "Shubham Jain",              // [CONFIRM] from the reference site
  firstName: "Shubham",
  role: "Founder & Creative Director", // [CONFIRM]
  quote: null,                        // one-sentence founder belief
  bio: [null],                        // 1–2 short paragraphs
  linkedin: null,
  photo: null,                        // set to an image name in static/img once supplied
};

export const testimonials = {
  index: "07",
  label: "What clients say",
  title: ["Good work gets", "talked about."],
  accentFrom: 1,
  items: [
    { isPlaceholder: true, quote: null, name: null, role: null, brand: null },
    { isPlaceholder: true, quote: null, name: null, role: null, brand: null },
    { isPlaceholder: true, quote: null, name: null, role: null, brand: null },
  ],
};

export const trust = {
  marquee: "Trusted by ambitious brands",
  logos: [
    // { name: "Brand", src: "logos/brand.svg" }  — SVG, monochrome
    { isPlaceholder: true, name: "Client 01" },
    { isPlaceholder: true, name: "Client 02" },
    { isPlaceholder: true, name: "Client 03" },
    { isPlaceholder: true, name: "Client 04" },
    { isPlaceholder: true, name: "Client 05" },
  ],
};

export const contact = {
  index: "08",
  label: "Start a project",
  title: ["Let's make", "something", "impossible", "to ignore."],
  accentFrom: 2,
  nextSteps: [
    "We reply within 24 hours",                // [CONFIRM]
    "A 20-minute call to understand your goals", // [CONFIRM]
    "You receive a creative plan and quote",   // [CONFIRM]
  ],
  budgets: ["Under 2k", "2k – 5k", "5k – 10k", "10k+"], // prefixed with site.currency
};

export const footer = {
  cta: "Have an idea worth noticing?",
};
