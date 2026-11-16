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
  whatsapp: "+91 7000590736",          // sticky action bar → https://wa.me/<digits>; set null to hide that button
  // Sticky bar headline: rotates through these lines (~4s each). `accent` words show in lime,
  // `note` is the small line underneath. Keep each headline under ~24 characters so it fits on phones.
  actionBar: [
    { lead: "Grow your", accent: "ecom business", note: "Speak to our team today" },
    { lead: "Got a product?", accent: "Let's talk", note: "Tell us what you're selling" },
    { lead: "Ready to", accent: "scale your store?", note: "We'd love to hear about it" },
    { lead: "Ads that", accent: "actually sell", note: "Say hi — we're listening" },
    { lead: "Your next", accent: "best-seller", note: "Starts with one chat" },
  ],
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
  label: "The team",
  title: ["Built by", "creators, for", "growth-minded", "brands."],
  accentFrom: 2,
  quote: null,                        // one-sentence founder belief
  bio: [null],                        // 1–2 short paragraphs
  // Shown in this order. Photos live in static/img/founders/ (shown in black & white on the site).
  // focus = CSS object-position for the 4:5 crop. Only list people who are actually on the team.
  people: [
    { name: "Shubham Jain", role: "Founder & Creative Director", photo: "founders/shubham-jain.webp", focus: "50% 30%", linkedin: null },
    { name: "Krupa Jain", role: "AI Ads Head", photo: "founders/krupa-jain.jpg", focus: "50% 36%", linkedin: null },
    { name: "Ashwin Pillai", role: "Performance Marketing Head", photo: "founders/ashwin-pillai.webp", focus: "50% 34%", linkedin: null },
    { name: "Dhruv Agarwal", role: "Performance Marketer", photo: "founders/dhruv-agarwal.jpg", focus: "50% 50%", linkedin: null },
  ],
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
  index: "Clients",
  label: "Selected brands",
  title: ["Trusted by Brands", "That Make a Difference"],
  accentFrom: 1,
  lead: "Proud to have collaborated with businesses and brands across different industries.",
  // Files live in static/logos/ (see the README there). Replace a placeholder file with the real
  // logo under the same name — the build detects placeholders and leaves them out of production.
  // Optional per logo: scale (optical size tweak, e.g. 1.3 for square badges next to wide wordmarks),
  // tone: "light" (dark-ink logo → always a light silhouette) or "lift" (light silhouette at rest, real colours on hover),
  // brightness: greyscale brightness at rest (default 1.3; lower for white-on-colour badges, higher for murky logos).
  logos: [
    { name: "Swiggy", src: "logos/swiggy.webp", brightness: 1.1 }, // official 2024 logo, Wikimedia Commons (CC0)
    { name: "Vritus Australia", src: "logos/vritus-australia.png", scale: 1.35, brightness: 1.2 },
    { name: "Extresy", src: "logos/extresy.png", tone: "light", scale: 0.8 },
    { name: "Virgin Thread", src: "logos/virgin-thread.png", tone: "light", scale: 1.3 },
    { name: "Solarhood", src: "logos/solarhood.webp", tone: "light", scale: 1.1 },
    { name: "Capt. Zack", src: "logos/capt-zack.png", scale: 1.4, brightness: 0.85 },
    { name: "Moodcare", src: "logos/moodcare.png", tone: "lift", scale: 0.95 },
    { name: "Avimee Herbal", src: "logos/avimee-herbal.png", tone: "light", scale: 1.2 },
    { name: "Goldy's Flower", src: "logos/goldys-flower.png", scale: 1.4, brightness: 1.9 },
    { name: "Hidden", src: "logos/hidden.png", scale: 1.25, brightness: 1.5 },
    { name: "Candid", src: "logos/candid.png", scale: 1.3 },
    // Still placeholders — shown in preview builds only, left out of production until real files are added:
    { name: "Greenveda", src: "logos/greenveda.svg" },
    { name: "MACC", src: "logos/macc.svg" },
    { name: "Jiva Herbals", src: "logos/jiva-herbals.svg" },
    { name: "Tarella Exotica", src: "logos/tarella-exotica.svg" },
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
  // Consultation form. `value`s are what's stored in the database (supabase/migrations/002_consultation_form.sql
  // lists the allowed values) — change labels freely, but keep values in sync with that file if you edit them.
  // `wide: true` makes an option span the full row.
  form: {
    intro: "4 quick steps — mostly taps, very little typing.",
    submit: "Book my consultation",
    reassurance: "Your information stays confidential. We'll use it only to understand your business and prepare for our conversation.",
    revenueCurrent: {
      question: "What is your current average monthly revenue?",
      options: [
        { value: "pre-revenue", label: "Pre-revenue / Just starting", wide: true },
        { value: "below-1l", label: "Below ₹1 Lakh" },
        { value: "1l-5l", label: "₹1L – ₹5L" },
        { value: "5l-10l", label: "₹5L – ₹10L" },
        { value: "10l-25l", label: "₹10L – ₹25L" },
        { value: "25l-50l", label: "₹25L – ₹50L" },
        { value: "50l-plus", label: "₹50L+" },
      ],
    },
    revenueTarget: {
      question: "What's your target monthly revenue?",
      options: [
        { value: "1l-5l", label: "₹1L – ₹5L" },
        { value: "5l-10l", label: "₹5L – ₹10L" },
        { value: "10l-25l", label: "₹10L – ₹25L" },
        { value: "25l-50l", label: "₹25L – ₹50L" },
        { value: "50l-1cr", label: "₹50L – ₹1Cr" },
        { value: "1cr-plus", label: "₹1Cr+" },
      ],
    },
    timeline: {
      question: "When do you want to achieve this?",
      options: [
        { value: "3m", label: "3 months" },
        { value: "6m", label: "6 months" },
        { value: "9m", label: "9 months" },
        { value: "12m", label: "12 months" },
        { value: "flexible", label: "Flexible timeline" },
      ],
    },
    challenges: {
      question: "What's the biggest challenge holding your business back right now?",
      hint: "Select all that apply",
      options: [
        { value: "leads", label: "Generating consistent leads" },
        { value: "conversion", label: "Converting leads into customers" },
        { value: "scaling", label: "Scaling revenue" },
        { value: "awareness", label: "Building brand awareness" },
        { value: "profitable-ads", label: "Running profitable ads" },
        { value: "website", label: "Improving website & online presence" },
        { value: "retention", label: "Customer retention" },
        { value: "not-sure", label: "Not sure where to start" },
      ],
      otherLabel: "Something else? (Optional)",
      otherPlaceholder: "Tell us briefly about your challenge...",
    },
  },
};

export const footer = {
  cta: "Have an idea worth noticing?",
};
