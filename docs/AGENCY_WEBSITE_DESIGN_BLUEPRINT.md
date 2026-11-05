# AGENCY_WEBSITE_DESIGN_BLUEPRINT.md

**Project:** Advertising & creative agency website (rebuild of an Emergent-generated reference)
**Reference:** https://growth-creatives.preview.emergentagent.com/
**Audience for this document:** an AI coding agent that will build the site
**Inspection date:** 5 Nov 2026 — inspected live in Chrome (desktop 1154 px viewport and mobile 422 px viewport), including computed styles, CSS custom properties, media queries, DOM structure, images and scripts.
**Status:** Design specification only. No code has been written.

> **How to read this document**
> - `[VERIFIED]` = measured directly on the live reference (computed CSS, DOM, or screenshot).
> - `[INFERRED]` = reasoned from evidence but not directly confirmed.
> - `[NEW]` = a decision introduced by this blueprint (the "30 %").
> - `[PLACEHOLDER]` = business content the client must supply. **Never invent clients, logos, statistics, testimonials or awards.** Render placeholders exactly as written in square brackets until real content arrives.

---

## Table of Contents

1. Project Overview
2. Design Vision
3. Reference Website Analysis
4. Existing Brand Color Palette
5. Design Preservation Strategy
6. Our Unique Creative Direction
7. Complete Page Structure
8. Section-by-Section Implementation Specifications
9. Typography System
10. Color Design Tokens
11. Spacing and Layout System
12. Component Design System
13. Responsive Design Specifications
14. Animation and Interaction Guidelines
15. Image and Asset Guidelines
16. Content and Copywriting Direction
17. Accessibility Requirements
18. Performance and SEO Requirements
19. Technical Implementation Guidance
20. Final Quality Assurance Checklist

---

## 1. Project Overview

### 1.1 What we are building
A single-page marketing site (plus a reusable case-study page template and a privacy page) for an AI-assisted advertising and creative agency that produces AI ad creatives, UGC/creator ads, video, performance creatives and brand content.

### 1.2 Primary goals (in priority order)
1. **Generate qualified inquiries** through the contact form and the "Start a project" CTA.
2. **Prove capability** through the work showcase and results.
3. **Build trust** through the founder story, process transparency and testimonials.
4. **Look unmistakably like the reference's design family** (black + acid lime, oversized uppercase grotesk headlines, editorial numbering) while feeling more crafted.

### 1.3 The 70 / 30 rule
| 70 % carried over from reference | 30 % our own identity |
|---|---|
| Black/near-black canvas with acid-lime `#C7FF2F` accent | A real, loaded type system (display + body + mono) instead of system Helvetica fallback |
| Section order & IDs: Home → Trust → Services → Work → Results → Process → Why → Founder → Testimonials → Contact → Footer | Ad-format frame motif (9:16 / 1:1 / 16:9 outlines) as a recurring visual signature |
| Oversized uppercase headings, white line + lime line split | Cursor-following thumbnail previews on the services list |
| Numbered eyebrow labels `01 / WHAT WE DO` | Case-study cards with real metadata rows and video-on-hover |
| Sharp corners (0 radius), 1 px hairline dividers | Scroll-linked progress line in the process section |
| Light "paper" break section for Process, full-lime Testimonials | Sticky heading layouts that remove dead space |
| Lime primary button with ↗ arrow, text-link secondary | "What happens next" panel + trust micro-copy beside the form |
| Chrome-and-lime 3D sculpture imagery | Richer footer, real case-study template page |

---

## 2. Design Vision

### 2.1 One-sentence vision
**"An editorial, high-contrast black-and-lime agency site that reads like a creative director's portfolio and converts like a performance landing page."**

### 2.2 Design principles (each is a build rule, not an adjective)
| Principle | What it means in implementation |
|---|---|
| **Contrast is the brand** | Lime appears on ≤ 8 % of any viewport's pixel area except in the Testimonials section (where it is the background). Lime is reserved for: the second line of headlines, primary buttons, eyebrow numbers, active/hover states. |
| **Type does the heavy lifting** | Every section is led by a display heading ≥ 44 px on mobile and ≥ 72 px on desktop. No decorative illustrations replace headlines. |
| **Hairlines, not boxes** | Structure is created with 1 px `--color-line` rules and grids, not rounded filled cards. Border-radius is `0` everywhere except form focus rings (also 0) and avatar images (0). |
| **Motion confirms, it doesn't perform** | Every animation is ≤ 800 ms, transform/opacity only, triggered once, and disabled under `prefers-reduced-motion`. |
| **Every section ends in a next step** | Each section has either a CTA, a link to the next section, or a scroll cue. |
| **Placeholders are honest** | Unknown data renders as `[PLACEHOLDER]` styled text, never fabricated numbers. |

### 2.3 What to avoid (hard rules)
- No new hues (no purple, blue, orange, pink gradients). Only the tokens in §10.
- No rounded "SaaS" cards with drop shadows. No glassmorphism panels except the existing nav blur.
- No more than **one** continuously looping animation visible per viewport (hero orb **or** marquee, never both in view at full intensity — see §14.4).
- No stock "diverse team smiling at laptop" photography.
- No emoji, no gradient text, no 3+ CTA buttons in one block.

---

## 3. Reference Website Analysis

### 3.1 Global findings `[VERIFIED]`
| Item | Finding |
|---|---|
| Page type | Single long page, document height ≈ 9,116 px at 1154 px width; ≈ 11,141 px at 422 px |
| Brand shown | "AdverBright / Media" — lime square "A" logomark + wordmark |
| Background | `#050505` (`--ink`) body; alternating `#0D0D0D` (`--surface`), `#151515`, light `#E8E8E2`, lime `#C7FF2F` sections |
| Font family | `"Helvetica Neue", Helvetica, Arial, sans-serif` — **no web font is actually loaded** (an `Inter 600` FontFace is declared but status `unloaded`). On Windows/Android/Linux it renders as Arial or a substitute → inconsistent identity across devices. |
| Heading style | Weight 600, uppercase content, letter-spacing ≈ −0.07em, line-height ≈ 0.87, fluid size ≈ 8.1vw (h1) / 6.9vw (h2) |
| Corners | `border-radius: 0` on every custom component |
| Horizontal padding | `6vw` (69.26 px at 1154 px) for sections; nav `5vw` |
| Vertical section padding | `130px` top/bottom desktop, `90px 25px` mobile |
| Breakpoints | Custom CSS has only **one** breakpoint: `max-width: 800px`. Tailwind's `640px`/`768px` exist in the stylesheet but the custom components don't use them. |
| Smooth scroll | `html { scroll-behavior: smooth }` (native, no library detected) |
| Section labels | `01 / WHAT WE DO` … `08 / LET'S MAKE SOMETHING` — editorial numbering |

### 3.2 Section inventory `[VERIFIED]`
| # | Section | DOM | Height @1154px | Background |
|---|---|---|---|---|
| — | Navigation | `nav.nav` (fixed) | 90 px | `rgba(5,5,5,.78)` |
| 0 | Hero | `section#home.hero` | 860 px | Radial + linear gradient on `#050505` |
| — | Trust strip | `section.trust-strip` | 125 px | transparent (`#050505`) |
| 01 | Services | `section#services` | 1,534 px | `#050505` |
| 02 | Work | `section#work` | 1,726 px | `#0D0D0D` |
| 03 | Results / Intent | `section.results-section` | 811 px | `#050505` |
| 04 | Process | `section#process` | 722 px | `#E8E8E2` (light) |
| 05 | Why us (About) | `section#about.why-section` | 851 px | `#050505` |
| 06 | Founder | `section.founder-section` | 1,036 px | `#0D0D0D` |
| 07 | Testimonials | `section.testimonial-section` | 629 px | `#C7FF2F` (lime) |
| 08 | Contact | `section#contact` | 721 px | `#151515` |
| — | Footer | `footer` | 101 px | `#050505`, top border `#262626` |

Pages beyond the home page: **none found.** All nav items are in-page anchors (rendered as `<button>` elements). Project cards are `<button>`s with no destination. No case-study, blog, privacy or 404 pages were accessible.

### 3.3 Section-by-section analysis of the reference

#### 3.3.1 Navigation `[VERIFIED]`
1. **Purpose:** Brand recognition + anchor navigation + persistent primary CTA.
2. **Layout:** Fixed full-width bar, `padding: 22px 5vw`, flex row: logo left, 6 links center-right, CTA far right.
3. **Background:** `rgba(5,5,5,0.78)` (translucent; backdrop blur inferred from the screenshot softening). A border appears on hover (`.nav:hover { border-color: var(--line) }`).
4. **Color:** Links `#F5F5F1`-ish at reduced opacity; hover → lime. CTA lime fill, `#070707` text.
5. **Typography:** Links 12 px uppercase, letter-spacing ≈ 0.08em. Logo text 12 px/700, ls 0.96 px; "/ MEDIA" in muted grey.
6. **Alignment:** Vertically centered in a 90 px bar.
7. **Assets:** Lime square with black "A" glyph (rendered as text/CSS, not an SVG file).
8. **Components:** `.nav-cta` — `padding: 13px 17px`, 12 px/700, ls 0.6 px, `border: 0.8px solid #C7FF2F`, radius 0, `transition: .25s`. Hover: background `#E0FF8A`, `translateY(-3px)`.
9. **Spacing:** Link gap ≈ 30 px.
10. **Interactions:** Hover color; CTA lift. Mobile (≤800px) links + CTA hidden; "Toggle menu" button opens a dropdown panel (`top:70px`, bg `#0D0D0D`, `padding: 25px 32px`).
11. **Preserve:** Fixed translucent bar, logo lockup, uppercase small links, lime CTA with arrow.
12. **Improve:** Nav links are `<button>`s (should be `<a href="#id">`); no active-section indicator; toggle lacks `aria-expanded`; mobile menu is a plain dropdown with no CTA inside it.

#### 3.3.2 Hero `[VERIFIED]`
1. **Purpose:** State the offer, show the creative standard, push to "Start a project".
2. **Layout:** Two columns. Left ≈ 58 %: eyebrow, H1 (4 lines), paragraph (max ≈ 420 px), CTA pair. Right ≈ 42 %: `.hero-visual` 500 × 580 px containing a circular-cropped chrome/lime sculpture image (337 × 360 rendered), two elliptical lime outline "orbits", and six floating labels (AI, UGC, VIDEO, CREATIVE, PERFORMANCE, GROWTH). Bottom row (`.hero-footer`): "Built for brands that refuse to blend in." left, "SCROLL TO EXPLORE ↘" right, separated by a hairline.
3. **Background:** `radial-gradient(circle at 72% 44%, #172012 0, transparent 31%), linear-gradient(115deg, #050505 64%, #0C100A)` plus faint diagonal perspective lines behind the visual.
4. **Color:** H1 lines 1–3 `#F5F5F1`, line 4 "ATTENTION." lime. Paragraph `#9A9A96`. Eyebrow `#8C8C88` with a lime dot.
5. **Typography:** H1 93.5 px / 600 / line-height 81.35 px (0.87) / ls −6.55 px (−0.07em). Paragraph 15/24. Eyebrow 10 px, ls 1.7 px, uppercase. Floating labels 10 px, ls 1.4 px.
6. **Alignment:** Left-aligned text; visual vertically centered against H1.
7. **Assets:** One 1264 × 848 raster (alt: "Abstract chrome and lime creative sculpture"), no `srcset`, no lazy/eager hints.
8. **Components:** Primary button (lime) + `.text-button` "VIEW OUR WORK ↘" (`#999999`, 12 px, hover lime).
9. **Spacing:** `padding: 150px 6vw 130px`. Section height 860 px.
10. **Interactions:** `.orb-stage` receives inline `rotateX/rotateY` transforms that follow the pointer (3D tilt). Orbit/float classes exist; computed `animation-name` was `none` at inspection, so any orbit motion is JS-driven or absent `[INFERRED]`.
11. **Preserve:** Two-column composition, 4-line uppercase H1 with lime last line, eyebrow with dot, circular sculpture + orbit rings, floating capability labels, hero-footer row, pointer tilt.
12. **Improve:**
    - **Collision bug:** "PERFORMANCE" floating label overlaps "CREATIVE / 001" and "∞ ALWAYS IN MOTION" at the bottom-right (visible in screenshots).
    - The floating labels are positioned absolutely with no logic tying them to the services; they read as decoration.
    - Paragraph contrast is fine, but the eyebrow (`#8C8C88` at 10 px) is too small.
    - The CTA pair is 12 px text — small for the primary conversion action.

#### 3.3.3 Trust strip `[VERIFIED]`
1. **Purpose:** Social proof.
2. **Layout:** Row 1: horizontal marquee "TRUSTED BY AMBITIOUS BRANDS ✳" (animation `marquee 22s`, translateX −33 %). Row 2: 5-column logo grid with vertical hairlines ("BRAND 01"…"BRAND 05" text placeholders, `padding: 24px`).
3. **Background:** `#050505`, top/bottom hairlines `#262626`.
4. **Color:** Text `#686864` — **contrast 3.64:1, fails WCAG AA for 11 px text.**
5. **Typography:** 11 px, ls 1.98 px (0.18em), uppercase.
6–9. Centered in cells; mobile → 2-col grid with the 5th spanning both.
10. **Interactions:** Marquee only.
11. **Preserve:** Marquee + logo grid with hairline cells.
12. **Improve:** Real logos (SVG, monochrome), fix contrast, pause marquee on hover/reduced-motion, hide the strip entirely until ≥ 4 real logos exist (see §8.3).

#### 3.3.4 Services — "01 / WHAT WE DO" `[VERIFIED]`
1. **Purpose:** List the five service lines.
2. **Layout:** Header row: H2 (3 lines) left, intro paragraph offset right (starts ≈ 45 % across). Below: full-width list of 5 `.service-card` rows. Each row is a 3-col grid `80px | 1fr | 30px` (number | title + description | ↗ arrow), `padding: 32px 0`, bottom hairline `#262626`, height 175 px.
3. **Background:** `#050505` with a faint vertical light streak.
4. **Color:** Numbers lime; titles `#F5F5F1`; descriptions muted grey.
5. **Typography:** H2 79.65 px/600/lh 0.87/ls −0.07em. Service title (h3) 34.6 px / 500 / lh 1.5 / ls −1.39 px (−0.04em). Number 11 px, ls 1.1 px. Description ≈ 14–15 px.
6. **Alignment:** Left. Description max-width ≈ 230 px — creates a narrow ragged column with lots of empty space to the right.
7. **Assets:** None.
8. **Components:** Row-style list, not cards.
9. **Spacing:** 5 × 175 px = 875 px of list.
10. **Interactions:** `.service-card:hover { padding-left: 18px; color: lime }` with 0.3 s transition (padding animation causes layout reflow).
11. **Preserve:** Editorial numbered list, hairlines, ↗ arrow, lime numbers, oversized row titles.
12. **Improve:** Animate with `transform` not `padding`; use the empty right space (deliverable tags, preview); rows aren't links; on mobile the 80 px number column wastes ≈ 20 % of width.

#### 3.3.5 Work — "02 / SELECTED DIRECTIONS" `[VERIFIED]`
1. **Purpose:** Portfolio proof.
2. **Layout:** Header row like Services (H2 left, paragraph right). Below: `.project-grid` 2 columns with **alternating widths** (`436.7px 545.9px`, gap 18 px), each card 540 px tall; 4 cards (Alpha, Beta, Gamma, Delta) in a staggered checkerboard (narrow-wide / narrow-wide visually alternating).
3. **Background:** `#0D0D0D`.
4. **Color:** Card fallback bg `#181818`; category label lime (small); title `#F5F5F1`; ↗ arrow bottom-right.
5. **Typography:** Category ≈ 10–11 px lime; title ≈ 24–26 px / 500.
6. **Alignment:** Overlay text bottom-left inside card with a dark bottom gradient.
7. **Assets:** 4 AI-generated chrome/lime sculpture renders (1264 × 848 landscape and 848 × 1264 portrait) cropped with `object-fit: cover`; default `filter: grayscale(0.3)`.
8. **Components:** `.project-card` — `<button>`, radius 0.
9. **Spacing:** Grid 1,098 px tall.
10. **Interactions:** Hover: image `scale(1.06)`, `grayscale(0)`; transitions `transform .8s, filter .5s`.
11. **Preserve:** Asymmetric 2-col grid, full-bleed imagery, bottom-left overlay text, slow zoom on hover.
12. **Improve:** Cards go nowhere; no client/format/result metadata; copy says "Placeholder worlds… Replace these with your next case studies." (must not ship); images are unoptimized rasters.

#### 3.3.6 Results — "03 / THE INTENT" `[VERIFIED]`
1. **Purpose:** Bridge from creativity to business outcomes.
2. **Layout:** Giant 4-line H2 (92 px, larger than other H2s) left-aligned; below a 4-col `.stats-grid` with top hairline and vertical dividers, each stat `padding: 22px 20px 0 0`.
3. **Background:** `#050505`.
4. **Color:** Lines 1–2 white, 3–4 lime. Stat values white; labels muted.
5. **Typography:** Stat value ≈ 48–56 px / 500; label ≈ 12 px.
6. **Content:** All values are placeholders: `+XX`, `XXX+`, `XX+`, `XX%` ("Placeholder Growth Metric").
10. **Interactions:** None observed.
11. **Preserve:** The statement-heading + stats-bar pairing.
12. **Improve:** Placeholders must render as obvious `[PLACEHOLDER]` chips, not fake-looking "XX"; the section repeats the hero's message at an even larger size, so the heading should be reduced to the standard H2 size to restore hierarchy.

#### 3.3.7 Process — "04 / HOW WE MOVE" `[VERIFIED]`
1. **Purpose:** Reduce perceived risk by showing the method.
2. **Layout:** H2 (2 lines) left; below, 5 equal columns (`.process-item` ≈ 200 px each) separated by vertical hairlines, each: lime-dark number, title, description. A `.process-line` element exists.
3. **Background:** Light paper `#E8E8E2` — the only light section; a strong rhythm break.
4. **Color:** H2 line 1 `#0B0B0B`, line 2 "TO IMPACT." `#799E00` (dark lime). Step numbers `#799E00`. **`#799E00` on `#E8E8E2` = 2.55:1 — fails WCAG even for large text.**
5. **Typography:** Step title ≈ 18 px / 500 uppercase; description ≈ 12–13 px.
9. **Spacing:** Large empty band below the steps (~150 px).
10. **Interactions:** None observed.
11. **Preserve:** Light section, 5-step horizontal layout, dark-lime accent concept.
12. **Improve:** Darken the dark-lime to pass contrast; turn `.process-line` into a scroll-linked progress indicator; tighten the bottom space.

#### 3.3.8 Why us — "05 / THE DIFFERENCE" (`#about`) `[VERIFIED]`
1. **Purpose:** Differentiators.
2. **Layout:** 2 columns: H2 "WHY ADVERBRIGHT?" top-left; right column (≈ 330 px) list of 5 `.why-item`s (lime uppercase title 11–12 px + grey description), hairline separated, `padding: 22px 0`.
3. **Background:** `#050505`.
11. **Preserve:** Heading-left / list-right composition; lime micro-titles.
12. **Improve:** **Large dead area** — left column is empty for ≈ 500 px below the heading (clearly visible). The right list is narrow and small. Make heading sticky and widen the list; add numbers for consistency with the rest of the site.

#### 3.3.9 Founder — "06 / THE FOUNDER" `[VERIFIED]`
1. **Purpose:** Human trust.
2. **Layout:** 2 columns: portrait left (448 × 776, black-and-white, `object-fit: cover`), text right: H2 (5 lines, lime on last 3), name (≈ 18 px), role label (uppercase small grey), bio paragraph, text CTA "WORK WITH SHUBHAM".
3. **Background:** `#0D0D0D`.
7. **Assets:** 1254 × 1254 PNG portrait, grayscale.
11. **Preserve:** B&W portrait (fits palette perfectly), big statement heading, text CTA.
12. **Improve:** Portrait is a heavy PNG; heading 5 lines tall pushes the bio below the fold; add a pull-quote and social/LinkedIn link for credibility.

#### 3.3.10 Testimonials — "07 / WORDS FROM THE OTHER SIDE" `[VERIFIED]`
1. **Purpose:** Third-party proof.
2. **Layout:** H2 left, prev/next square buttons (42 × 42, border `#60791C`) + counter "01 / 03" right; quote below (≈ 40 px), attribution "— Client Name · Brand Name".
3. **Background:** **Full lime `#C7FF2F`** — the boldest color moment on the page.
4. **Color:** Text `#0B0B0B`; borders `#60791C`.
11. **Preserve:** Full-lime band, black type, square arrow controls, counter.
12. **Improve:** Only 1 placeholder exists although counter says 3; arrow buttons have **no accessible name**; no autoplay control. If < 2 real testimonials, show a single static quote and hide controls.

#### 3.3.11 Contact — "08 / LET'S MAKE SOMETHING" `[VERIFIED]`
1. **Purpose:** Conversion.
2. **Layout:** 2 columns: H2 (6 lines, lime last 4) left ≈ 45 %; form right ≈ 45 % as a 2-col field grid: Name | Email, Brand | Service (select), Budget (select) | Message (textarea); submit button below left.
3. **Background:** `#151515`.
4. **Fields:** Transparent bg, bottom border only `0.8px #444444`, `padding: 10px 0`, height 42 px; focus → border lime. Labels 10 px uppercase grey above fields (labels wrap inputs). All fields `required`.
5. **Select options:** Services = the five service lines; Budget = "Under $2k / $2k–$5k / $5k–$10k / $10k+".
11. **Preserve:** Underline-style inputs, 2-col field grid, uppercase micro-labels, lime submit.
12. **Improve:** Name placeholder is the founder's own name ("Shubham Jain") — confusing; heading is 6 lines tall (too heavy next to a short form); no success/error states observed; no alternative contact (email/WhatsApp/calendar); no privacy note; `#444` underline on `#151515` = 1.87:1 (field boundaries are hard to see).

#### 3.3.12 Footer `[VERIFIED]`
1. **Layout:** Single row: logo left, two-line tagline center ("CREATIVE THAT GETS ATTENTION. / CONTENT THAT DRIVES GROWTH."), "© 2025 ADVERBRIGHT MEDIA" right. `padding: 35px 6vw`, top border `#262626`.
12. **Improve:** No nav, socials, email, legal links; copyright year is static (2025).

### 3.4 What was NOT accessible
- No sub-pages, case-study pages, blog, privacy policy, or 404 page exist on the reference.
- Form submission behavior (endpoint, success/error UI) was **not tested** — submitting would send data.
- Testimonial slides 2 and 3 do not exist (counter only).
- Hover states were read from CSS rules; touch behaviour on a real phone was not tested.

---

## 4. Existing Brand Color Palette

All values `[VERIFIED]` from CSS custom properties (`--ink`, `--lime`, `--line`, `--soft`, `--surface`) or computed styles.

### 4.1 Core palette
| Role | HEX | Source | Notes |
|---|---|---|---|
| **Primary brand / accent** | `#C7FF2F` | `--lime` | Acid lime. Headline accents, primary buttons, numbers, testimonial bg |
| Lime hover | `#E0FF8A` | `.button-primary:hover` | Lighter tint |
| Lime (70 % alpha) | `rgba(199,255,47,.7)` | computed | Orbit rings / glows |
| Dark lime (on light bg) | `#799E00` | computed | Process numbers & "TO IMPACT." — **fails contrast** |
| Olive line (on lime bg) | `#60791C` | testimonial buttons | Borders on lime |
| **Main background** | `#050505` | `--ink` | Body |
| Surface 1 | `#0D0D0D` | `--surface` | Work, Founder sections, mobile menu |
| Surface 2 | `#151515` | computed | Contact section |
| Card fallback | `#181818` | `.project-card` bg | Behind images |
| Nav background | `rgba(5,5,5,.78)` | computed | Fixed nav |
| Hero glow | `#172012` → transparent | hero radial gradient | Lime-tinted black |
| Hero tint end | `#0C100A` | hero linear gradient | Lime-tinted black |
| **Light section bg** | `#E8E8E2` | `.process-section` | Warm paper grey |
| **Heading / primary text (dark bg)** | `#F5F5F1` | body color | Warm off-white |
| Off-white alt | `#F4F4F0` | inputs | Effectively same as above |
| Text on lime / light | `#0B0B0B` | process & testimonial headings | |
| Button text on lime | `#070707` | `.button-primary` | |
| **Body / soft text** | `#A4A4A1` | `--soft` | 8.16:1 on ink |
| Hero paragraph | `#9A9A96` | computed | 7.22:1 |
| Secondary link | `#999999` | `.text-button` | 7.15:1 |
| Muted label | `#8C8C88` | eyebrow | 6.04:1 |
| Muted 2 | `#7C7C78` | hero footer | 4.86:1 |
| Muted 3 (too low) | `#686864` | marquee | **3.64:1 — fails for small text** |
| **Hairline** | `#262626` | `--line` | Dividers, borders |
| Input underline | `#444444` | form | |

### 4.2 Gradients `[VERIFIED]`
```css
/* Hero */
background:
  radial-gradient(circle at 72% 44%, #172012 0, rgba(0,0,0,0) 31%),
  linear-gradient(115deg, #050505 64%, #0C100A);
/* Project card overlay (INFERRED from screenshot) */
background: linear-gradient(to top, rgba(5,5,5,.85) 0%, rgba(5,5,5,0) 55%);
```

### 4.3 Unused framework tokens
The stylesheet also contains shadcn/ui default HSL variables (`--background: 0 0% 100%`, `--chart-1..5` oranges/teals, `--destructive` red). **These are framework defaults and are NOT part of the brand.** Do not use them.

---

## 5. Design Preservation Strategy

### 5.1 Design Preservation Checklist
| Element | Preserve | Can Improve | Can Redesign |
|---|---|---|---|
| Brand colors (`#050505`, `#C7FF2F`, `#F5F5F1`, `#E8E8E2`) | **Yes — exact HEX** | Contrast of muted greys and dark-lime only | **No** |
| Section order | **Yes** | Add "Final CTA band"? — No; contact already closes | Only if a section has no real content (see §7.3) |
| Navigation structure | Yes (6 anchors + CTA) | Active state, a11y, mobile overlay | No |
| Hero composition (2-col, 4-line H1, orb visual) | **Yes** | Label logic, sizes, motion | Visual content inside the orb: Yes |
| Uppercase display headings w/ lime second part | **Yes** | Font family, tracking, sizes | No |
| Numbered eyebrow labels | **Yes** | Mono font, contrast | No |
| Sharp 0-radius corners | **Yes** | — | No |
| Hairline dividers | **Yes** | Consistent token | No |
| Services as numbered list rows | **Yes** | Hover preview, tags, links | No |
| Work asymmetric 2-col grid | **Yes** | Metadata, video hover, links | Card internals: Yes |
| Stats bar | Yes | Count-up, placeholder chips | No |
| Light Process section | **Yes** | Progress line, contrast | No |
| Why us | Composition | Sticky heading, wider list | Yes, within 2-col |
| Founder | Yes | Quote, socials, image format | No |
| Lime testimonial band | **Yes** | Carousel a11y | Content format |
| Contact form style | **Yes** | States, side panel | Layout ratio |
| Footer | Brand row | Yes | **Yes** (expand) |
| Typography | Character (grotesk, uppercase, tight) | Yes | Font family: Yes |
| Spacing | No strict restriction | Yes | Yes |
| Animations | Pointer tilt, marquee, image zoom | Yes | Yes |
| Mobile layout | Overall stacking order | Yes | Yes |

### 5.2 Identity "fingerprint" — if any of these are missing the build fails review
1. `#050505` canvas with `#C7FF2F` accent.
2. Hero H1 in 4 uppercase lines with the last line in lime.
3. `NN / LABEL` eyebrows on every content section.
4. Light `#E8E8E2` Process section and full-lime Testimonials section in the same positions.
5. Square lime CTA with ↗ arrow.
6. Chrome-and-lime 3D sculpture art direction.

---

## 6. Our Unique Creative Direction (the 30 %)

Each addition below states **what**, **why** (branding / usability / conversion) and **where**. Nothing is added purely for decoration.

| # | Addition `[NEW]` | Where | Why it improves the site |
|---|---|---|---|
| C1 | **Real type system:** Inter Tight (display), Inter (body), JetBrains Mono (labels/numbers) — self-hosted | Global | Reference falls back to Arial on most non-Apple devices, so the identity changes per device. Inter Tight keeps the Helvetica-grotesk character (preservation) while rendering identically everywhere. Mono labels make the existing `01 /` numbering feel deliberate, like ad-production slates. |
| C2 | **Ad-format frame motif:** thin lime outlines in 9:16, 1:1 and 16:9 ratios, labelled `9:16`, `1:1`, `16:9` in mono | Hero visual (replaces random floating words), services hover preview, work card corner badge | Turns decoration into meaning: the agency makes ads in these formats. Becomes a recognizable signature unique to us. |
| C3 | **Capability orbit with purpose:** the hero's floating labels become the 5 real service names, each a link to its service row | Hero | Fixes the overlap bug, adds a second navigation path for scanners, and makes the orbit functional. |
| C4 | **Cursor-follow preview on service rows** (desktop, pointer:fine only) | Services | Fills the reference's empty right space with proof (a 9:16 thumbnail of that service's work), increasing time-on-section and understanding. |
| C5 | **Deliverable tags** per service (e.g. `Static ads` `Carousels` `Motion`) | Services | Answers "what exactly do I get?" — a top pre-sales question; improves scannability. |
| C6 | **Case-study cards with metadata rows** (Client · Format · Platform · Result) + muted autoplay video on hover | Work | Converts "pretty pictures" into evidence; cards link to a case-study template page. |
| C7 | **Count-up stats with honest placeholders** | Results | Motion signals "results" without exaggeration; placeholder chips prevent shipping fake numbers. |
| C8 | **Scroll-linked progress line** across the 5 process steps | Process | Uses the reference's existing `.process-line` idea; communicates sequence and momentum. |
| C9 | **Sticky heading layout** | Why, Founder, Contact | Removes the reference's ~500 px dead zones while keeping the 2-col composition. |
| C10 | **"What happens next" panel** + response-time promise + direct email link | Contact | Reduces form anxiety; gives a non-form path for high-intent visitors. Proven conversion pattern. |
| C11 | **Expanded footer with oversized wordmark** | Footer | Gives the page a confident ending, adds socials/legal links required for trust and compliance. |
| C12 | **Section transition seams:** the 1 px hairline at the top of each section draws from left to right (scaleX 0→1) as it enters | Global | Reinforces the hairline language and makes transitions feel edited rather than stacked. Costs one transform per section. |

### 6.1 Things we deliberately did NOT add
- No custom cursor replacement (hurts usability, adds JS cost).
- No page-load intro/preloader (delays LCP and conversion).
- No WebGL/Three.js hero (the static render + CSS orbit gives 90 % of the effect at 1 % of the cost).
- No horizontal scroll-jacking sections.

---

## 7. Complete Page Structure

### 7.1 Sitemap
```
/                      Home (single page, anchors below)
/work/[slug]           Case-study template            [NEW]
/privacy               Privacy policy                  [NEW, PLACEHOLDER copy]
/404                   Not found (on-brand)            [NEW]
```

### 7.2 Home page component tree
```
<SkipLink/>
<SiteHeader>                        fixed
  <Logo/> <PrimaryNav/> <Button variant="primary">Start a project</Button> <MenuToggle/>
<main>
  <Hero id="home"/>
  <TrustStrip/>                     conditional (≥4 real logos)
  <Services id="services"/>         01
  <Work id="work"/>                 02
  <Results/>                        03
  <Process id="process"/>           04  (light theme)
  <WhyUs id="about"/>               05
  <Founder/>                        06
  <Testimonials/>                   07  (lime theme)
  <Contact id="contact"/>           08
</main>
<SiteFooter/>
<MobileMenu/>                       portal / overlay
```

### 7.3 Section visibility rules
| Section | Render if | Otherwise |
|---|---|---|
| TrustStrip | ≥ 4 real client logos supplied | Omit section entirely (no "BRAND 01" boxes) |
| Results stats | ≥ 3 real metrics supplied | Render stats with `[PLACEHOLDER]` chips in dev; in production hide stats row and keep heading + 1-line statement |
| Testimonials | ≥ 1 real testimonial | Omit section; Founder flows into Contact |
| Testimonials carousel controls | ≥ 2 testimonials | Static single quote, no arrows/counter |

### 7.4 Vertical rhythm map (desktop ≥1280 px)
```
┌────────────── NAV 80px (fixed) ──────────────┐
│ HERO              min-height 100svh (≥760)   │  bg ink + glow
├──────────────────────────────────────────────┤
│ TRUST             ~150px                     │  bg ink
├──────────────────────────────────────────────┤
│ 01 SERVICES       pad 160/160                │  bg ink
├──────────────────────────────────────────────┤
│ 02 WORK           pad 160/160                │  bg surface-1
├──────────────────────────────────────────────┤
│ 03 RESULTS        pad 160/120                │  bg ink
├──────────────────────────────────────────────┤
│ 04 PROCESS        pad 140/140                │  bg paper (light)
├──────────────────────────────────────────────┤
│ 05 WHY            pad 160/160                │  bg ink
├──────────────────────────────────────────────┤
│ 06 FOUNDER        pad 160/160                │  bg surface-1
├──────────────────────────────────────────────┤
│ 07 TESTIMONIALS   pad 140/140                │  bg lime
├──────────────────────────────────────────────┤
│ 08 CONTACT        pad 160/160                │  bg surface-2
├──────────────────────────────────────────────┤
│ FOOTER            pad 96/40                  │  bg ink
└──────────────────────────────────────────────┘
```

---

## 8. Section-by-Section Implementation Specifications

> Container: all sections use `.container` (max-width 1360 px, side padding `--gutter`) unless stated. Grid: 12 columns, column gap `--grid-gap` (see §11).

### 8.1 Site header / navigation
**Structure**
```
[A■ AGENCY / MEDIA]        Home  Services  Work  Process  About  Contact   [START A PROJECT ↗]
```
- `<header>` fixed, `inset: 0 0 auto 0`, height **80 px** (desktop) / **64 px** (<1024).
- Background `--color-nav-bg` (`rgba(5,5,5,.78)`) + `backdrop-filter: blur(14px) saturate(120%)`. Bottom border `1px solid transparent`; becomes `--color-line` once `scrollY > 24`.
- Inner: `.container`, flex, `justify-content: space-between`, `align-items: center`.
- Logo: 28 × 28 lime square with black "A" (SVG, `aria-hidden`) + wordmark text `[AGENCY_NAME]` (13 px / 700 / ls 0.08em) + `/ MEDIA` in `--color-text-muted` (400). The whole lockup is `<a href="#home" aria-label="[AGENCY_NAME] — home">`.
- Links: `<a href="#services">` etc. Font `--font-mono` 12 px / 400 / uppercase / ls 0.08em, color `--color-text-secondary`, gap 32 px.
- **Active state** `[NEW]`: IntersectionObserver marks the section occupying the viewport's middle; the matching link gets color `--color-text-primary` and a 4 × 4 lime square before it (`::before`, margin-right 8 px). `aria-current="true"`.
- Hover: color `--color-lime`, 200 ms.
- CTA: `Button` primary, size `sm` (see §12.1).
- **Hide-on-scroll** `[NEW]`: when scrolling down > 120 px past the hero, translateY(-100%) over 300 ms; reappear on any upward scroll. Disabled under reduced motion (header stays visible).

**< 1024 px**: links and CTA hidden; show `MenuToggle` (44 × 44 hit area, two 20 px lines 6 px apart, morph to ✕). `aria-expanded`, `aria-controls="mobile-menu"`.

**Mobile menu overlay `[NEW]`** (replaces dropdown):
- Full-screen `position: fixed; inset: 0;` bg `--color-surface-1`, z-index above header (toggle stays visible).
- Links stacked, `--font-display` 600, size `clamp(36px, 10vw, 56px)`, uppercase, ls −0.04em, each prefixed by mono index `01`–`06` in lime 12 px.
- Bottom area: full-width primary CTA (height 56 px) + email link + socials row.
- Open: overlay fades (200 ms), links stagger up 16 px (40 ms each). Focus trapped; `Esc` closes; body scroll locked; closes on link click.

### 8.2 Hero (`#home`)
**Grid (≥1280 px)**: 12-col. Text block cols 1–7 (≈ 57 %). Visual cols 8–12. `min-height: max(760px, 100svh)`; `padding-top: calc(80px + 96px)`; `padding-bottom: 48px`; content vertically centered; hero-footer pinned at bottom.

```
┌──────────────────────────────────────────────────────────────┐
│ • AI-POWERED CREATIVE AGENCY                     ┌─ orbit ─┐ │
│ WE CREATE                                        │  9:16   │ │
│ ADS THAT                                         │ (orb)   │ │
│ STOP THE                                         │  1:1    │ │
│ SCROLL.   ← lime                                 └─────────┘ │
│ Supporting paragraph (max 46ch)                              │
│ [START A PROJECT ↗]  See the work ↘                          │
│──────────────────────────────────────────────────────────────│
│ Built for brands that refuse to blend in.   SCROLL TO EXPLORE│
└──────────────────────────────────────────────────────────────┘
```
(Headline wording is a copy direction; see §16. Keep the 4-line, last-line-lime structure.)

**Text block**
- Eyebrow: `Badge` variant `dot` (§12.9): 6 px lime square + mono 12 px uppercase ls 0.14em `--color-text-muted`. Margin-bottom 28 px.
- H1: `--text-display-1` (§9), uppercase, lines forced with `<span class="line">` blocks (one per line, `display:block`). Last line color `--color-lime`. `max-width: 11ch`.
- Paragraph: `--text-body-lg` (18/28), `--color-text-secondary`, `max-width: 46ch`, margin-top 32 px.
- CTA row: margin-top 40 px, flex gap 28 px, items center. Primary `Button` size `lg`; secondary `TextLink` with ↘ icon.
- **Micro-trust line `[NEW]`** under CTAs, margin-top 20 px: mono 12 px muted: `Replies within [PLACEHOLDER: 24] hours · No retainers required [PLACEHOLDER — confirm]`. Remove if the client can't commit.

**Visual block**
- Container `.hero-visual`: square, `width: min(100%, 560px)`, `aspect-ratio: 1`, centered in cols 8–12.
- Layer 1 — glow: radial gradient `#172012 → transparent 60%`, 140 % size, behind everything.
- Layer 2 — orbit rings: two SVG ellipses, stroke `--color-lime` at 0.55 opacity, 1 px, rotated −18° and 24°; rotate slowly (§14.3).
- Layer 3 — circular sculpture image: 64 % of container, `border-radius: 50%` (**the only circular element on the site — keeps the reference's signature**), `object-fit: cover`.
- Layer 4 — format frames `[NEW]` (C2): three outlined rectangles (1 px lime @ 0.8) at 9:16 (top-left of orb), 1:1 (right), 16:9 (bottom-left), each with a mono 10 px label of its ratio at its top-left corner. Positioned at fixed percentages so they never collide (define positions in a config array and assert no overlap at 1024, 1280, 1440, 1920 widths).
- Layer 5 — service labels `[NEW]` (C3): the five service names in mono 11 px uppercase, placed on the outer orbit ring at 0°, 72°, 144°, 216°, 288°; each is an `<a href="#service-[slug]">`; hover → lime + 6 px lime square marker. Hidden <1024 px.
- Pointer tilt (preserved): `rotateX/rotateY` max ±6°, `perspective: 1200px`, lerp 0.08 per frame, only with `(pointer:fine)` and no reduced-motion.

**Hero footer**
- Absolute at bottom inside container, top hairline `--color-line` (draws in, C12), padding-top 20 px, flex space-between.
- Left: `Built for brands that refuse to blend in.` (14 px, `--color-text-muted`) — rewrite per §16.
- Right: mono 12 px `SCROLL TO EXPLORE` + ↓ icon that bobs 4 px (2 s loop; disabled reduced-motion). Is an `<a href="#services">`.

**Background:** exactly the reference gradient (§4.2) + optional 2 % opacity noise texture PNG (64 × 64 tile, ≤ 3 KB) to prevent banding.

**Responsive:** see §13.2.

### 8.3 Trust strip
- Render only per §7.3.
- Row 1 marquee: mono 12 px uppercase ls 0.18em, color `--color-text-muted` (**#8C8C88, fixes 3.64:1 → 6.04:1**), separator ✳ in lime. `animation: marquee 40s linear infinite` (slower than reference's 22 s for calm). Pause on hover and when `prefers-reduced-motion` (show static centered text instead). Content duplicated ×2 with `aria-hidden` on the duplicate.
- Row 2 logo grid: `grid-template-columns: repeat(5, 1fr)` (desktop), cells height 96 px, centered, separated by `border-left: 1px solid --color-line` (except first), top & bottom hairlines. Logos: SVG, `height: 28px; width: auto; max-width: 120px`, `filter: grayscale(1) brightness(1.6); opacity: .55`; hover cell → `opacity: 1`. Each `<img alt="[Client name]">`.
- Spacing: section padding 0; row 1 height 56 px.

### 8.4 Services — `01 / WHAT WE DO` (`#services`)
**Header row** (`SectionHeader` component, §12.8):
- Left (cols 1–7): Eyebrow `01 / WHAT WE DO`; H2 3 lines, line 1 white, lines 2–3 lime.
- Right (cols 9–12), aligned to the H2's **bottom** (`align-self: end`): intro paragraph `--text-body-lg`, `--color-text-secondary`, max 38ch.
- Margin below header: 96 px.

**Service list** — `<ol>` of 5 `ServiceRow`s (each `<li id="service-[slug]">` containing an `<a>` to `#contact?service=[slug]` that pre-selects the service in the form `[NEW]`).

Row grid (≥1024): `grid-template-columns: 96px minmax(0, 5fr) minmax(0, 4fr) 48px;` gap 24 px; padding 40 px 0; border-bottom 1 px `--color-line`; first row also border-top.
| Col | Content | Style |
|---|---|---|
| 1 | Number `01` | mono 13 px, lime, ls 0.1em, aligned to title cap-height (`padding-top: 0.55em`) |
| 2 | Title | `--text-h3` (display 600, uppercase, `clamp(28px, 3.2vw, 44px)`, lh 1.0, ls −0.03em) |
| 3 | Description (max 42ch, 16/26, secondary) + deliverable tags (`Tag` component, margin-top 16 px, gap 8 px) | |
| 4 | ↗ icon 20 px in 48 × 48 square with 1 px `--color-line` border | |

**Hover / focus (pointer:fine)**
- Row background → `--color-surface-1` (instant 150 ms) — no padding shift.
- Title `translateX(12px)`, color → lime (300 ms `--ease-out`).
- Icon box: bg lime, icon black, rotate icon 45° (→).
- **Cursor preview (C4)**: a single fixed `div.service-preview` (240 × 427 px, 9:16) containing that row's image/video, follows the pointer with lerp 0.15, offset (+24 px, −50 %). Appears with `opacity 0→1, scale .92→1` 250 ms; image clip-path reveal from bottom. Hidden on touch and reduced-motion. `aria-hidden="true"` (decorative duplicate of content).

**Deliverable tags (copy direction, confirm with client)**
| Service | Tags |
|---|---|
| AI Ad Creatives | `Static ads` `Carousels` `Variations at scale` |
| UGC & Creator Ads | `Creator sourcing [confirm]` `Scripts` `Hooks` |
| Video Production | `Product films` `Motion` `Edits` |
| Performance Creatives | `Hook testing` `Offer angles` `Iteration` |
| Brand Content | `Social content` `Visual identity` `Storytelling` |

### 8.5 Work — `02 / SELECTED WORK` (`#work`)
- Background `--color-surface-1`.
- Header row: same `SectionHeader` as Services; right column adds a `TextLink` "All case studies ↗" only if > 4 case studies exist.
- **Optional filter row `[NEW]`** (render only if ≥ 6 projects): mono 12 px chips `All · AI · UGC · Video · Performance · Brand`; active chip has lime text + lime 1 px underline.
- **Grid (preserve asymmetry):** 12-col grid, row gap 24 px, column gap 24 px. Pattern repeats every 2 rows:
  - Row A: card 1 spans cols 1–5 (portrait, `aspect-ratio: 4/5`), card 2 spans cols 6–12 (`aspect-ratio: 7/5`), heights equalized via `align-items: stretch` and `height: clamp(420px, 42vw, 620px)`.
  - Row B: mirrored — card 3 cols 1–7, card 4 cols 8–12.
- **ProjectCard** (§12.3): `<article>` with a full-card `<a href="/work/[slug]">`.
  - Media: `<picture>` AVIF/WebP, `object-fit: cover`, default `filter: grayscale(.3)` (preserved), optional `<video muted loop playsinline preload="none">` that plays on hover/focus.
  - Overlay: bottom gradient (§4.2), padding 32 px.
  - Top-left: `FormatBadge` (C2) e.g. `9:16 · META` mono 11 px, 1 px lime border, padding 4 px 8 px, bg `rgba(5,5,5,.6)`.
  - Bottom: category mono 12 px lime; title display 600 `clamp(24px, 2.4vw, 36px)` uppercase; metadata row `[NEW]`: `Client · Platform · Result` mono 12 px secondary separated by `·` — values `[PLACEHOLDER]`.
  - Bottom-right: ↗ in 48 × 48 box (like services).
  - Hover: image `scale(1.05)` 800 ms `--ease-out`, `grayscale(0)` 500 ms; video fades in 300 ms; arrow box turns lime.
- Below grid, centered: secondary `Button` "Discuss a similar project ↗" → `#contact`.

### 8.6 Results — `03 / THE INTENT`
- Background `--color-ink`.
- Heading: standard `--text-display-2` (same as other H2s — reference used a larger size, which competed with the hero). 4 lines; lines 3–4 lime. cols 1–8.
- Right (cols 9–12, align end): 1 short paragraph explaining how results are measured `[PLACEHOLDER]`.
- Stats row: margin-top 96 px; `grid-template-columns: repeat(4, 1fr)`; top border hairline; each stat `padding: 28px 24px 0 0`, `border-right: 1px solid --color-line` (except last).
  - Value: display 500, `clamp(48px, 5vw, 80px)`, lh 1, ls −0.04em, `--color-text-primary`; suffix (`+`, `%`) in lime.
  - Label: 14/20 `--color-text-secondary`, margin-top 12 px, max 22ch.
  - Count-up from 0 over 1,200 ms `easeOutCubic` when 50 % visible; render final value in HTML for no-JS/SEO; `aria-live` NOT used (avoid noise). Reduced motion → no count.
  - Placeholder rendering: `<span class="placeholder-chip">[METRIC]</span>` — dashed 1 px `--color-lime` border, mono 14 px lime. **Must not ship to production** (CI check, §20).

### 8.7 Process — `04 / HOW WE WORK` (`#process`) — LIGHT THEME
- Apply `data-theme="paper"` on the section, which remaps tokens (§10.3).
- Background `--color-paper` `#E8E8E2`. Heading line 1 `#0B0B0B`, line 2 `--color-lime-ink` (**`#4F6900`, 5.09:1 — replaces failing `#799E00`**). Optional decorative use of `#799E00` only for non-text graphics (the progress line).
- Layout: heading cols 1–7; right cols 9–12 short paragraph (optional).
- Steps: `<ol>` 5 columns (`repeat(5, 1fr)`), margin-top 96 px. Each step: `padding: 32px 24px 0 0`, `border-left: 1px solid rgba(11,11,11,.14)` (first has none).
  - Number: mono 13 px `--color-lime-ink`.
  - Title: display 600, 22 px, uppercase, ls −0.02em, `#0B0B0B`, margin-top 40 px.
  - Description: 15/24, `rgba(11,11,11,.68)` (≈ 6.5:1), max 26ch, margin-top 12 px.
- **Progress line (C8):** a 2 px line on the top edge of the steps row; base `rgba(11,11,11,.14)`, fill `#799E00` (decorative). `scaleX` maps from 0 → 1 as the section scrolls from 70 % to 30 % of viewport (CSS `animation-timeline: view()` with JS IntersectionObserver fallback that just sets it to 1). Each step's number turns `#0B0B0B` → lime-ink as the fill passes.
- Padding: 140 px top/bottom; remove the reference's empty band below steps.

### 8.8 Why us — `05 / THE DIFFERENCE` (`#about`)
- 12-col. Left cols 1–5: **sticky** (`position: sticky; top: 120px`) block containing eyebrow, H2 (2–3 lines, last lime), and a `TextLink` "Start a project ↗". Right cols 7–12: list.
- List: `<ul>` of 5 `WhyItem`s; each `display: grid; grid-template-columns: 56px 1fr; gap: 16px; padding: 32px 0; border-bottom: hairline` (first has border-top).
  - Col 1: mono 13 px number in lime.
  - Col 2: title display 600, 22–26 px uppercase `--color-text-primary` (**larger than reference's 11 px lime micro-title, which was too weak**), then description 16/26 secondary, max 52ch, margin-top 10 px.
  - Hover: number box → lime fill/black text; nothing else.
- Result: the heading stays in view while the list scrolls, removing dead space (C9).

### 8.9 Founder — `06 / THE FOUNDER`
- Background `--color-surface-1`.
- 12-col: portrait cols 1–5, text cols 7–12, `align-items: start`.
- Portrait: `<picture>` AVIF/WebP, `aspect-ratio: 4/5`, `object-fit: cover`, `filter: grayscale(1) contrast(1.05)`. A 1 px lime frame offset 16 px down-right behind the image (`::after`) `[NEW]` — echoes the format-frame motif. Caption below in mono 12 px: `[FOUNDER NAME] — Founder, [AGENCY_NAME]`.
- Text column (sticky top 120 px on ≥1280 so it stays beside the tall portrait):
  - Eyebrow `06 / THE FOUNDER`.
  - H2 `--text-display-2`, **max 4 lines** (reference used 5; shorten copy), last 1–2 lines lime.
  - Pull-quote `[NEW]`: 24/34 Inter 400 (no italics), `--color-text-primary`, left border 2 px lime, padding-left 20 px, margin-top 40 px — `"[PLACEHOLDER: one-sentence founder belief]"`.
  - Name: 20 px / 600. Role: mono 12 px uppercase muted.
  - Bio: 16/26 secondary, max 56ch, 2 short paragraphs max.
  - Actions: primary `Button` "Work with [FIRST NAME] ↗" → `#contact` + icon link LinkedIn `[PLACEHOLDER URL]` (44 × 44, 1 px line border).

### 8.10 Testimonials — `07 / WHAT CLIENTS SAY` — LIME THEME
- `data-theme="lime"`: bg `#C7FF2F`, text `#0B0B0B`, borders `#3D4F0E` (**7.65:1, replaces `#60791C` 4.18:1 for UI borders** — `#60791C` may remain for non-essential decorative lines).
- Header: eyebrow + H2 left (cols 1–8); controls right (cols 10–12, align end): prev/next 52 × 52 square buttons (`aria-label="Previous testimonial"` / `"Next testimonial"`), counter mono `01 / 03` between them, `aria-live="polite"` on the slide region.
- Slide: quote in Inter Tight 500, `clamp(28px, 3.4vw, 48px)`, lh 1.15, ls −0.02em, max 28ch, with an oversized `“` glyph (120 px, `rgba(11,11,11,.12)`) positioned top-left behind. Attribution row: optional 48 px square client photo/logo (grayscale), `— [Client name]` 16/600, `[Role, Brand]` mono 12 px `rgba(11,11,11,.7)`.
- Transition: crossfade + 24 px translateX, 400 ms. No autoplay (avoids WCAG 2.2.2 issues). Keyboard: arrows work when the region is focused. Swipe on touch.
- Visibility per §7.3.

### 8.11 Contact — `08 / START A PROJECT` (`#contact`)
- Background `--color-surface-2` `#151515`.
- 12-col: left cols 1–5 (sticky top 120): eyebrow, H2 **max 4 lines** (reference used 6), last 2 lines lime; below it the **"What happens next" panel `[NEW]` (C10)**:
  ```
  01  We reply within [PLACEHOLDER: 24h]
  02  A 20-min call to understand your goals   [confirm]
  03  You receive a creative plan & quote      [confirm]
  ```
  mono numbers lime, text 15/24 secondary, hairlines between. Then: `Prefer email? [hello@PLACEHOLDER.com]` as `TextLink`.
- Right cols 7–12: `<form>` (§12.7), 2-col field grid gap 32 px × 40 px:
  | Row | Field 1 | Field 2 |
  |---|---|---|
  | 1 | Your name* (`autocomplete="name"`, placeholder "Jane Doe") | Work email* (`type="email"`, `autocomplete="email"`) |
  | 2 | Brand / company* (`autocomplete="organization"`) | Website (optional, `type="url"`) `[NEW]` |
  | 3 | What do you need?* (select: 5 services + "Not sure yet") | Estimated budget* (select; ranges & currency `[PLACEHOLDER — confirm currency, e.g. ₹ vs $]`) |
  | 4 | Tell us about the project* (textarea, full width, 5 rows, 1000 char counter) | |
  | 5 | Consent checkbox: "I agree to the [privacy policy]." (full width) | |
  | 6 | Submit `Button` primary `lg` "Send inquiry ↗" + mono 12 px note "We'll never share your details." | |
- States: see §12.7. Success replaces the form with a lime-bordered panel: `✓ Thanks, [first name]. We'll reply within [24h].` + "Back to top" link; focus moves to the success heading.
- Pre-fill: if URL has `?service=slug` (from service rows), select it.

### 8.12 Footer
```
┌──────────────────────────────────────────────────────────────┐
│ Have an idea worth noticing?             [START A PROJECT ↗] │  CTA row
│──────────────────────────────────────────────────────────────│
│ NAVIGATE      SERVICES             CONTACT         SOCIAL    │  4 cols
│ Home          AI Ad Creatives      hello@…         Instagram │
│ Work …        UGC & Creator Ads …  [City, Country] LinkedIn  │
│──────────────────────────────────────────────────────────────│
│ [AGENCY_NAME]  ← oversized wordmark, 16vw, #151515 on ink    │
│──────────────────────────────────────────────────────────────│
│ © {currentYear} [AGENCY_NAME]   Privacy     Back to top ↑    │
└──────────────────────────────────────────────────────────────┘
```
- Background `--color-ink`, top hairline. Padding 96 px top, 40 px bottom.
- CTA row: H3 display 600 `clamp(28px, 3vw, 44px)` uppercase + primary Button.
- Columns: headings mono 12 px uppercase muted; links 15 px secondary, hover lime, row gap 12 px.
- Wordmark: display 700, `font-size: 16vw`, lh 0.8, ls −0.06em, color `#151515` (barely visible, texture) with the "A" initial in lime at 100 % — `aria-hidden="true"`.
- Bottom bar: 13 px muted; year computed at build/runtime (fixes static "© 2025").

### 8.13 Case-study template (`/work/[slug]`) `[NEW]`
Order: header (same nav) → hero (eyebrow `CASE STUDY / [CATEGORY]`, H1 display-2 project name, metadata grid 4 cols: Client · Services · Platforms · Year) → full-width media (16:9 video or image) → "The brief" / "The idea" / "The result" 3 blocks (2-col: label left cols 1–4 mono, text right cols 6–12) → media gallery (format frames 9:16 + 1:1 side by side) → results stats (reuse §8.6 stats row) → next-project card (full-width, hover zoom) → Contact section (reuse) → footer.

---

## 9. Typography System

### 9.1 Font families `[NEW]`
| Role | Family | Weights to load | Fallback stack | Why |
|---|---|---|---|---|
| Display (headings) | **Inter Tight** (variable) | 500, 600, 700 | `"Helvetica Neue", Helvetica, Arial, sans-serif` | Closest open-source match to the reference's Helvetica Neue 600 with tight tracking; consistent across OS |
| Body/UI | **Inter** (variable) | 400, 500, 600 | same | High legibility at 14–18 px; pairs natively with Inter Tight |
| Labels/numbers | **JetBrains Mono** | 400, 500 | `ui-monospace, "SFMono-Regular", Menlo, monospace` | Gives eyebrow numbering and metadata a "production slate" feel — our 30 % |

Self-host as WOFF2 subsets (Latin), `font-display: swap`, preload only Inter Tight 600 and Inter 400. Use `size-adjust`/`ascent-override` on fallback `@font-face` to minimize CLS (or Next.js `next/font`, which does this automatically).

> If the client owns a licence for **Neue Haas Grotesk Display** or **Neue Montreal**, they may replace Inter Tight one-to-one; all sizes below still apply.

### 9.2 Type scale (fluid, 360 px → 1440 px viewports)
| Token | Use | Family / weight | Size (clamp) | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| `--text-display-1` | Hero H1 | Display 600 | `clamp(52px, 8.4vw + 12px, 136px)` | 0.88 | −0.055em | Upper |
| `--text-display-2` | Section H2 | Display 600 | `clamp(44px, 6.2vw + 8px, 104px)` | 0.9 | −0.05em | Upper |
| `--text-h3` | Service titles, footer CTA | Display 600 | `clamp(28px, 2.6vw + 10px, 48px)` | 1.0 | −0.03em | Upper |
| `--text-h4` | Card titles, step titles, why titles | Display 600 | `clamp(20px, 1vw + 14px, 28px)` | 1.1 | −0.02em | Upper |
| `--text-quote` | Testimonial | Display 500 | `clamp(26px, 2.6vw + 12px, 48px)` | 1.15 | −0.02em | Sentence |
| `--text-stat` | Stats | Display 500 | `clamp(48px, 4.4vw + 20px, 88px)` | 1.0 | −0.04em | — |
| `--text-body-lg` | Lead paragraphs | Body 400 | `clamp(17px, .3vw + 16px, 20px)` | 1.55 | −0.005em | Sentence |
| `--text-body` | Body | Body 400 | `16px` | 1.6 | 0 | Sentence |
| `--text-body-sm` | Card meta, helper text | Body 400 | `14px` | 1.5 | 0 | Sentence |
| `--text-label` | Eyebrows, nav, tags, numbers | Mono 400 | `12px` (13 px ≥1440) | 1.4 | 0.12em | Upper |
| `--text-button` | Buttons | Body 600 | `13px` (sm) / `14px` (md, lg) | 1 | 0.06em | Upper |

**Note on reference values:** reference h1 ls −0.07em is slightly too tight with Inter Tight (letters collide in "WA", "AT"); −0.055em is the calibrated equivalent. Reference body copy (14–15 px) is raised to 16–18 px for readability.

### 9.3 Rules
- Headings are written in sentence case in the source and transformed via CSS `text-transform: uppercase` (better for screen readers and SEO snippets).
- Lime split: wrap the accent part in `<span class="accent">` → `color: var(--color-accent-text)` (lime on dark, lime-ink on paper, ink on lime).
- Max line length: body 65ch; lead 46ch.
- Use `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Font features: Inter `font-feature-settings: "ss01", "cv11"` (single-storey a off; straight-tail l optional) — keep default if unsure. Stats use `font-variant-numeric: tabular-nums`.
- Never use font-weight < 400 on dark backgrounds.

---

## 10. Color Design Tokens

### 10.1 Primitive tokens (exact brand values — do not edit)
```css
:root {
  /* Brand */
  --lime-500: #C7FF2F;   /* --lime in reference */
  --lime-300: #E0FF8A;   /* hover tint (reference) */
  --lime-700: #799E00;   /* reference dark lime — decorative only */
  --lime-800: #4F6900;   /* NEW: text-safe dark lime on paper (5.09:1) */
  --olive-700: #60791C;  /* reference border on lime — decorative only */
  --olive-900: #3D4F0E;  /* NEW: text/UI-safe on lime (7.65:1) */

  /* Neutrals (dark) */
  --ink-1000: #050505;   /* --ink: page bg */
  --ink-950:  #070707;   /* text on lime buttons */
  --ink-925:  #0B0B0B;   /* text on paper / lime */
  --ink-900:  #0D0D0D;   /* --surface */
  --ink-850:  #151515;   /* contact bg */
  --ink-800:  #181818;   /* card fallback */
  --ink-700:  #262626;   /* --line hairline */
  --ink-600:  #444444;   /* input underline (reference) */
  --ink-500:  #6A6A66;   /* NEW: input underline & secondary-button border — 3.36:1 on #151515, 3.75:1 on #050505 (meets WCAG 1.4.11 non-text 3:1; reference #444444 was 1.87:1) */

  /* Neutrals (text) */
  --paper-50:  #F5F5F1;  /* primary text on dark */
  --grey-300:  #A4A4A1;  /* --soft */
  --grey-400:  #9A9A96;
  --grey-500:  #8C8C88;
  --grey-600:  #7C7C78;  /* minimum for small text on ink (4.86:1) */

  /* Light section */
  --paper-200: #E8E8E2;

  /* Glow */
  --glow-lime: #172012;
  --tint-lime: #0C100A;
}
```

### 10.2 Semantic tokens (default dark theme)
```css
:root {
  --color-bg:              var(--ink-1000);
  --color-surface-1:       var(--ink-900);
  --color-surface-2:       var(--ink-850);
  --color-surface-card:    var(--ink-800);
  --color-nav-bg:          rgb(5 5 5 / .78);

  --color-text-primary:    var(--paper-50);   /* 18.65:1 */
  --color-text-secondary:  var(--grey-300);   /* 8.16:1 */
  --color-text-muted:      var(--grey-500);   /* 6.04:1 */
  --color-text-subtle:     var(--grey-600);   /* 4.86:1 — floor for any text */

  --color-accent:          var(--lime-500);
  --color-accent-hover:    var(--lime-300);
  --color-accent-text:     var(--lime-500);   /* headline accent spans */
  --color-on-accent:       var(--ink-950);    /* 17.05:1 */

  --color-line:            var(--ink-700);
  --color-line-strong:     #3A3A3A;
  --color-input-line:      var(--ink-500);
  --color-focus:           var(--lime-500);

  --color-error:           #FF6B5B; /* NEW, UI-feedback only — see note */
  --color-success:         var(--lime-500);

  --gradient-hero:
    radial-gradient(circle at 72% 44%, var(--glow-lime) 0, transparent 31%),
    linear-gradient(115deg, var(--ink-1000) 64%, var(--tint-lime));
  --gradient-card-overlay:
    linear-gradient(to top, rgb(5 5 5 / .88) 0%, rgb(5 5 5 / .4) 35%, transparent 60%);
}
```
> **Error color note:** the reference has no error state. A warm red is the only hue added, used solely for form validation text/borders (accessibility requires errors to be distinguishable). It never appears decoratively.

### 10.3 Section themes
```css
[data-theme="paper"] {           /* Process */
  --color-bg: var(--paper-200);
  --color-text-primary: var(--ink-925);           /* 16:1 */
  --color-text-secondary: rgb(11 11 11 / .68);
  --color-text-muted: rgb(11 11 11 / .6);
  --color-accent-text: var(--lime-800);           /* 5.09:1 */
  --color-line: rgb(11 11 11 / .14);
  --color-focus: var(--ink-925);
}
[data-theme="lime"] {            /* Testimonials */
  --color-bg: var(--lime-500);
  --color-text-primary: var(--ink-925);           /* 16.66:1 */
  --color-text-secondary: rgb(11 11 11 / .72);
  --color-accent-text: var(--ink-925);
  --color-line: var(--olive-900);
  --color-focus: var(--ink-925);
}
```

### 10.4 Color usage rules
| Element | Default | Hover | Active/Pressed | Focus-visible | Disabled |
|---|---|---|---|---|---|
| Primary button | bg lime-500 / text ink-950 | bg lime-300, translateY(−2px) | translateY(0), bg lime-500 | 2 px outline paper-50, offset 3 px | bg #262626, text grey-600 |
| Secondary button | transparent, 1 px input-line (#6A6A66), text primary | border lime, text lime | — | as above | text grey-600 |
| Text link | text secondary | text lime | — | underline + outline | — |
| Nav link | secondary | lime | primary + lime square (active section) | outline | — |
| Input | underline input-line | underline grey-500 | — | underline lime 2 px | — |

---

## 11. Spacing and Layout System

### 11.1 Spacing scale (4-px base)
```css
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-7: 32px;  --space-8: 40px;
  --space-9: 48px;  --space-10: 64px; --space-11: 80px; --space-12: 96px;
  --space-13: 128px; --space-14: 160px;

  --section-y: clamp(88px, 8vw + 40px, 160px);   /* reference: 130 / 90 */
  --section-y-tight: clamp(72px, 6vw + 32px, 140px);
  --header-gap: clamp(48px, 5vw + 16px, 96px);     /* heading → content */
  --gutter: clamp(20px, 5vw, 80px);                /* reference: 6vw / 25px */
  --grid-gap: clamp(16px, 1.6vw, 24px);
  --header-h: 80px;                                /* 64px < 1024 */
}
```

### 11.2 Container & grid
```css
.container { width: 100%; max-width: 1360px; margin-inline: auto; padding-inline: var(--gutter); }
.container--wide { max-width: 1600px; }   /* Work grid & footer wordmark */
.grid-12 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--grid-gap); }
```
- Reference content width at 1154 px was 1001 px (6 vw gutters, no max-width → lines become extremely long on 1920+ screens). The 1360 px cap fixes this.
- Standard column proportions:
  | Pattern | Desktop cols | Used by |
  |---|---|---|
  | Heading + aside | 1–7 / 9–12 | Services, Work, Results headers |
  | Text + visual | 1–7 / 8–12 | Hero |
  | Sticky + list | 1–5 / 7–12 | Why, Contact, Founder (mirrored) |
  | Full | 1–12 | Lists, grids, stats |

### 11.3 Alignment rules
1. Every section's eyebrow, H2 and the first column of its content share the same left edge (container start). No centered section headings anywhere (preserves reference's left-aligned editorial style).
2. Right-column asides align to the **baseline of the H2's last line** (`align-self: end`).
3. Hairlines span the full container width, never the viewport (except trust strip and footer top, which are full-bleed — as in the reference).
4. Numbers (`01`) align to the cap height of the adjacent title.
5. Vertical rhythm: eyebrow → H2: 24 px; H2 → lead paragraph: 32 px; paragraph → CTA row: 40 px.

### 11.4 Z-index scale
`--z-base:0; --z-raised:10; --z-preview:40; --z-header:50; --z-menu:60; --z-toast:70;`

---

## 12. Component Design System

Each component lists anatomy → spec → states → responsive.

### 12.1 Button
Anatomy: `[LABEL  ↗]` — label + 16 px arrow icon, gap 12 px.
| Variant | Spec |
|---|---|
| `primary` | bg `--color-accent`, text `--color-on-accent`, border 1 px same, radius 0, font `--text-button` |
| `secondary` | transparent, 1 px `--color-input-line` (#6A6A66, ≥3:1), text primary |
| `on-light` (paper/lime themes) | bg `#0B0B0B`, text `#F5F5F1` |
| Size | Height / padding-x |
|---|---|
| `sm` (nav) | 40 px / 18 px |
| `md` | 48 px / 24 px |
| `lg` (hero, form) | 56 px / 28 px |
- Hover: bg lighten (primary) / border lime (secondary); arrow `translate(3px,-3px)` 250 ms; whole button `translateY(-2px)` (reference used −3 px).
- Active: translateY(0). Focus-visible: `outline: 2px solid var(--color-focus); outline-offset: 3px`.
- Loading (form): label replaced by "Sending…" + 3-dot mono animation; `aria-busy="true"`; disabled.
- Mobile: `lg` buttons become `width: 100%` below 480 px.
- Always `<a>` for navigation, `<button>` for actions.

### 12.2 TextLink (secondary CTA)
Mono 12–13 px uppercase, ls 0.1em, color secondary, arrow icon ↘ or ↗. Hover: lime + a 1 px underline that scales from left (`scaleX 0→1`, 300 ms). Min hit area 44 px tall (pad vertically).

### 12.3 ProjectCard
See §8.5. Additional rules: entire card is one link (`<a>` wrapping or stretched-link pattern); title is an `<h3>`; video has no audio and `aria-hidden`; image `alt` describes the creative (e.g. "Chrome bottle product ad with lime light trails, 9:16 Instagram story"). Focus state: same as hover + 2 px lime outline inset.
Responsive: <768 single column, `aspect-ratio: 4/5`, metadata row wraps; video disabled on touch (static poster).

### 12.4 ServiceRow
See §8.4. Mobile (<768): grid becomes `40px 1fr 32px`; description + tags drop under the title spanning cols 2–3; no cursor preview; tap target is the whole row.

### 12.5 Stat
Value + suffix + label (§8.6). Mobile: 2 × 2 grid, row gap 40 px, borders: right on odd items, top on all.

### 12.6 Testimonial card
See §8.10. No container box — sits directly on lime. Mobile: quote size min 26 px, controls move below the quote, full-width row with counter centered.

### 12.7 Form fields
| Part | Spec |
|---|---|
| Label | `--text-label`, color muted, margin-bottom 10 px; `<label for>` explicit; required asterisk in lime with `aria-hidden` + `required` attr |
| Input | transparent bg, no side/top borders, `border-bottom: 1px solid var(--color-input-line)`, padding 12 px 0, font 17 px Inter, color primary, height 52 px, radius 0 |
| Placeholder | `--color-text-subtle` |
| Hover | underline `--grey-500` |
| Focus | underline 2 px lime (use `box-shadow: inset 0 -1px 0 lime` to avoid layout shift) + label turns lime |
| Error | underline `--color-error`, message 13 px error color below with ⚠ icon, `aria-invalid="true"`, `aria-describedby` → message id |
| Valid (after blur) | small lime ✓ at right end |
| Select | custom chevron 12 px SVG right, `appearance: none`, options dark bg |
| Textarea | min-height 132 px, resize vertical, character counter mono 12 px bottom-right |
| Checkbox | 18 × 18 square, 1 px `--color-input-line` (≥3:1), checked → lime fill + black check |
Validation: on blur + on submit; first invalid field receives focus on submit; summary not needed for ≤7 fields. Honeypot field + rate limiting (server).

### 12.8 SectionHeader
Props: `index` ("01"), `label` ("What we do"), `title` (array of lines with `accentFrom` index), `aside` (optional paragraph/link). Renders eyebrow `01 / WHAT WE DO` (`01` in lime, `/ WHAT WE DO` muted) → H2. Ensures consistency across 8 sections.

### 12.9 Badges, tags & labels
| Type | Spec |
|---|---|
| `Eyebrow` | mono 12 px uppercase ls .14em; number lime, rest muted |
| `Badge dot` | 6 px lime square + label (hero eyebrow) |
| `Tag` | mono 11 px uppercase, padding 6 px 10 px, 1 px `--color-line-strong`, text secondary, radius 0; hover none (non-interactive) |
| `FormatBadge` | mono 11 px, 1 px lime border, lime text, bg `rgb(5 5 5 / .6)`, padding 4 px 8 px |
| `PlaceholderChip` | dashed 1 px lime, mono lime, bg transparent — dev only |

### 12.10 Navigation & MobileMenu
See §8.1.

### 12.11 Footer
See §8.12. Mobile: CTA row stacks (button full width); 4 link columns → 2 × 2 grid; wordmark `font-size: 22vw`; bottom bar stacks centered.

### 12.12 Icons
Single stroke icon set (Lucide or custom), stroke 1.5 px, sizes 16/20/24. Arrows: ↗ `arrow-up-right`, ↘ `arrow-down-right`, ↓, ←, →, ✓, ✕, ⚠, LinkedIn/Instagram/YouTube brand glyphs as SVG.

---

## 13. Responsive Design Specifications

### 13.1 Breakpoints
The reference uses a single 800 px breakpoint, which leaves tablets with a cramped desktop layout. Replace with:
| Name | Range | Header | Gutter | Columns |
|---|---|---|---|---|
| `mobile` | 0–479 | 64 px, menu toggle | 20 px | 4 |
| `mobile-lg` | 480–767 | 64 px, menu toggle | 24 px | 4 |
| `tablet` | 768–1023 | 64 px, menu toggle | 40 px | 8 |
| `laptop` | 1024–1279 | 80 px, full nav (link gap 24 px) | 56 px | 12 |
| `desktop` | 1280–1599 | 80 px | 72 px | 12 |
| `wide` | ≥1600 | 80 px | 80 px, container capped 1360 | 12 |
Write CSS mobile-first with `min-width` queries at 480 / 768 / 1024 / 1280 / 1600.

### 13.2 Section behavior matrix
| Section | Desktop (≥1280) | Laptop (1024–1279) | Tablet (768–1023) | Mobile (<768) |
|---|---|---|---|---|
| Header | Logo · 6 links · CTA | Same, link gap 24 px, CTA `sm` | Logo · toggle (CTA hidden; shown in menu) | Same as tablet |
| Hero | 2-col 7/5, visual 560 px square, service labels on orbit | 2-col 7/5, visual 440 px, labels visible | **Stacked**: text first, visual below at 420 px wide centered; labels hidden; format frames kept | Stacked; H1 `clamp(52px,14vw,72px)`; visual 100 % width max 360 px; CTAs full width stacked (primary then text link); hero-footer: hide "Scroll to explore", keep tagline; `min-height: auto` |
| Trust | Marquee + 5-col logos | 5-col | 3-col (+2 centered row) | 2-col; 5th logo spans 2 |
| Services header | H2 cols 1–7, aside 9–12 | same | Stacked, aside below H2 (max 46ch) | Stacked |
| Service rows | 4-col row + cursor preview | 4-col, no preview below 1100 px | `56px 1fr 40px`, description+tags under title | `40px 1fr 32px`; title 26–30 px; tags wrap |
| Work grid | Asymmetric 5/7 – 7/5 | Same | 2 equal cols, aspect 4/5 | 1 col, aspect 4/5, gap 16 px |
| Results stats | 4 cols | 4 cols | 2 × 2 | 2 × 2 (value 44 px) |
| Process steps | 5 cols + horizontal progress | 5 cols (desc 14 px) | **Vertical timeline**: 1 col, progress line becomes vertical on the left (2 px, `scaleY`) | Same as tablet |
| Why | Sticky 5 / list 6 | Same | Stacked, no sticky | Stacked |
| Founder | Portrait 5 / text 6, text sticky | Same, no sticky | Portrait 60 % width left-aligned, text below | Portrait full width aspect 4/5 (max 480 px tall), text below |
| Testimonials | Controls right of H2 | Same | Same | Controls below quote |
| Contact | Sticky left 5 / form 6, 2-col fields | Same | Stacked; form 2-col fields | Stacked; fields 1-col; submit full width |
| Footer | 4 link cols | 4 | 2 × 2 | 2 × 2, wordmark 22vw |

### 13.3 Touch & input rules
- All interactive targets ≥ 44 × 44 px on touch.
- Hover-only effects gated with `@media (hover:hover) and (pointer:fine)`; touch devices get the "hover" visual state on `:active` / focus where useful (e.g. project card arrow turns lime on tap).
- No horizontal overflow at 320 px (test explicitly). Use `overflow-x: clip` on `body` only as a safety net, not as a fix.
- Use `svh`/`dvh` units for hero height to avoid mobile browser-chrome jumps.

---

## 14. Animation and Interaction Guidelines

### 14.1 Motion tokens
```css
:root {
  --ease-out: cubic-bezier(.22, 1, .36, 1);     /* expo-ish out — default */
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);
  --dur-xs: 150ms;  /* color, opacity micro */
  --dur-sm: 250ms;  /* buttons, links */
  --dur-md: 500ms;  /* reveals */
  --dur-lg: 800ms;  /* image zoom, hero lines */
}
```
Animate only `transform`, `opacity`, `clip-path`, `filter` (filter only on images ≤ 4 at a time). Never animate `padding`, `width`, `height`, `top/left` (the reference animates `padding-left` on service rows — replace).

### 14.2 Catalogue
| # | Interaction | Trigger | Spec | Reduced motion |
|---|---|---|---|---|
| M1 | Hero H1 line reveal | Page load (after fonts ready or 300 ms max) | Each line in an `overflow:hidden` wrapper; inner `translateY(105%) → 0`, 800 ms `--ease-out`, stagger 90 ms. Eyebrow, paragraph, CTAs then fade+rise 16 px, 500 ms, stagger 80 ms starting at 350 ms | Show instantly |
| M2 | Hero visual entrance | Load | Orb image `scale(.92) opacity 0 → 1`, 900 ms; orbit rings draw via `stroke-dashoffset` 1200 ms; format frames fade in staggered 120 ms | Static |
| M3 | Orbit rotation | Continuous | Ring A 60 s/rev, ring B 90 s/rev reverse; service labels counter-rotate to stay upright; pause when hero is off-screen (IntersectionObserver) and when tab hidden | No rotation |
| M4 | Pointer tilt | `pointermove` over hero (pointer:fine) | ±6° max, lerp 0.08 via rAF; reset on leave over 600 ms | Disabled |
| M5 | Section hairline draw (C12) | Section top enters 85 % viewport | `scaleX(0→1)`, origin left, 800 ms | Static line |
| M6 | Scroll reveal (generic) | Element enters 85 % viewport, once | `opacity 0 → 1; translateY(24px → 0)`, 500 ms, stagger children 60 ms (max 6 staggered) | Opacity only, 150 ms |
| M7 | Heading reveal (H2) | Enters 80 % | Same line-mask technique as M1, 700 ms, stagger 70 ms | Instant |
| M8 | Marquee | Continuous | 40 s linear; pause on hover; pause off-screen | Static text |
| M9 | Service row hover | Hover/focus | Title translateX 12 px; icon box fill; preview follow (lerp .15) | Color change only |
| M10 | Project card hover | Hover/focus | Image scale 1.05 / 800 ms; grayscale → 0 / 500 ms; video fade 300 ms | Color only, no scale/video |
| M11 | Stats count-up | 50 % visible, once | 1200 ms easeOutCubic | Final value |
| M12 | Process progress line | Scroll-linked | `animation-timeline: view()` (Chromium/Safari 18+) with IO fallback | Full line static |
| M13 | Testimonial change | Click/arrow/swipe | Out: opacity→0, x −24 px (200 ms); In: from x +24 px (400 ms) | Instant swap |
| M14 | Button hover | Hover | translateY −2 px, arrow translate(3,−3) 250 ms | Color only |
| M15 | Nav hide/show | Scroll direction | translateY(−100 %) 300 ms | Always visible |
| M16 | Mobile menu | Toggle | Overlay fade 200 ms; links rise 16 px stagger 40 ms | Fade only |
| M17 | Form success | Submit OK | Form fades out 200 ms, success panel clip-path reveal from left 500 ms | Instant |
| M18 | Anchor scrolling | Nav click | Native `scroll-behavior: smooth` with `scroll-margin-top: 96px` on sections | `scroll-behavior: auto` |

### 14.3 Implementation approach
- Use **Motion (motion.dev / Framer Motion)** for M1, M2, M7, M13, M16, M17 *or* plain CSS + a ~40-line IntersectionObserver utility for M5, M6, M8, M11. Do **not** add GSAP + ScrollTrigger + Lenis together; one animation library maximum.
- No smooth-scroll hijacking library (Lenis/Locomotive) — native scrolling is preserved for accessibility and performance.
- Global reduced-motion guard:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```
  plus a JS `useReducedMotion()` check to skip rAF loops (M3, M4, C4 preview, M11).

### 14.4 Motion budget
- Max 1 continuously looping animation visible at any moment (hero orbit OR marquee — they are adjacent, so pause the orbit once the hero is < 40 % visible).
- Total JS for animation ≤ 35 KB gzipped.
- All reveals fire **once**; no re-animation on scroll-up.
- Content must be visible if JS fails: reveal classes are added by JS (`.js .reveal { opacity:0 }`), never hard-coded in CSS for no-JS.

---

## 15. Image and Asset Guidelines

### 15.1 Art direction (preserve)
- **Style:** dark, studio-lit 3D renders of chrome/glass/stone objects with **lime light trails or edge glows**, near-black backgrounds (`#050505`–`#181818`), single key light, shallow depth. This is the reference's visual signature (hero orb, Project Alpha–Delta).
- **Real work** (client ads, UGC stills, video frames) is shown inside the same dark frames; it does not need to be recolored, but card overlays and the `grayscale(.3)` default unify mixed content.
- **People:** black-and-white portraits only (founder, testimonial avatars).
- Avoid: stock office photography, colorful gradients, illustrations with other hues, AI images with visible artifacts (hands, text).

### 15.2 Asset list
| Asset | Qty | Format | Dimensions (source) | Delivered sizes | Notes |
|---|---|---|---|---|---|
| Logo mark (lime square "A") | 1 | SVG | — | inline | Plus favicon set |
| Wordmark | 1 | SVG or live text | — | — | `[AGENCY_NAME]` |
| Hero orb render | 1 | AVIF + WebP + JPG fallback | 1600 × 1600, subject centered for circle crop | 360, 560, 840, 1120 w | `fetchpriority="high"`, not lazy |
| Service preview media | 5 | WebP/AVIF 9:16 (or MP4 ≤ 1.5 MB) | 720 × 1280 | 240, 480 w | Lazy; loaded on first row hover |
| Project cover images | 4–8 | AVIF/WebP | 1600 × 2000 (4:5) **and** 2240 × 1600 (7:5) crops | 480, 800, 1200, 1600 w | Supply both crops per project |
| Project hover videos | optional | MP4 H.264 + WebM, muted, 6–10 s loop | 1080 px short side | ≤ 2.5 MB each | `preload="none"`, poster = cover |
| Client logos | 4–10 | SVG (monochrome) | — | — | `[PLACEHOLDER]` |
| Founder portrait | 1 | AVIF/WebP | 1600 × 2000 | 480, 800, 1200 w | B&W treatment can be CSS or baked |
| Testimonial avatars | per quote | WebP | 192 × 192 | 96 w @2x | Optional |
| Open Graph image | 1 | PNG/JPG | 1200 × 630 | — | Black bg, lime headline, logo |
| Favicons | set | SVG + PNG 32/180/192/512 + `site.webmanifest` | — | — | Lime "A" on black |
| Noise tile | 1 | PNG | 64 × 64 | — | ≤ 3 KB, opacity 2–3 % |

### 15.3 Rules
- Every `<img>` has explicit `width`/`height` (or `aspect-ratio`) to prevent CLS.
- `loading="lazy"` + `decoding="async"` on everything below the hero.
- `sizes` attribute must match the grid (e.g. project card col 1–5 at desktop: `(min-width:1280px) 560px, (min-width:768px) 50vw, 100vw`).
- Reference images are 1264 × 848 PNG/JPG with no `srcset` and the founder portrait is a 1254 × 1254 PNG — re-export all; target ≤ 180 KB per image at 1200 w.
- `alt` text describes content and purpose; decorative layers (`orbit rings`, `format frames`, `noise`) are CSS/SVG with `aria-hidden`.

---

## 16. Content and Copywriting Direction

### 16.1 Voice
**Confident, concise, outcome-oriented.** Short declarative sentences. Talk about the client's results, not the agency's tools. Use "you/your brand" more than "we". No buzzword stacking ("synergy", "cutting-edge", "next-level").

### 16.2 Copy structure per section (original directions — client to approve)
Do **not** reuse the reference's exact copy. Below are original directions that keep the same structure (4-line uppercase headline, lime ending, short lead).

| Section | Eyebrow | Headline direction (lime part in **bold**) | Lead / body direction |
|---|---|---|---|
| Hero | `AI-powered creative agency` | "We make ads / people / actually / **stop for.**" — or — "Creative that / earns the / **second / look.**" | One sentence: who we help + what we make + outcome. ≤ 25 words. |
| Hero footer | — | — | One-line positioning, e.g. "Creative for brands that would rather be remembered than scrolled past." |
| Services | `01 / What we do` | "Five ways to / **win the / scroll.**" | How the services combine from idea to conversion. |
| Work | `02 / Selected work` | "Proof, not / **promises.**" | One sentence introducing the case studies. **Remove** any "placeholder worlds / replace these" text. |
| Results | `03 / The intent` | "Ideas are the / means. / **Growth is / the point.**" | How success is measured `[PLACEHOLDER]`. |
| Process | `04 / How we work` | "Brief to / **breakthrough.**" | 5 steps — titles can stay Discover · Strategize · Create · Test · Scale (generic terms, not proprietary); rewrite descriptions. |
| Why | `05 / The difference` | "Why brands / **choose us.**" | 5 differentiators: AI + human craft, speed, volume, performance mindset, platform-native. Each: 4-word title + 1 sentence. |
| Founder | `06 / The founder` | "Built by a / creator, / **for growth-minded / brands.**" (≤4 lines) | Pull quote + 2 short paragraphs `[PLACEHOLDER: founder bio]`. |
| Testimonials | `07 / What clients say` | "Good work / **gets talked about.**" | Real quotes only. |
| Contact | `08 / Start a project` | "Let's make / something / **impossible / to ignore.**" | What happens next (3 steps). |
| Footer | — | "Have an idea worth noticing?" | — |

### 16.3 Placeholder registry (must be resolved before launch)
| Key | Where | Status |
|---|---|---|
| `[AGENCY_NAME]` | Logo, footer, meta | Confirm (reference: "AdverBright Media") |
| `[FOUNDER NAME]`, bio, photo, LinkedIn | Founder | Reference shows a founder; confirm content & consent |
| Client logos (≥4) | Trust | Missing in reference |
| Case studies (≥4: title, client, platform, result, media) | Work | Missing — reference uses AI renders as placeholders |
| Metrics (≥3) | Results | Missing — reference uses "XX" |
| Testimonials (≥1, ideally 3) | Testimonials | Missing |
| Response time, call length, deliverable promise | Hero micro-trust, Contact | Confirm |
| Budget ranges & currency | Form | Reference uses USD; confirm market |
| Contact email, phone/WhatsApp, city | Footer, Contact | Missing |
| Social URLs | Footer, Founder | Missing |
| Privacy policy text | /privacy | Missing |

---

## 17. Accessibility Requirements (target WCAG 2.2 AA)

### 17.1 Issues found on the reference `[VERIFIED]` → required fix
| Issue | Fix |
|---|---|
| Marquee text `#686864` on `#050505` = 3.64:1 at 11 px | Use `--color-text-muted` `#8C8C88` (6.04:1) and 12 px |
| Dark-lime `#799E00` on `#E8E8E2` = 2.55:1 | Text uses `#4F6900` (5.09:1) |
| Input underline `#444` on `#151515` = 1.87:1 | `#6A6A66` (3.36:1) |
| Testimonial prev/next buttons have no accessible name | `aria-label` |
| Menu toggle lacks `aria-expanded` / `aria-controls` | Add; focus trap in overlay |
| Nav items and project cards are `<button>`s without destinations | Use `<a href>` |
| Text sizes 10–11 px for labels | Minimum 12 px |
| Counter says "01 / 03" with only one slide | Counter reflects real count |
| Founder's name used as form placeholder | Generic placeholder; placeholders never replace labels |

### 17.2 Requirements
1. Skip link "Skip to content" as first focusable element (visible on focus, lime bg).
2. Landmarks: `header`, `nav[aria-label="Primary"]`, `main`, `footer`; each section `aria-labelledby` its H2.
3. Heading order: one H1 (hero), H2 per section, H3 for rows/cards/steps.
4. Focus visible on everything: 2 px outline in `--color-focus`, offset 3 px; never `outline: none` without replacement.
5. Contrast: text ≥ 4.5:1 (≥ 3:1 for ≥ 24 px or ≥ 18.66 px bold); UI boundaries ≥ 3:1. All token pairs in §10 comply.
6. Keyboard: all hover features available on focus (service preview is decorative and may be skipped); carousel operable with buttons; `Esc` closes menu.
7. Motion: `prefers-reduced-motion` honored (§14.3); continuous animations pausable (marquee pauses on hover/focus; orbit stops off-screen).
8. Forms: explicit labels, `autocomplete`, inline errors with `aria-describedby`, focus first error, success announced via focus move to heading (`tabindex="-1"`).
9. Images: meaningful `alt`; decorative `alt=""`.
10. Uppercase via CSS only; `lang="en"` on `<html>`.
11. Zoom to 200 % and 400 % reflow (320 CSS px) without loss of content or horizontal scroll.
12. Target size ≥ 24 × 24 (2.5.8) everywhere; ≥ 44 × 44 on touch.

---

## 18. Performance and SEO Requirements

### 18.1 Performance issues found on the reference `[VERIFIED]`
- Served from a **development bundle** (`/static/js/bundle.js`, Create-React-App dev server pattern) — unminified, large.
- Many third-party scripts: Emergent overlay/recorder, PostHog recorder/surveys/dead-click autocapture, web-vitals, Cloudflare insights.
- Client-side-only rendering (`<div id="root">`) → empty HTML for crawlers/LCP delay.
- Unoptimized rasters (1264 × 848 PNG/JPG, 1254² PNG portrait), no `srcset`, no lazy loading.
- Web font declared (Inter) but never loaded; full Tailwind + shadcn stylesheet shipped with unused tokens.

### 18.2 Budgets (mobile, 4G, mid-range device)
| Metric | Target |
|---|---|
| LCP | ≤ 2.0 s (hero H1 or orb image) |
| INP | ≤ 150 ms |
| CLS | ≤ 0.05 |
| JS (gzipped, initial) | ≤ 120 KB |
| CSS (gzipped) | ≤ 30 KB |
| Fonts | ≤ 3 files preloaded, ≤ 120 KB total |
| Total page weight (initial, no video) | ≤ 1.2 MB |
| Lighthouse | Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100 |

### 18.3 Performance rules
- Static generation (SSG) for all pages; hydrate only interactive islands (nav, hero visual, services preview, carousel, form).
- Videos `preload="none"`, loaded on hover intent; never autoplay on mobile data (`navigator.connection.saveData` check).
- Analytics: one privacy-friendly tool (e.g. Plausible/GA4) loaded after consent / `requestIdleCallback`. **Remove** Emergent/PostHog dev scripts.
- Preconnect only to required origins; self-host fonts.
- Pause rAF loops when off-screen or `document.hidden`.

### 18.4 SEO issues found on the reference `[VERIFIED]`
- `<title>`: "Emergent | Fullstack App"; meta description: "A product of emergent.sh"; `theme-color #000000`; no OG/Twitter tags observed; no structured data observed; content only rendered client-side.

### 18.5 SEO requirements
| Item | Spec |
|---|---|
| Title | `[AGENCY_NAME] — AI-Powered Creative & Advertising Agency` (≤ 60 chars) |
| Meta description | ≤ 155 chars, value proposition + services `[PLACEHOLDER]` |
| Canonical | Absolute URL per page |
| Open Graph / Twitter | `og:title`, `og:description`, `og:image` (1200 × 630), `og:type=website`, `twitter:card=summary_large_image` |
| `theme-color` | `#050505` |
| Structured data (JSON-LD) | `Organization` (name, logo, url, sameAs socials, contactPoint), `ProfessionalService` (areaServed `[PLACEHOLDER]`), `Person` (founder), `CreativeWork` per case study, `BreadcrumbList` on case studies |
| Headings | Single H1 per page containing the primary keyword phrase (e.g. "ads", "creative") |
| URLs | `/work/[client-or-project-slug]` lowercase-hyphen |
| Sitemap/robots | `sitemap.xml`, `robots.txt`; noindex on preview deployments |
| Images | Descriptive file names (`ugc-skincare-ad-9x16.webp`), alt text |
| Internal links | Service rows → contact with param; case studies → next case study + contact |
| 404 | On-brand page with links to Home, Work, Contact |

---

## 19. Technical Implementation Guidance

### 19.1 Reference stack — what was verified vs inferred
| Finding | Status |
|---|---|
| React (React fiber keys on `#root`) | `[VERIFIED]` |
| Create React App–style dev bundle (`/static/js/bundle.js`) | `[VERIFIED]` path; CRA/CRACO `[INFERRED]` |
| Tailwind CSS utilities + `--tw-*` variables in stylesheet | `[VERIFIED]` |
| shadcn/ui default tokens + Radix accordion keyframes present | `[VERIFIED]` (largely unused by the custom sections) |
| Custom sections styled with hand-written CSS classes (`.hero`, `.service-card`, `.project-grid`…) | `[VERIFIED]` |
| Animation library | None detected; marquee is CSS keyframes; hero tilt is inline transform set by JS `[VERIFIED]`; no Framer Motion/GSAP evidence found `[INFERRED absent]` |
| Smooth scrolling | Native CSS `scroll-behavior: smooth` `[VERIFIED]` |
| Hosting/analytics | Emergent preview + PostHog + Cloudflare `[VERIFIED]` |

### 19.2 Recommended stack for the rebuild
| Concern | Choice | Reason |
|---|---|---|
| Framework | **Next.js 15 (App Router) with static export where possible** — or Astro 5 with React islands | SSG for SEO/LCP; image & font optimization built-in |
| Language | TypeScript (strict) | |
| Styling | Tailwind CSS v4 with the tokens in §10–11 mapped via `@theme`, **or** CSS Modules + the CSS variables verbatim. Pick one; do not mix utility soup with BEM. | |
| Animation | Motion (motion.dev) + CSS | §14.3 |
| Forms | React Hook Form + Zod; server action / API route → email (Resend/Postmark) and/or CRM webhook `[PLACEHOLDER]`; Cloudflare Turnstile or honeypot | |
| Content | Local MDX/JSON content files (`/content/services.ts`, `/content/projects/*.mdx`, `/content/testimonials.ts`, `/content/site.ts`) so the client can swap placeholders without touching components | |
| Images | `next/image` (AVIF/WebP, `sizes`) | |
| Fonts | `next/font/local` or `@fontsource-variable/*` self-hosted | |
| Deployment | Vercel / Netlify / Cloudflare Pages | |

### 19.3 File / component structure
```
src/
  app/
    layout.tsx            (fonts, metadata, skip link, header, footer)
    page.tsx              (home sections in order)
    work/[slug]/page.tsx
    privacy/page.tsx
    not-found.tsx
    api/contact/route.ts
  components/
    layout/   SiteHeader, PrimaryNav, MobileMenu, SiteFooter, Container, Section
    ui/       Button, TextLink, Eyebrow, Badge, Tag, FormatBadge, PlaceholderChip, Icon
    sections/ Hero, TrustStrip, Services, Work, Results, Process, WhyUs, Founder, Testimonials, Contact
    blocks/   SectionHeader, ServiceRow, ServicePreview, ProjectCard, Stat, ProcessStep, WhyItem, TestimonialSlider, ContactForm, NextSteps
    motion/   Reveal, LineReveal, CountUp, useReducedMotion, useInView
  content/  site.ts, services.ts, projects/, testimonials.ts, stats.ts, process.ts, why.ts
  styles/   tokens.css (§10, §11, §14.1), globals.css, themes.css (§10.3)
```

### 19.4 Section wrapper contract
```tsx
<Section id="services" theme="dark|surface-1|surface-2|paper|lime" labelledBy="services-title" padding="default|tight">
  <SectionHeader index="01" label="What we do" title={["Five ways to", "win the", "scroll."]} accentFrom={1} aside={<p>…</p>} />
  …
</Section>
```
- `Section` applies `data-theme`, `scroll-margin-top: calc(var(--header-h) + 16px)`, padding tokens and the hairline (M5).

### 19.5 Content data shapes
```ts
type Service = { slug: string; index: string; title: string; description: string; tags: string[]; preview: { type: 'image'|'video'; src: string; poster?: string } };
type Project = { slug: string; title: string; client: string | null; category: 'AI'|'UGC'|'Video'|'Performance'|'Brand'; format: '9:16'|'1:1'|'16:9'|'4:5'; platform: string; result: string | null; cover: { portrait: string; landscape: string; alt: string }; video?: string; isPlaceholder: boolean };
type Stat = { value: number | null; prefix?: string; suffix?: string; label: string };
type Testimonial = { quote: string; name: string; role: string; brand: string; avatar?: string };
```
`null` values render `PlaceholderChip` in development and are **filtered out** in production builds (with a build-time warning).

### 19.6 Build order for the coding agent
1. Tokens (`tokens.css`, `themes.css`), fonts, global reset, Container/Section/SectionHeader.
2. Header + MobileMenu + Footer.
3. Hero (static first, then M1–M4).
4. Services → Work → Results → Process → Why → Founder → Testimonials → Contact (static layout + content files).
5. Contact form logic + API route + states.
6. Motion layer (Reveal, LineReveal, CountUp, progress line, service preview).
7. Case-study template, privacy, 404.
8. SEO metadata, JSON-LD, sitemap, OG image.
9. QA (§20).

---

## 20. Final Quality Assurance Checklist

### 20.1 Brand fidelity
- [ ] Only colors from §10 used (grep the codebase for hex values not in `tokens.css`).
- [ ] `#050505` page bg, `#C7FF2F` accent, `#F5F5F1` text, `#E8E8E2` process bg, lime testimonial bg — all present in the same positions as the reference.
- [ ] Every content section has `NN / LABEL` eyebrow, uppercase H2, lime accent ending.
- [ ] Border-radius is 0 everywhere except the hero orb circle.
- [ ] Section order matches §7.2.

### 20.2 Layout & responsive
- [ ] Tested at 320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560 px.
- [ ] No horizontal scroll at any width; no text overflow in H1/H2 at 320 px.
- [ ] Hero floating elements do not overlap at any tested width (reference bug fixed).
- [ ] No empty dead zones > 200 px inside sections (Why section fixed).
- [ ] Container max-width 1360 respected on wide screens.

### 20.3 Interaction & motion
- [ ] All hover effects have focus equivalents.
- [ ] `prefers-reduced-motion: reduce` disables M1–M4, M8, M11, M12, preview follow, nav hide.
- [ ] Only one looping animation visible at once; loops pause off-screen.
- [ ] No animation of layout properties (padding/width/height/top/left).

### 20.4 Content
- [ ] No `[PLACEHOLDER]`, "XX", "Brand 01", "Project Alpha", "Your testimonial goes here", "Replace these with…" strings in production build (CI grep fails the build).
- [ ] No invented clients, metrics, awards or quotes.
- [ ] Copyright year is dynamic.
- [ ] Copy does not duplicate the reference verbatim.

### 20.5 Accessibility
- [ ] axe-core: 0 violations on all pages.
- [ ] Keyboard-only walkthrough: skip link, nav, menu (Esc), service rows, project cards, carousel, form, footer.
- [ ] Screen-reader pass (VoiceOver + NVDA): headings outline, landmarks, form errors announced, success announced.
- [ ] All contrast pairs verified (§17.1 fixes applied).
- [ ] 200 % zoom and 320 px reflow pass.

### 20.6 Performance & SEO
- [ ] Lighthouse mobile scores meet §18.2.
- [ ] LCP element identified and preloaded; fonts preloaded (≤ 2).
- [ ] All images responsive (`srcset`/`sizes`), lazy below fold, explicit dimensions.
- [ ] No dev bundles or Emergent/PostHog dev scripts in production.
- [ ] Title, description, canonical, OG/Twitter, JSON-LD validated (Rich Results Test).
- [ ] sitemap.xml, robots.txt, 404 page present.

### 20.7 Forms
- [ ] Required/optional fields per §8.11; validation messages clear; first-error focus.
- [ ] Success and server-error states designed and tested; double-submit prevented.
- [ ] Spam protection active; submissions reach the configured inbox/CRM.
- [ ] Service pre-selection via `?service=` works from each service row.
- [ ] Privacy consent stored with submission.

---

*End of blueprint. Implementation should not begin until the placeholder registry (§16.3) has owners and the client has approved the copy directions in §16.2.*
