# Client logos

Logos shown in the "Trusted by Brands That Make a Difference" marquee on the homepage.
The list (names, order, file paths) lives in `content/site.mjs` → `trust.logos`.

## Swapping in a real logo

1. Get the official asset from the brand (brand kit / press page). Use **SVG**, or a **transparent PNG**
   at least 2× display size (≈ 400 px wide).
2. Save it here under the same name, e.g. `swiggy.svg`, replacing the placeholder.
   If you use a PNG, save it as `swiggy.png` and change `src` in `content/site.mjs`.
3. Rebuild. Nothing else to change.

Every file here that is still a placeholder carries a `data-logo-placeholder` attribute.
The build detects it: placeholders show in preview builds and are **left out of production**.
The production marquee stays hidden until at least 4 real logos are present.

## Asset tips

- Crop to the artwork: no padding or empty space around the logo inside the file. The marquee gives every logo
  the same height, so padding makes a logo look smaller than the others.
- The site is dark. When a brand has a reversed (light-on-dark) version, use that one. Logos are greyscale until
  hovered, then shown in their real colours.
- If a logo still looks heavier or lighter than the others, add `scale: 0.9` (or `1.15`, etc.) to its entry in
  `content/site.mjs`.
- If a dark-ink logo fades into the background and there is no reversed version, add `tone: "light"` to its
  entry. It is then always drawn as a light silhouette (hover only brightens it). For a mid-dark logo whose
  real colours still read on dark (e.g. a deep purple), use `tone: "lift"`: silhouette at rest, colour on hover.
- Square or round badge logos look small next to wide wordmarks at the same height. Give them `scale: 1.3`–`1.4`.

| File                   | Brand            |
| ---------------------- | ---------------- |
| `swiggy.svg`           | Swiggy           |
| `vritus-australia.svg` | Vritus Australia |
| `greenveda.svg`        | Greenveda        |
| `extresy.svg`          | Extresy          |
| `virgin-thread.svg`    | Virgin Thread    |
| `macc.svg`             | MACC             |
| `jiva-herbals.svg`     | Jiva Herbals     |
| `tarella-exotica.svg`  | Tarella Exotica  |
| `solarhood.svg`        | Solarhood        |
