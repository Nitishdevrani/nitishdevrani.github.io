# Handoff: Portfolio Redesign (Organic, dark)

## Overview
A full redesign of `nitishdevrani.github.io` — a single long-scroll portfolio (Hero → Experience → Education → Projects → Research → Community → Contact) plus a full-screen **details page** that opens when a project card or research paper is clicked. It replaces the current look (paper-shader background, scroll car/bus tracker, glass cards, cyan accents) entirely.

**Target repo:** `nitishdevrani.github.io` (Vite + React + TypeScript, data in `src/data/*.json`, entry `src/App.tsx`).

## About the Design Files
`Portfolio.dc.html` is a **design reference built in HTML** — a working prototype of the intended look and behaviour, not production code. Recreate it inside the existing Vite/React/TS app using its patterns (components in `src/components/`, data from `src/data/projects.json` + `publications.json`). Open `Portfolio.dc.html` in a browser (serve the folder, e.g. `npx serve .`) to see it live. All styles in the prototype are inline — lift values from there when in doubt.

## Fidelity
**High-fidelity.** Final colours, type, spacing, radii, copy and motion. Recreate pixel-close.

## What to remove from the current code
- `BackgroundPaperShadersDemo`, `ScrollTracker`, `ScrollTrackingCar` and their CSS (road/vehicle/smoke).
- `TimelineDemo` / `timeline.tsx` (Tailwind timeline) — replaced by the new Experience ladder.
- `ProjectDetails.tsx` 3D STL viewer and lightbox — not in the new design (gallery images open in a new tab). `@react-three/*` deps can be dropped.
- Old `glass-card`, `badge`, `text-gradient`, cyan accent styles in `index.css` / `projects.css`.

## Suggested component structure
```
src/
  styles/tokens.css        // Organic tokens (below) + dark overrides + keyframes
  components/
    NavPill.tsx            // sticky pill nav + scroll-progress bar
    Hero.tsx               // blob portrait, floating chips, cursor glow, parallax
    SkillMarquee.tsx
    SectionBreak.tsx       // "01 ━━━━━━━━ ●" breaker
    ExperienceLadder.tsx
    EducationSteps.tsx
    ProjectBento.tsx
    ResearchList.tsx
    Community.tsx
    Contact.tsx
    DetailsPage.tsx        // full-screen overlay for project / paper
    Reveal.tsx             // IntersectionObserver reveal wrapper
  data/
    experience.json        // new (see content below)
    projects.json          // existing — add `featured: true` to 4 projects, `cover` field
    publications.json      // existing — add `lead`, `about`
```

## Design Tokens
Fonts (Google): **Caprasimo 400** (all headings/display), **Figtree 400/600/700** (body/UI).
`@import url('https://fonts.googleapis.com/css2?family=Caprasimo:wght@400&family=Figtree:wght@400;600;700&display=swap');`

Ramps (copy verbatim from `_ds/.../styles.css`):
- neutral 100–900: `#f9f4ed #eee7db #dcd3c4 #c0b6a5 #a19786 #82796a #645c50 #474238 #2e2b25`
- accent (terracotta) 100–900: `#fff2eb #ffe1d0 #ffc6a5 #f6a06b #d67f48 #b2622d #8c491a #643312 #402310`; base `--color-accent: #c67139`
- accent-2 (sage) 100–900: `#f0fae1 #e1eecc #ccdbb2 #aebf92 #8fa073 #728157 #56633f #3d472b #272e1b`

**Dark theme overrides** (applied on the page root):
- page bg `--color-neutral-900` #2e2b25; text `--color-neutral-100` #f9f4ed
- `--color-surface: color-mix(in srgb, #474238 55%, #2e2b25)` (card fill)
- body copy on dark: neutral-300 #dcd3c4; muted: neutral-400 #c0b6a5
- hairline borders: `color-mix(in srgb, #f9f4ed 7–16%, transparent)`

Photo treatment `.washed`: `filter: saturate(0.6) contrast(0.85) brightness(1.1) opacity(0.94)` — every photo/screenshot.

Radii used: 999px (pills, buttons, rows, circles), 80px (contact block), 72/64/56/48/44/42/40/36px (cards — see per-component), organic blob `58% 42% 55% 45% / 48% 58% 42% 52%`. Never sharp corners.

Icons: **Lucide**, `stroke-width: 2.75`, round caps/joins. Used: arrow-up-right, arrow-down, arrow-left, arrow-right, briefcase, mail, github, linkedin.

Buttons: DS `.btn .btn-primary` (accent fill, pill) and `.btn-secondary` (outline). Focus: `outline: 2px solid #c67139; outline-offset: 2px`.

Layout: content max-width **1240px**, side padding `clamp(20px, 4vw, 56px)`. Everything flex/grid with `wrap` — fluid down to ~360px.

## Type scale
- Hero name: Caprasimo `clamp(64px, 9.5vw, 148px)`, lh 0.9, ls −0.03em, two lines "Nitish / Devrani"
- Hero tagline: Caprasimo `clamp(26px, 3vw, 40px)`, lh 1.15, accent-400 #f6a06b, max 16ch
- Section H2: Caprasimo `clamp(60px, 9vw, 136px)`, lh 1, ls −0.02em
- Contact H2: Caprasimo `clamp(52px, 8vw, 128px)`, lh 0.95
- Details H1: Caprasimo `clamp(48px, 7vw, 104px)`, lh 0.95
- Card titles: Caprasimo 40px (projects), 30px (jobs, community), 28px (education), 23px (paper rows)
- Body: Figtree 16–18px, lh 1.55–1.75; labels Figtree 12–14px 600–700, uppercase ls 0.06–0.1em

## Screens / Views

### 1. Nav (sticky)
Sticky `top:16px`, centered, width `min(100%,1240px)`. Pill container: radius 999, padding `8px 8px 8px 22px`, bg `color-mix(#2e2b25 72%, transparent)` + `backdrop-filter: blur(18px)`, border 1px neutral-100 @10%, shadow `0 12px 40px rgba(0,0,0,.3)`.
- Brand: 14px accent dot + "Nitish Devrani" Caprasimo 22px.
- Links (Experience, Education, Projects, Writing, Community): Figtree 15/600, neutral-300, padding 10×16, radius 999; hover bg neutral-100 @8%, text neutral-100. Anchor-scroll to section ids (`scroll-margin-top: 80px`, `scroll-behavior: smooth`).
- CTA "Say hello" `.btn-primary` → `#contact`.
- **Scroll progress:** 3px accent bar at nav bottom, width = page scroll fraction.

### 2. Hero (`#top`)
Two flex columns (wrap): text `flex 1 1 480px`, portrait `flex 1 1 420px`, height `clamp(520px, 64vw, 760px)`. Section pulls under nav (`margin-top:-84px; padding-top:140px`).
- Background: cursor-following radial glow (520px circle, sage-500 @16%) using CSS vars `--mx/--my` set on mousemove; two blurred drifting orbs (accent @45%, 620px, right; sage @40%, 480px, bottom-left) with `drift` keyframes 18s/22s.
- Status chip: pill, sage-500 @18% bg, sage-200 text, 14/600, pulsing 10px sage-400 dot — "M.Sc. AI & Robotics · UTN Nuremberg".
- Name, tagline "from web products to AI at the edge.", paragraph (18px, neutral-300, max 46ch): "Full-stack developer shipping React and Next.js products since 2020 — for Petco, Adani One and Babyflix. Now in Nuremberg, fitting vision-language models onto edge devices."
- CTAs: "See selected work ↗" (primary, 16×28, 17px) → `#projects`; "Download CV" (secondary). *CV link TBD.*
- Portrait: `images/portrait-hero.jpg` (washed, object-fit cover) inside morphing blob (`morph` 16s), bg neutral-800, shadow `0 40px 100px rgba(0,0,0,.45)`. Alternatives in prototype (arch `999px 999px 64px 64px`, circle) — ship **blob**.
- Floating chips (Caprasimo 18px, pill, 12×20, `floaty` 6/7/8s): "Vision-language models" (accent bg, neutral-900 text, top-left), "Next.js" (sage-400 bg, sage-900 text, right), "Edge AI" (neutral-100 bg, bottom-left).
- "Currently" badge bottom-right: glass pill, 40px sage-700 circle with **briefcase** icon, label "CURRENTLY" 12px neutral-400 + "Hiwi, UTN Nuremberg" 15/600.
- Scroll cue: 56×88 pill outline with arrow-down, `floaty` 3s.
- **Parallax:** `--hp` = hero scroll progress 0–1. Text: `translateX(hp·−60px)`, `opacity 1−hp·0.8`. Portrait: `translateY(hp·−80px) scale(1+hp·0.05)`.

### 3. Skill marquee
Rotated −2.5deg band, accent bg pill, padding 20px 0, infinite `marquee` 38s linear (list duplicated, translateX −50%). Items Caprasimo 30px neutral-900, separated by 12px dots. Items: Next.js, React, TypeScript, Node.js, Python, Machine Learning, Deep Learning, Model fine-tuning, Data Engineering, Docker, 3D Modeling.

### Section breaker (every section 01–05)
Full-width row, `margin-bottom: 48px`, gap 20: number Caprasimo 32px (accent-400; sage-300 in Community) · flex-1 6px rounded bar (neutral-100 @10%; sage-100 @14% in Community) · 16px dot (accent; sage-400 in Community). **No capsule/pill labels above headings.**

### 4. Experience (`#experience`) — "The ladder so far"
Two columns: sticky intro (`flex 1 1 320px`, `top:120px`) with H2 + 18px neutral-400 copy "Four rungs since 2020 — from leading a streaming team in Gurugram to research support in Nuremberg."; ladder (`flex 2 1 560px`).
- Vertical track at left:27px, 6px wide, neutral-100 @10%; fill height = `--xp` (0–1, `(vh·0.6 − track.top)/track.height`), gradient sage-400→accent.
- Each rung: grid `60px 1fr`, gap 22. 60px circle (bg neutral-900, 3px accent border, Caprasimo 20 accent-300, 2-digit year). Card: padding 30×34, radius `44px 44px 44px 14px`, surface bg, 1px border @7%; hover `translateX(8px)` .5s. Contents: period pill, "Now" sage pill (current only), role Caprasimo 30, "Org · Place" 16/600 accent-400 + neutral-400, body 16.5 neutral-300, tag pills (outline @16%, 13px).

Data (`experience.json`):
| yr | period | role | org · place | body | tags |
|---|---|---|---|---|---|
| 25 | Sep 2025 — Now (current) | Hiwi (Research Assistant) | UTN · Nuremberg | Research-support and university initiatives — implementation, testing and iteration. Architected the German University Learning Review web app end-to-end. | React, Node.js, MongoDB |
| 23 | Nov 2023 — Aug 2025 | Frontend Developer | Petco · Remote | Created, upgraded and maintained PDP, PLP, brand pages and homepage experiences, with SEO improvements for high-traffic storefront pages. | Next.js, TypeScript, SEO |
| 22 | Mar 2022 — Nov 2023 | Software Engineer | Kellton · Gurugram | Built the merchant-facing sampling frontend for Adani One — responsive, accessible React components, REST integrations and PWA capabilities. | React.js, Redux, PWA |
| 20 | Jan 2020 — Mar 2022 | Sr. Associate Consultant | Oodles Technologies · Gurugram | Led a five-person team on Babyflix live streaming. Migrated a legacy PHP platform to React.js and mentored junior developers. | Live streaming, PHP → React, Team lead |

### 5. Education (`#education`) — "Step by step"
Header row: H2 left, copy right ("From computer applications to AI and robotics — each step a little higher."). Three **ascending steps** (flex, align-items flex-end, gap 18, each `flex 1 1 260px`), radius `64px 64px 28px 28px`, padding 34, content bottom-aligned, 64px badge circle at top:
1. min-h 300, bg accent-900, badge accent-700 "BCA" — 2017 — 2020 · Bachelor’s in Computer Application · Maharishi Dayanand University, India
2. min-h 400, bg accent-800, badge accent-600 "MCA" — 2020 — 2022 · Master’s in Computer Application · Gurugram University, India
3. min-h 500, bg accent-700, badge accent-400 "M.Sc" — 2024 — 2026 · Master’s in AI & Robotics · University of Technology Nuremberg, Germany
Dates 13px uppercase accent-300; title Caprasimo 28 accent-100; school 16px accent-200.

### 6. Projects (`#projects`) — "Things I’ve grown"
Bento of 4 clickable cards (flex wrap, gap 22). Hover: `translateY(-8px)` + shadow `0 30px 70px rgba(0,0,0,.4)`, .6s `cubic-bezier(.2,.7,.2,1)`. Click → DetailsPage.
1. **VLM on Edge Devices** — `flex 7 1 460px`, surface bg, radius 56, padding 18/18/34; image 360px tall radius 42 (`vlm/card.png`); pills "Research" (accent) + "Python · PyTorch"; title 40; copy "2- and 4-bit quantization of CLIP ViT-B/32 (577 MB FP32 baseline) — PTQ, QAT, GPTQ/AWQ — with a roadmap toward Qwen-VL and LLaVA."; 60px accent circle arrow.
2. **Multimodal AI Agent** — `flex 5 1 340px`, bg sage-800, padding 36; 240px circle image (agent card) with 14px sage ring, top-right; pill "AI / ML · Python" (sage-400); title sage-100; copy "An LLM-driven agent that solves multi-room MiniGrid puzzles — persistent memory map, grid-to-text prompting, stuck detection."
3. **Stream Pipeline Dashboard** — `flex 5 1 340px`, bg accent-900; pill "Real-time · Kafka"; copy "Kafka-processed data streamed to a Next.js dashboard over WebSockets — live query metrics, per-user insights and alerts."; 220px morphing-blob image at bottom.
4. **Petco Website** — `flex 7 1 460px`, surface bg, horizontal; 340px-tall pill-shaped image (radius 999); pill "E-commerce · Next.js / TypeScript"; copy "Built and upgraded PDP, PLP, brand and homepage modules for a high-traffic storefront, with SEO improvements."; link "View project ↗".

### 7. Research (`#writing`) — "On paper"
Stacked pill rows (radius 999, padding 20, surface bg, border @7%); hover bg `color-mix(accent 14%, neutral-900)`, border accent @40%. Row: 84px circle number (01–04, Caprasimo 20 accent-300) · title Caprasimo 23 + "N. Devrani" 15px neutral-400 · topic pill (sage) · 56px outlined arrow circle. Rows reveal from left. Click → DetailsPage.
Papers (from `publications.json`): Project Abstract: VLM on Edge Devices (Edge Computing) · Multimodal Foundation Models (Core AI) · Bias in AI (AI Ethics) · Philosophy in AI (AI Ethics).

### 8. Community (`#community`) — "Off the clock, on purpose"
Sage-900 band with SVG wave edges top & bottom (90px tall, `preserveAspectRatio="none"`), morphing sage-800 blob top-right. Copy: "Rural classrooms and long-distance running — the two things that keep me honest."
Two cards (sage-800, padding 18/18/34):
- `flex 3 1 420px`, radius `72px 72px 72px 18px`, image 320px (`ngo.jpg`), label "NGO · 3 years", title "Rural Education Volunteering", copy: "Assessed learning levels of rural school children and shared the data with government bodies. Stayed with students for days in remote areas — tutoring, easing stage fear, and making room for singing and dancing. Several months each year, three years running."
- `flex 2 1 300px`, radius `18px 72px 72px 72px`, image `marathon.jpg`, label "Hobby", title "Marathon Running", copy: "Pushing limits physically and mentally — the same endurance software asks for. Keep moving forward."

### 9. Contact (`#contact`)
Accent block, radius 80, padding `clamp(40px,7vw,96px)`, two morphing blobs (accent-500, accent-400). Label "06 · Contact" 14/700 accent-900; H2 "Let’s build something thoughtful." neutral-900 max 11ch. Email pill (neutral-900 bg, Caprasimo 20, mail icon, hover scale 1.04) → `mailto:practiclemind@gmail.com`; 64px outlined circles → GitHub `https://github.com/Nitishdevrani`, LinkedIn `https://www.linkedin.com/in/nitishdevrani/`. Footer: "© 2026 Nitish Devrani · Nuremberg" · "Back to top ↑".

### 10. Details page (overlay)
`position: fixed; inset: 0; z-index: 100; overflow-y: auto; overflow-x: clip; overscroll-behavior: contain`, bg neutral-900, blurred accent blob top-right. Lock `body` scroll while open. Enter animation: opacity 0→1, translateY 40px→0, 550ms `cubic-bezier(.2,.7,.2,1)`; reset scrollTop to 0. **Esc** closes. Recommended in the real app: push `#project-<id>` to history and close on `popstate` (the current site already does this — keep it).
- Sticky top bar (same glass pill as nav): "← Back to portfolio" (solid neutral-100 pill, hover accent-300) · section label (Project/Research, 13px uppercase neutral-400) · right "Next: <title> →" (outline pill) cycling within the group.
- Tag pills (accent @18%), H1 title, lead (Caprasimo `clamp(22px,2.4vw,30px)` accent-400, max 34ch).
- Cover: height `clamp(280px,46vw,560px)`, radius `64px 64px 64px 20px`, washed.
- Two columns (`flex 2 1 520px` main / `flex 1 1 300px` sticky aside top:120px):
  - Main: "About this project/paper" (H2 Caprasimo 30) + 18px/1.75 neutral-300 · optional deprecated sage pill · **Key contributions**: pill rows (surface, radius 999) with 52px sage-700 number circle · **Gallery**: grid `repeat(auto-fill, minmax(240px,1fr))`, 4:3, radius 40, hover scale 1.03, opens image in new tab · **Documents**: surface card radius 48, embedded PDF `<iframe>` 720px tall radius 36, filename + "Open PDF ↗" primary button.
  - Aside: sage-900 card radius `48px 48px 48px 16px` with meta rows (label 12px uppercase sage-300 / value Caprasimo 20 sage-100) and Tech-stack pills; below, full-width primary button for external link ("View on GitHub" / "Open live site").
- Each section only renders when data exists.

Detail data used — map from `projects.json` fields (`description` → about, `objective` → lead, `techStack`, `tasks`, `galleryImages`, `papers`, `url`) — plus these meta rows:
- VLM: Field Computer Vision · Baseline CLIP ViT-B/32 · 577 MB FP32 · Zero-shot 86.16% on CIFAR-10; stack Python, PyTorch, CLIP, GPTQ / AWQ; cover `vlm_on_edge_devices/cover-1.png`; doc Project Abstract PDF.
- Agent: Field AI / ML · Environment MiniGrid · Backbone GPT, configurable; stack Python, GPT, Prompt engineering; cover `AI agent/cover-1.png`; gallery `agent_map.png`; doc Multimodal_foundation_models.pdf.
- Stream: Field Real-Time Analytics · Transport Kafka → WebSockets; 3 gallery images; link GitHub.
- Petco: Role Frontend Developer · Period Nov 2023 — Aug 2025; link live site.
- Papers: Topic + Author meta, one PDF each. Leads: VLM "The abstract behind the edge-quantization project — scope, baseline and roadmap." · Multimodal "How foundation models learn from text and images together." · Bias "Where bias enters AI systems, and what it costs." · Philosophy "The philosophical questions underneath intelligent machines."

## Interactions & Motion
- Scroll reveal (IntersectionObserver, threshold 0.12, rootMargin `0 0 -6% 0`, once): initial `opacity 0` + `translateY(60px)` (up) / `translateX(-70px)` (left) / `scale(.9)` (scale); transition opacity .9s + transform 1.2s `cubic-bezier(.2,.7,.2,1)`; optional `data-delay` stagger 80–300ms.
- Keyframes:
  - `morph` border-radius 3-step loop: `58% 42% 55% 45%/48% 58% 42% 52%` → `42% 58% 38% 62%/60% 40% 60% 40%` → `52% 48% 62% 38%/40% 55% 45% 60%`
  - `floaty` translateY 0 → −14px; `drift` translate(40px,−30px) scale(1.12); `marquee` translateX 0 → −50%; `pulse` box-shadow ring 0→10px sage-400 @70%.
- Scroll handler throttled with rAF, sets CSS vars `--hp`, `--xp`, `--sp` on page root.
- **Respect `prefers-reduced-motion`**: disable all keyframes, reveals and parallax.

## State
- `openId: string | null` — which project/paper details are open (plus URL hash sync).
- Derived: `nextId` within group (projects / research).
- No fetching; all from local JSON.

## Assets (in `images/` and `docs/` of this bundle)
- `portrait-hero.jpg` — **new**, user-supplied hero photo → add to `public/images/`.
- Everything else already exists in the repo: `public/images/ai/{marathon,ngo}.jpg`, `public/data/vlm_on_edge_devices/{card,cover-1}.png`, `public/data/AI agent/{card,cover-1,agent_map}.png`, `public/images/projects/stream-pipeline/*`, `public/images/projects/petco-website/cover.png`, `public/data/ai_ethics/*_cover.png`, PDFs under `public/data/...`. Use the repo paths; the bundle copies are renamed only for the prototype.

## Open items
- "Download CV" has no file yet.
- Only 4 projects are featured; Cloud Economics, Smart Bike Light, Adani Sampling, German Univ. Learning Review, Babyflix and 3D Modeling are omitted (user chose not to keep extras).
- Contact email: live site uses `practiclemind@gmail.com`; `background_info.md` lists `nitishdevrani@gmail.com` — confirm.

## Files
- `Portfolio.dc.html` — the full prototype (template + logic; data objects `DETAILS`, `experience`, `pubs` are at the bottom in the script).
- `_ds/organic-…/styles.css` — Organic design-system tokens and `.btn`, `.washed` classes.
- `support.js`, `image-slot.js` — prototype runtime only; **do not port**.
- `images/`, `docs/` — assets used by the prototype.
