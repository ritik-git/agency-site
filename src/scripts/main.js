// Entry point for public pages. Each feature initialises only if its markup exists,
// and a failure in one never blocks the others.
import { initHeader, initMobileMenu } from "./nav.js";
import { initReveals } from "./reveal.js";
import { initHero } from "./hero.js";
import { initServicePreview, initProjectVideos, initCountUp, initProcess, initMarquee, initActionBar } from "./interactions.js";
import { initCarousel } from "./carousel.js";
import { initContactForm } from "./contact.js";

[initHeader, initMobileMenu, initReveals, initHero, initServicePreview, initProjectVideos, initCountUp, initProcess, initMarquee, initActionBar, initCarousel, initContactForm]
  .forEach((fn) => {
    try { fn(); } catch (err) { console.error(`[${fn.name}]`, err); }
  });
