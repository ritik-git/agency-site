/* Campaign Showcase — editorial carousel of real campaign screenshots + full-screen viewer.
   Data:      content/site.mjs → showcase.campaigns (one entry per screenshot)
   Images:    scripts/add-campaign-image.py → static/img/<slug>-<w>.{avif,webp} (carousel sizes)
                                             + static/campaigns/<slug>.webp (original, viewer only)
   Behaviour: src/scripts/showcase.js
   Without JS the track is a plain horizontal scroll-snap strip and each frame links to the original. */
import { html, raw, icon, asset, picture, imageMeta } from "../lib/core.mjs";
import { Section, SectionHeader } from "./ui.mjs";

const pad = (n) => String(n).padStart(2, "0");
const SIZES = "(min-width:1024px) min(52vw, 760px), (min-width:768px) 60vw, 80vw";

export function CampaignMetadata(c) {
  const kicker = [c.platform, c.type].filter(Boolean).join(" · ");
  const sub = [c.client, c.industry, c.period].filter(Boolean).join(" · ");
  return html`<div class="campaign-meta">
    <div class="campaign-meta__text">
      ${kicker ? html`<p class="campaign-meta__kicker">${kicker}</p>` : ""}
      ${sub ? html`<p class="campaign-meta__sub">${sub}</p>` : ""}
      ${c.description ? html`<p class="campaign-meta__desc">${c.description}</p>` : ""}
    </div>
    ${c.metric ? html`<p class="campaign-meta__metric"><span class="campaign-meta__value">${c.metric.value}</span><span class="campaign-meta__label">${c.metric.label}</span></p>` : ""}
  </div>`;
}

export function CampaignSlide(c, i, total) {
  const m = imageMeta(c.slug);
  const original = asset(m.original);
  return html`<li class="showcase__slide${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${pad(i + 1)} of ${pad(total)}: ${c.platform || ""}"
      data-slide-index="${i}" data-original="${original}" data-ow="${m.ow}" data-oh="${m.oh}"
      data-title="${[c.platform, c.type].filter(Boolean).join(" · ")}" data-sub="${[c.client, c.period].filter(Boolean).join(" · ")}">
    <a class="showcase__frame" href="${original}" style="aspect-ratio:${m.w} / ${m.h}" aria-label="View full screen: ${c.alt}" data-open-viewer>
      ${picture(c.slug, { alt: c.alt, sizes: SIZES, imgCls: "showcase__img" })}
      <span class="showcase__expand" aria-hidden="true">${icon("expand", 18)}</span>
    </a>
    ${CampaignMetadata(c)}
  </li>`;
}

export function CarouselNavigation(total) {
  return html`<div class="showcase-nav">
    <p class="showcase-nav__count" aria-hidden="true"><span data-showcase-current>01</span> / ${pad(total)}</p>
    <div class="showcase-nav__dots" role="group" aria-label="Choose a campaign">
      ${Array.from({ length: total }, (_, i) => html`<button class="showcase-nav__dot${i === 0 ? " is-active" : ""}" type="button" data-showcase-dot="${i}" aria-label="Campaign ${i + 1} of ${total}" ${i === 0 ? raw('aria-current="true"') : ""}><span></span></button>`)}
    </div>
    <div class="showcase-nav__arrows">
      <button class="icon-box showcase-nav__toggle" type="button" data-showcase-toggle aria-pressed="false" aria-label="Pause slideshow">
        <svg class="showcase-nav__pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>
        <svg class="showcase-nav__play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button class="icon-box" type="button" data-showcase-prev aria-label="Previous campaign" disabled>${icon("arrow-left", 20)}</button>
      <button class="icon-box" type="button" data-showcase-next aria-label="Next campaign">${icon("arrow-right", 20)}</button>
    </div>
  </div>`;
}

export function CampaignLightbox() {
  return html`<dialog class="viewer" data-viewer aria-labelledby="viewer-title">
    <div class="viewer__bar">
      <div class="viewer__info">
        <p class="viewer__title" id="viewer-title" data-viewer-title></p>
        <p class="viewer__sub" data-viewer-sub></p>
      </div>
      <p class="viewer__count" data-viewer-count aria-live="polite"></p>
      <button class="icon-box viewer__btn" type="button" data-viewer-zoom aria-label="Zoom in" aria-pressed="false">${icon("zoom-in", 20, "icon viewer__zoom-in")}${icon("zoom-out", 20, "icon viewer__zoom-out")}</button>
      <button class="icon-box viewer__btn" type="button" data-viewer-close aria-label="Close">${icon("x", 20)}</button>
    </div>
    <div class="viewer__canvas" data-viewer-canvas>
      <img class="viewer__img" data-viewer-img alt="" decoding="async">
    </div>
    <button class="icon-box viewer__nav viewer__nav--prev" type="button" data-viewer-prev aria-label="Previous screenshot">${icon("arrow-left", 20)}</button>
    <button class="icon-box viewer__nav viewer__nav--next" type="button" data-viewer-next aria-label="Next screenshot">${icon("arrow-right", 20)}</button>
  </dialog>`;
}

export function CampaignShowcase(s) {
  const campaigns = (s?.campaigns || []).filter((c) => imageMeta(c.slug)?.original);
  if (!campaigns.length) return "";
  const n = campaigns.length;
  return Section({
    id: "showcase", theme: "surface-2", labelledBy: "showcase-title", cls: "showcase",
    children: html`<div class="container">
      ${SectionHeader({ id: "showcase-title", ...s, aside: html`<p class="lead">${s.aside}</p>` })}
    </div>
    <div class="showcase__carousel" data-showcase role="region" aria-roledescription="carousel" aria-label="Campaign screenshots" tabindex="0">
      <div class="showcase__viewport" data-showcase-viewport>
        <ol class="showcase__track" data-showcase-track>${campaigns.map((c, i) => CampaignSlide(c, i, n))}</ol>
      </div>
      <div class="container">${CarouselNavigation(n)}</div>
    </div>
    ${CampaignLightbox()}`,
  });
}
