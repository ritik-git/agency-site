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
  email: "adverbrightmedia@gmail.com",
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
  metaPixelId: "2122808599108432",     // Meta (Facebook) Pixel — loaded on production builds only; null to remove
  currency: "$",                       // [CONFIRM] reference uses USD; switch to "₹" for India
  socials: [
    { label: "Instagram", handle: "@adverbrightmedia", href: "https://www.instagram.com/adverbrightmedia/" },
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
  index: "02",
  label: "What we do",
  title: ["Five ways to", "win the", "scroll."],
  accentFrom: 1,
  aside:
    "Each service stands on its own, and they work best together — from the first idea and hook to the version that scales your spend.",
  items: [
    {
      slug: "ai-ad-creatives",
      title: "AI Ad Creatives",
      description: "Hyper-realistic static and video ads, art-directed by humans and produced with AI so you can test more ideas, faster.",
      tags: ["Static ads", "Video ads", "Variations at scale"],
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
  index: "03",
  label: "Selected work",
  title: ["Proof, not", "promises."],
  accentFrom: 1,
  aside: "A selection of recent campaigns — the idea, the format and what it moved.",
  // Ad reel: vertical video creatives shown under the Work heading. Files are produced by
  // scripts/encode-reel.py → static/video/<slug>.mp4 + poster images <slug>-<w>.{avif,webp}.
  // `tag` is the small label on the card; `alt` describes the poster frame. Reorder freely.
  reel: {
    label: "Ad creatives",
    title: "The reel",
    hint: "Hover to preview · click for sound",
    hintTouch: "Tap to play with sound",
    items: [
      { slug: "reel-01", tag: "AI UGC • Perfume", alt: "Hand holding a jewelled Extresy perfume bottle, priced at Rs. 699 for three luxury perfumes" },
      { slug: "reel-02", tag: "AI UGC • Skincare", alt: "Creator close-up reviewing an invisible pimple patch" },
      { slug: "reel-03", tag: "AI story", alt: "AI-generated mythological king in a snack shop with a soundbox, captioned in Hindi" },
      { slug: "reel-04", tag: "AI story · Fintech", alt: "Worried woman reading a loan-rejected message, with a poor credit score gauge" },
      { slug: "reel-05", tag: "Motion", alt: "Animated snack pack on lime green: two million dollars in sales with TikTok Shop" },
      { slug: "reel-06", tag: "UGC", alt: "Creator in a sequinned saree presenting a product to camera" },
      { slug: "reel-07", tag: "Talking head", alt: "Presenter at a podcast microphone talking to camera with captions" },
      { slug: "reel-08", tag: "AI story", alt: "AI-generated courtroom scene with a man appealing to the judge" },
      { slug: "reel-09", tag: "Story ad", alt: "Couple sitting with an older man in a living room" },
      { slug: "reel-10", tag: "Product demo · grexa.ai", alt: "Smiling woman with a tablet, cut with a grexa.ai campaign dashboard" },
      { slug: "reel-11", tag: "UGC · Skincare", alt: "Creator showing skin texture in a split-screen before-and-after" },
      { slug: "reel-12", tag: "Talking head", alt: "Bearded presenter explaining TikTok Shop to camera" },
      { slug: "reel-13", tag: "Motion", alt: "Kinetic type ad: struggling to turn views into money" },
    ],
  },
  // Case studies (title, client, result, images, page under /work/<slug>/). None yet — the Work section
  // shows the ad reel only. Add entries here when real case studies are ready.
  projects: [],
};

export const showcase = {
  index: "01",
  label: "Campaign showcase",
  title: ["Real campaigns.", "Real numbers.", "Real growth."],
  accentFrom: 2,
  aside: "A closer look at the campaigns, creatives and performance we've built alongside our clients.",
  // One entry per screenshot. Prepare the image first:  python scripts/add-campaign-image.py <file> <slug>
  // Every figure below is read straight off its screenshot — never add a number the screenshot doesn't show.
  // Fields (all optional except slug/alt): client, industry, platform, type, period, metric {value, label},
  // description, alt (what the screenshot shows, for screen readers).
  campaigns: [
    {
      slug: "campaign-01", client: "E-commerce brand", industry: "D2C", platform: "Shopify Analytics", type: "Store revenue",
      period: "1 May – 16 Nov 2026", metric: { value: "₹8.15 Cr", label: "Total sales" },
      description: "₹8.59 Cr gross sales across 1,14,531 orders, with sales climbing from May and peaking through July.",
      alt: "Shopify analytics dashboard: total sales ₹8,15,94,276.20, gross sales ₹8,59,90,621, 1,14,531 orders, sales over time from May to October 2026",
    },
    {
      slug: "campaign-02", client: "E-commerce brand", industry: "D2C", platform: "Meta Ads", type: "Purchase campaigns",
      period: "Last 30 days from 17 Oct 2026", metric: { value: "16.01×", label: "Average purchase ROAS" },
      description: "Seven campaigns: $1,249.88 spent for $20,012.32 in purchase value — 3,669 purchases at $0.34 each.",
      alt: "Meta Ads Manager table of 7 campaigns: $1,249.88 spent, $20,012.32 purchase conversion value, 3,669 purchases, $0.34 cost per purchase, 16.01 average ROAS",
    },
    {
      slug: "campaign-03", client: "E-commerce brand", industry: "D2C", platform: "Shopify Analytics", type: "Store revenue",
      period: "1 Jan – 16 Nov 2026", metric: { value: "₹31.47 L", label: "Total sales" },
      description: "5,087 fully prepaid orders, at an average order value of ₹618.76 — a perfume brand we scaled from 0 to ₹31.5 L in sales.",
      alt: "Shopify analytics dashboard: total sales ₹3,147,682, 5,087 orders, 5,045 fulfilled, average order value ₹618.76",
    },
    {
      slug: "campaign-04", client: "E-commerce brand", industry: "Skincare", platform: "Meta Ads", type: "Serum combo — purchase campaigns",
      period: "17 Oct – 15 Nov 2026", metric: { value: "9.46×", label: "Average purchase ROAS" },
      description: "$357.39 spent for $3,381.37 in purchase value — 643 purchases at $0.56 each.",
      alt: "Meta Ads Manager table of serum combo campaigns: $357.39 spent, $3,381.37 purchase value, 643 purchases, $0.56 cost per purchase, 9.46 average ROAS",
    },
    {
      slug: "campaign-05", client: "E-commerce brand", industry: "D2C", platform: "Shopify Orders", type: "Order log",
      period: "26–27 September", metric: null,
      description: "A day of ₹599 orders, every one prepaid, fulfilled and delivered. Customer names are blurred for privacy.",
      alt: "Shopify orders list from 26–27 September: dozens of ₹599 orders marked paid, fulfilled and delivered; customer names blurred",
    },
  ],
};

export const results = {
  index: "04",
  label: "The intent",
  title: ["Ideas are the", "means.", "Growth is", "the point."],
  accentFrom: 2,
  aside: null, // e.g. "We measure every creative against the metric you care about — CPA, ROAS or thumb-stop rate."
  statement: "Every concept we ship is tied to a number you care about.",
  stats: [
    { value: 3, suffix: "%+", label: "Average lift in click-through rate" },
    { value: 10000, suffix: "+", label: "Ad creatives delivered" },
    { value: 20, suffix: "+", label: "Brands scaled successfully" },
    { value: 50, suffix: "+ Cr", label: "Revenue generated for clients" },
  ],
};

export const process = {
  index: "05",
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
  index: "06",
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
  index: "07",
  label: "The team",
  title: ["Built by", "creators, for", "growth-minded", "brands."],
  accentFrom: 2,
  quote: null,                        // one-sentence founder belief
  bio: [null],                        // 1–2 short paragraphs
  // Shown in this order. Photos live in static/img/founders/ (shown in black & white on the site).
  // focus = CSS object-position for the 4:5 crop. Only list people who are actually on the team.
  people: [
    { name: "Shubham Jain", role: "Co-Founder & Creative Director", photo: "founders/shubham-jain.webp", focus: "50% 30%", linkedin: null },
    { name: "Ashwin Pillai", role: "Co-Founder & Head of Growth", photo: "founders/ashwin-pillai.webp", focus: "50% 34%", linkedin: null },
    { name: "Krupa Jain", role: "Head of AI Ads", photo: "founders/krupa-jain.jpg", focus: "50% 36%", linkedin: null },
    { name: "Dhruv Agarwal", role: "Performance Marketer", photo: "founders/dhruv-agarwal.jpg", focus: "50% 50%", linkedin: null },
  ],
};

export const testimonials = {
  index: "08",
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
    { name: "Solarhood", src: "logos/solarhood.webp", tone: "lift", scale: 1.1 },
    { name: "Healcure", src: "logos/healcure.webp", scale: 1.15 },
    { name: "MAC Cosmetics", src: "logos/mac.png", scale: 1.1 },
    { name: "Capt. Zack", src: "logos/capt-zack.png", scale: 1.4, brightness: 0.85 },
    { name: "Moodcare", src: "logos/moodcare.png", tone: "lift", scale: 0.95 },
    { name: "Avimee Herbal", src: "logos/avimee-herbal.png", tone: "light", scale: 1.2 },
    { name: "Goldy's Flower", src: "logos/goldys-flower.png", scale: 1.4, brightness: 1.9 },
    { name: "Hidden", src: "logos/hidden.png", scale: 1.25, brightness: 1.5 },
    { name: "Candid", src: "logos/candid.png", scale: 1.3 },
  ],
};

export const contact = {
  index: "09",
  label: "Speak to our team today",
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
  // Extra entries for the footer's Services column, listed after the services above.
  extraServices: ["Performance Marketing & Scaling"],
};
