# Interactive Storybook Portfolio — Requirements & Implementation Plan

Status: v3 consolidated spec — merges product strategy, architecture, animation,
Three.js, performance, accessibility, responsive, character/illustration, narrative, and
delivery-roadmap deep dives into one authoritative document. Supersedes all prior drafts.

Single fullscreen viewport. No page scroll, ever. A chapter-driven "Stage + Story
Carousel" experience that behaves like a cinematic keynote or short film, not a website.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Hard Constraints](#2-hard-constraints)
3. [Tech Stack](#3-tech-stack)
4. [Layout Architecture](#4-layout-architecture)
5. [Chapters (Story Cards)](#5-chapters-story-cards)
6. [Chapter Narrative Design & Visitor Path Logic](#6-chapter-narrative-design--visitor-path-logic)
7. [Scene Transition Choreography](#7-scene-transition-choreography)
8. [Responsiveness](#8-responsiveness)
9. [Content & Folder Structure](#9-content--folder-structure)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Three.js / R3F Architecture](#11-threejs--r3f-architecture)
12. [Performance Engineering & Runtime Discipline](#12-performance-engineering--runtime-discipline)
13. [Character Illustration](#13-character-illustration)
14. [Accessibility Specification](#14-accessibility-specification)
15. [Open Items / Inputs Needed From You](#15-open-items--inputs-needed-from-you)
16. [Implementation Phases & Delivery Roadmap](#16-implementation-phases--delivery-roadmap)

---

## 1. Product Vision

### 1.1 What this is

Not a website. An animated digital storybook / interactive movie about Omkar's life and
work. One screen, one moment at a time. Selecting a chapter transitions the entire
world — illustration, background, character pose, floating objects, copy — rather than
navigating to a new page or scrolling to a new section.

Visual references: Behance case-study reels, Apple keynote storytelling, Netflix title
selection row, PlayStation game menu, Adobe portfolio showcases, Pixar-style staging.

**Success criteria:** a visitor spends several minutes clicking through chapters purely
because each one reveals a new animated world, and leaves remembering Omkar as a person,
not a stack of technologies.

### 1.2 Positioning statement

For recruiters, collaborators, and creative peers who give a portfolio somewhere between
8 and 20 seconds before deciding whether it's worth more of their time, this site is a
single-screen, chapter-driven interactive storybook that replaces "here is what I built"
with "here is who I am and how I think." Unlike a conventional developer portfolio — a
scrolling stack of About/Skills/Projects/Contact sections that asks the visitor to
self-serve through a resume rendered as a webpage — this site drives the pacing itself,
the way a keynote or a short film does: one world at a time, staged, lit, and resolved
before the next one begins.

The differentiation is structural, not decorative. A generic portfolio *claims* craft in
text ("proficient in React, Three.js, GSAP"); this site *demonstrates* craft by being the
artifact — the cinematic transitions, the illustrated world-per-chapter, the restraint of
showing only one thing at a time, are themselves the engineering and design pitch, stated
without ever stating it.

| Dimension | Generic developer portfolio | This storybook portfolio |
|---|---|---|
| Structure | Scroll-driven sections, visitor sets the pace, skims | Fixed Stage + Carousel; the site sets the pace, one resolved scene at a time |
| Primary artifact on screen | Bullet lists, tech badges, project card grids | An illustrated character moving through built worlds |
| How skill is proven | Asserted in copy | Demonstrated by the medium — the site's own polish is the evidence |
| Emotional register | Neutral, transactional, "resume-online" | Warm, cinematic, specific to one person |
| Primary risk | Low differentiation, high forgettability, low build risk | Higher build/perf risk (animation, 3D, no-scroll UX), far higher recall if executed well |

This is the trade the whole document is built around: more implementation risk
(§7, §8, §14) in exchange for an experience structurally impossible to confuse with the
other 10,000 portfolios a recruiter or client will see this year.

### 1.3 Target audiences & desired outcomes

Four audiences share one URL, one linear carousel, no personalization, no mode-switcher
(that would violate the single-route, single-viewport constraint). The only lever is
*what surfaces first inside each chapter's copy layer* and the Contact chapter's CTA set
(Let's Talk / Resume / GitHub / LinkedIn / Email — §5).

| Audience | Arrives thinking | Should feel by the end | Should do next | Chapters that carry the most weight | Failure mode to design against |
|---|---|---|---|---|---|
| Recruiters / hiring managers | "~90 seconds to decide if this person is worth a screen." Scanning for titles, companies, dates, scope. | "High-caliber, low-risk hire who also has taste." | Experience → Engineering → Projects → Contact (Resume/Let's Talk). | Experience, Engineering, Projects, Contact | Whimsy burying the facts — concrete facts must surface as legible text inside the world, not buried under mood. |
| Potential collaborators / clients | "Can this person execute on *my* problem, and is their taste legit?" | Trust plus excitement. | Read Projects end-to-end (7-beat structure, §5), then Contact. | Projects, Engineering, GitHub, Contact | Style with no substance — no visible outcomes/metrics reads as facade. |
| Friends & family | Already have relational context; curious, not evaluating professionally. | Emotionally moved: "this really is him." | Linger in Life / Gallery / Writing / Journey. | Life, Gallery, Writing, Journey | 100% resume-coded tone with zero warmth loses this audience in one chapter. |
| Fellow designers / engineers | Most technically discerning — inspects motion quality, frame timing, layout stability. | Respect: "genuinely well executed." | Traverse most/all 11 chapters, check GitHub/Engineering, share the link. | GitHub, Engineering, effectively all | Jank, layout shift, or a missing `prefers-reduced-motion` path reads as "all sizzle" faster than for any other audience. |

Chapter copy must be **legible at two depths simultaneously**: a scannable factual layer
(title/company/dates, project outcome, one-line thesis) and an atmospheric/narrative
layer (illustrated world, pose, ambient copy). No chapter should force a choice between
the two.

### 1.4 Success metrics

Static export, no backend (§2) → instrumentation is a client-side, privacy-respecting
analytics snippet (e.g. Vercel Analytics or Plausible), a third-party-hosted script tag,
not an API route/database/auth of our own. **Proposed, not yet confirmed** — flag
alongside §15 Open Items for sign-off before adding any script tag to `app/layout.tsx`.

| Metric | Definition | Target | Stretch | Why it matters |
|---|---|---|---|---|
| Median session duration | Mount → tab-close/nav-away | ≥ 90s | ≥ 180s | Typical scrolling-portfolio median dwell is ~30–45s; clearing 90s signals the format holds attention. |
| Chapters visited per session | Unique `chapterId` with a `chapter_view` event | ≥ 4 of 11 | ≥ 7 of 11 | Tests the core hypothesis directly. "Engaged session" = ≥4 chapters AND ≥60s dwell. |
| Contact reach rate | % of sessions firing `chapter_view` for `contact` | ≥ 30% | ≥ 45% | Proxy for near-full traversal, since Contact is the fixed last card. |
| Contact CTA click-through | % of sessions that reached Contact and clicked any CTA | ≥ 25% | ≥ 35% | Signals the story moved someone enough to reach back, not just to watch. |
| First-15-second survival rate | % of sessions still active at 15s | ≥ 75% | ≥ 85% | Measures whether the Welcome hook (§1.5) does its job. |
| `prefers-reduced-motion` adoption | % of sessions with the media query active | Watch only | — | Informs whether the reduced-motion fallback (§14.1) needs more design attention. |

**Guardrail metric (do not optimize against it):** time-to-first-interaction must never
be artificially inflated by making the Welcome hook unskippable. A click at second 1 wins
immediately — the in-flight Welcome timeline is redirected into the chapter transition,
never queued behind it. A storybook that blocks input to finish its own intro is a
loading screen wearing a costume.

### 1.5 The first 15 seconds — anti-bounce hook design

The Welcome chapter is the only chapter whose success is measured in milliseconds. It has
one job: survive to first interaction without ever looking like it's loading. No
spinner, no progress bar, no "click to enter" gate. A fixed six-phase timeline, built
from GSAP tweens (background/ambient layers) and Framer Motion variants (character, copy,
carousel), sharing one easing vocabulary exported once from `lib/transitions.ts`
(`EASE_REVEAL`, `EASE_TEXT`, `SPRING_CHARACTER`, `SPRING_CAROUSEL`) so every later chapter
reuses the same signature motion language.

| Phase | Window | What happens | Motion spec | Component(s) |
|---|---|---|---|---|
| 0 — Pre-paint guard | 0–150ms | No FOUC: base background matches the darkest dawn-gradient stop; self-hosted variable font, `font-display: optional`, metrics-matched fallback so the title never reflows late. | n/a (SSR-resolved first frame) | `app/layout.tsx`, font config |
| 1 — Something is alive | 0.15–1.2s | Dawn sky gradient shifts; 3–6 low-opacity particles drift in, staggered. Nothing on screen is static past 300ms. | GSAP tween, `EASE_REVEAL = cubic-bezier(0.16,1,0.3,1)`, 1.0s. Particles: Framer `staggerChildren: 0.06`, opacity 0→0.4. | `StageBackground.tsx`, `FloatingObjects.tsx` |
| 2 — Character arrival | 1.2–3.2s | Character rises/fades into idle pose (`translateY: 24→0`, opacity 0→1) — the emotional anchor, answering "who is this" inside two seconds. | Framer `SPRING_CHARACTER = {stiffness:120, damping:18, mass:1}` | `Character.tsx` |
| 3 — Title & voice | 3.2–6.5s | Title resolves via masked/char-stagger reveal; one subline ~400ms later. Hard cap: one line + one subline, never a paragraph. | `EASE_TEXT = cubic-bezier(0.22,1,0.36,1)`, per-char stagger 0.02s, ~800ms total. | `ChapterContent.tsx` |
| 4 — Reveal the game | 6.5–9.5s | Story Carousel, held off-position at load, slides up into its ~15vh dock. | `SPRING_CAROUSEL = {stiffness:100, damping:20, mass:1.1}`. Transform-only (`translateY`), never a height animation — protects CLS. | `StoryCarousel.tsx` |
| 5 — Invitation to act | 9.5–13s | Next `StoryCard` gets one subtle affordance pulse (scale 1→1.03→1, single loop, never infinite). No "click to explore!" copy — show, don't instruct. | One-shot ease, no infinite repeat. | `StoryCard.tsx` |
| 6 — Ambient rest state | 13s+ | Entrance animation completes; scene settles into a permanent idle loop (particle drift, breathing/blink, ≤8px mouse-parallax) that never fully stops except under reduced motion. | Continuous, low-amplitude, GPU-transform-only. | `StageBackground.tsx`, `Character.tsx` |

**Interruptibility is non-negotiable.** Every phase is cancellable mid-flight: a click on
any carousel card at second 1 makes the chapter-transition state machine (§7,
`useChapterTransition.ts`) win immediately over the in-flight Welcome timeline.

**Reduced motion.** Phases 1–4 collapse into a single ~300ms cross-fade directly to the
fully-resolved Welcome state (§14.1): carousel already docked, character already idle, no
particle drift, no parallax. The six-phase choreography is an enhancement layer on top of
an already-correct static end-state, never the only path to a usable page.

**Performance budget guarding the hook** (see also §12):
- **LCP** < 1.8s desktop / < 2.8s throttled mobile (Fast 3G), tested on a mid-tier device
  (iPhone SE 2nd-gen / Moto G Power).
- **CLS** < 0.05 — Phase 4's carousel arrival is a transform, never a layout change.
- **TBT** < 200ms; Welcome's critical-path JS (excluding R3F/GSAP chapter chunks) budgeted
  under ~180KB gzipped.
- **Bundle isolation**: Welcome is pure DOM/SVG/Framer Motion and must not import
  Three.js/R3F at all. The four 3D-chapter modules (§11) are dynamically imported and
  fetched only once their `StoryCard` is selected.

---

## 2. Hard Constraints

These are immutable. Nothing elsewhere in this document may soften or contradict them.

- **Single fullscreen viewport. No document/page scroll anywhere, ever** —
  `overflow: hidden` on `html, body`, `height: 100dvh` (with a `100vh`/`--vh` fallback for
  older Safari), no scroll-snap sections.
- **No navbar, no logo, no footer, no sidebar, no multi-page routing.** One route (`/`)
  only; everything is client-side state.
- **Exactly two visual regions, always:**
  1. **Stage** — ~85% of viewport height. All cinematic content.
  2. **Story Carousel** — ~15% of viewport height, pinned to the bottom.
- **Fully static site.** No backend, no CMS, no database, no auth, no API routes. All
  content lives in typed `/content/*.ts` files.
- **Tech stack is fixed**: Next.js 15 (App Router, static export), React 19, TypeScript,
  Tailwind CSS, Framer Motion, GSAP, Three.js via React Three Fiber + Drei. Lenis/
  smooth-scroll is explicitly dropped — there is no scroll to smooth.
- **11 chapters, fixed order**: Welcome, Journey, Experience, Projects, Engineering,
  GitHub, Writing, Learning, Life, Gallery, Contact.
- The site must feel like a **premium, award-winning, cinematic personal storybook** —
  not a generic developer portfolio, not a dashboard, not boxed/card-grid UI for the
  Stage itself (the Carousel cards are the one intentional exception).
- The goal is emotional: **visitors should remember Omkar as a person, not a tech stack.**

---

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js, App Router, static export (`output: 'export'`) |
| UI | React 19, TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Chapter/scene transitions, UI motion | Framer Motion |
| Timeline-based / scrubbed animation (camera moves, character pose morphs, stage choreography) | GSAP (ScrollTrigger unused — no scroll exists; GSAP timelines drive stage choreography instead) |
| 3D scenes (selected chapters only) | Three.js via React Three Fiber + Drei |
| Illustrations | Hand-coded SVG (custom, no external asset dependency, no GLTF/model downloads) |
| State management | Zustand (single store — see §10.2; not part of the originally-fixed table, resolved as an open slot) |
| Smooth scroll | Not used — no document scroll exists. Lenis is dropped from this concept entirely. |

There is no server at runtime: `next.config.ts` sets `output: 'export'` and
`images: { unoptimized: true }` (no image-optimization API exists in static export).
There are no server actions, no route handlers, no middleware, no `revalidate` — the
Contact chapter's CTAs are `mailto:`/`tel:`/static links only, never a form POST, which
satisfies the "no backend" constraint by construction rather than by discipline.

---

## 4. Layout Architecture

```
┌───────────────────────────────────────────────────────────┐
│                                                             │
│                        STAGE (~85vh)                       │
│   - Background layer (gradient / 3D canvas / illustration) │
│   - Midground: floating objects, particles, motion graphics│
│   - Foreground: character illustration (pose per chapter)  │
│   - Content layer: chapter title, story copy, Stage markers│
│   - Chapter-specific overlays (video, interactive props)   │
│                                                             │
├───────────────────────────────────────────────────────────┤
│              STORY CAROUSEL (~15vh, pinned bottom)         │
│   [👋 Welcome] [🎓 Journey] [💼 Experience] [🚀 Projects]  │
│   [💻 Engineering] [🐙 GitHub] [📝 Writing] [📚 Learning]  │
│   [❤️ Life] [📷 Gallery] [🤝 Contact]                       │
│   - Horizontally scrollable/draggable row of story cards   │
│   - Active card raised/highlighted, others recede          │
└───────────────────────────────────────────────────────────┘
```

Both regions are fixed-position, viewport-locked (`position: fixed; inset: 0`), split via
a CSS grid whose row template is `grid-template-rows: minmax(0, 1fr) var(--carousel-h)` —
a flexible Stage remainder plus a Carousel height clamped between a floor and ceiling
(`--carousel-h` resolves per width bucket, e.g. `clamp(112px, 15dvh, 160px)` at
`tablet-landscape`/`laptop-sm`; see §8.1 for the full per-breakpoint clamp values, which
step the Stage:Carousel ratio from roughly 76:24 up to 85:15 as viewport **width**
increases — width, not height, drives the ratio; §8.2's height-triggered overrides for
short/landscape viewports apply on top of this, independent of width). The grid's row
template — not any child's box model — is the single source of truth for the Stage:
Carousel ratio at every breakpoint, so no chapter can accidentally grow the Stage into a
scrollable state.

```css
:root { --carousel-h: clamp(112px, 15dvh, 160px); }
.storybook-shell {
  height: 100dvh;               /* --vh fallback for browsers without dvh, §8.1 */
  display: grid;
  grid-template-rows: minmax(0, 1fr) var(--carousel-h);
  overflow: hidden;             /* belt-and-suspenders against any scroll */
}
```

The Carousel drag surface is the one deliberate exception to "no scroll" — it is a
horizontal, non-document drag/swipe strip (§7, §8.3), never a vertical scroll of any kind.

**Stage markers, defined once here** (referenced throughout §7, §8, §14): small, diegetic,
per-chapter informational surfaces that surface a short piece of information without
leaving the illustrated scene — e.g. Journey's roadside milestone signpost, Engineering's
tool caption plate, GitHub's terminal readout line, Learning's orb label. Each renders
using its own chapter's in-world material (paper label, brass plaque, terminal glyph,
hand-lettering per §6.2's world description) — **never a shared rectangular card/box
component**, and never styled to visually resemble the Carousel's cards, the one
sanctioned card-grid exception (§2/§5). Where markers share a spring-physics *number*
with other Stage elements (§7.4), that is only for a unified sense of physical motion —
never a shared visual form. This term replaces the ad hoc "widget"/"badge" vocabulary
used in earlier drafts, which read as generic dashboard UI the hard constraints forbid.

---

## 5. Chapters (Story Cards)

Each chapter is one "world." Card in the Carousel + full Stage definition. Order is fixed
and matches `CHAPTER_ORDER` in `content/chapters.ts` (§9, §10.5) — every prefetch,
direction, and camera-adjacency computation derives from this single array's index, never
a hardcoded number.

| Card | Stage world | Notes |
|---|---|---|
| 👋 Welcome | Opening scene — soft dawn light, character idle pose, title card intro | Default/first chapter on load; the anti-bounce hook, §1.5 |
| 🎓 Journey | Career walked as a path/road — camera pans across life milestones | Timeline-as-environment, not a list |
| 💼 Experience | Warm office/studio environment, roles as "rooms" you step into | |
| 🚀 Projects | "Software lab" — glowing terminals/consoles, projects as experiments on benches | Each project = problem → idea → journey → challenge → solution → outcome → lesson, told in-scene |
| 💻 Engineering | Technical workshop — tools on the wall, craftsmanship framing (not skill bars) | |
| 🐙 GitHub | Stylized developer workspace — terminal/editor scene, activity as ambient motion | Static, build-time-curated snapshot — never a live API call (§15) |
| 📝 Writing | Creative studio — desk, papers, handwritten notes floating | |
| 📚 Learning | Futuristic knowledge room — concept-orbs drifting in space | |
| ❤️ Life | Warm personal environment — home, people, things loved | |
| 📷 Gallery | Wall/table of photos, cinematic lightbox interactions | |
| 🤝 Contact | Final cinematic ending — night sky, character looking outward, CTAs (Let's Talk / Resume / GitHub / LinkedIn / Email) | Last card, deliberate "credits roll" feeling; loops back rather than dead-ending (§6.3) |

Render mode per chapter (DOM/SVG/Framer vs. R3F canvas) is decided in §11.1; only 4 of 11
chapters (Projects, GitHub, Learning, Contact) earn a WebGL canvas.

---

## 6. Chapter Narrative Design & Visitor Path Logic

*Extends §5 with the actual narrative beats, per-world color science, and the rules that
keep the experience coherent whether a visitor walks the story in order or clicks around.
Nothing here changes the fixed 11-chapter order, the 85/15 layout, or the transition
budget in §7 — it fills them in.*

### 6.1 Three-act structure

Eleven chapters read as three acts — the backbone of the palette design and the
coherence logic in §6.3.

| Act | Chapters | Palette family | Emotional throughline |
|---|---|---|---|
| I — Becoming | Welcome, Journey, Experience | Warm, rising light (dawn → ochre → lamp-lit wood) | Where he came from, how he grew, who gave him a seat at the table |
| II — Craft | Projects, Engineering, GitHub, Writing, Learning | Oscillates cool/warm per chapter (lab cyan → workshop amber → terminal near-black → studio sepia → space indigo) | How he thinks, builds, ships, reflects, keeps growing — deliberately the densest act, given the most tonal variety so it never reads as one long "skills" slog |
| III — Heart | Life, Gallery, Contact | Warm, intimate, then infinite (gold → gallery neutral → night navy) | Who he is outside the work, what he's kept, an open hand extended to the visitor |

Act II alternates warm/cool every chapter on purpose: five chapters of the same palette
would flatten into wallpaper. Alternation gives the Stage a pulse, the way a film
alternates interior/exterior or day/night to keep pacing alive.

### 6.2 Per-chapter design

Each chapter is specified as: **Opening Hook** (first ~600ms after Enter resolves),
**Signature Interactive Moment** (the one thing worth touching — singular, not a
checklist), **Closing Transition Cue** (the authored bridge, played during the
exit/camera phases of §7), **Emotional Tone & Palette**, and **Ambiance Note** (sound
design authored now, shipped silent in v1 — §6.4 risk #4).

**1. Welcome — the invitation**
- *Opening hook:* Character stands mid-frame in a soft dawn gradient, eyes closed, idle
  breathing. A hand-lettered title resolves stroke-by-stroke (~800ms, SVG
  `stroke-dashoffset`, `ease:[0.22,1,0.36,1]`), then the character's eyes open toward the
  visitor.
- *Signature interactive moment:* Pointer/touch position pulls a small field of light
  motes (10–14 particles, ~120ms lag) toward the cursor — the world responds to being
  watched, no click required. Establishes that the whole site reacts without instruction.
- *Closing transition cue:* Character raises a hand and steps off-frame; the light rays
  they stood in elongate into a receding dirt road — a literal match-cut, the same SVG
  paths reused as Journey's road (`power2.inOut`, 550ms).
- *Tone & palette:* Hopeful, quiet, unhurried. `#FFE8D6 → #F7CFA0`, accent coral
  `#FF8C69`, ink `#2B2118`.
- *Ambiance:* Soft chime on title resolve; low warm pad; one distant bird call; silence
  otherwise.

**2. Journey — becoming**
- *Opening hook:* Aerial/oblique camera down a winding road receding to a horizon;
  glowing waypoint markers at bends, labeled with years.
- *Signature interactive moment:* Horizontal drag/swipe scrubs a paused GSAP timeline
  moving the camera along the road (same gesture as the Carousel swipe on mobile, §8.3 —
  no gesture conflict). Passing a waypoint unfolds a milestone card *out of the roadside
  signpost itself*, never a floating modal.
- *Closing transition cue:* Road terminates at warm double doors (rendered small in the
  distance throughout, so nothing new loads at transition time). Camera push
  (`power2.inOut`, 500ms) carries the visitor through — also Experience's Enter phase.
- *Tone & palette:* Determined, wistful. Sky `#3A3A5C → #6C5B7B`, road ochre `#C97B3D`,
  waypoint glow `#FFD27A`.
- *Ambiance:* Footsteps, wind, a rising chime per waypoint; city hum fades in gradually.

**3. Experience — rooms he stepped into**
- *Opening hook:* A corridor of doors labeled with company/role, warm light beneath each.
- *Signature interactive moment:* Clicking a door doesn't navigate — it swings open in
  place (`rotateY`, `back.out(1.4)`, 350ms), revealing a shallow diorama of that role. Only
  one door open at a time; opening a new one closes the previous with the same swing
  reversed.
- *Closing transition cue:* The last door reveals a workbench lit by cold blue light; the
  character steps through. Camera push, 500ms, `power2.inOut`.
- *Tone & palette:* Grounded, warm-but-earned. Walnut `#5C4033 → #7A5C43`, lamp glow
  `#F2B25C`, muted teal door frames `#3E6E67`.
- *Ambiance:* Office hum, distant keyboard clatter, wooden creak on door-open, murmured
  conversation below intelligibility (texture, never actual words).

**4. Projects — the lab**
- *Opening hook:* Camera glides low between workbenches; each holds a glowing project
  rendered as a holographic schematic, not a screenshot.
- *Signature interactive moment:* Clicking a bench artifact triggers the seven-beat story
  reveal (problem → idea → journey → challenge → solution → outcome → lesson) as an
  in-scene, self-turning notebook — never a card stack/modal. ~1.8s per beat,
  `expo.inOut` crossfade; click-through or auto-advance.
- *Closing transition cue:* A rack-focus/pull-back rather than a portal cut — Engineering's
  pegboard wall has been softly out-of-focus in the background throughout; the cue widens
  the frame and racks focus onto it (`power1.inOut`, 450ms; no new geometry mounts).
- *Tone & palette:* Focused, electric, proud. Navy `#0B1E33 → #142B44`, neon cyan
  `#4FD8EA`, neon green readouts `#7CFFB2`, magenta reserved for the "outcome" beat only,
  `#FF5EAE`.
- *Ambiance:* Server hum, synth blips per beat, a "compile success" tone at "lesson."

**5. Engineering — the workshop**
- *Opening hook:* Pegboard wall; tools hang where skill badges would go — soldering iron,
  wrench, mechanical keyboard, compass.
- *Signature interactive moment:* Hovering a tool lifts it off its peg (8px translate,
  spring `{stiffness:300, damping:22}`); clicking spins it toward camera, reveals a
  craftsmanship note, then returns it. Tactile, not a progress bar.
- *Closing transition cue:* The keyboard tool, clicked last, dims the workshop around it
  and resolves — same silhouette, same click sound — into a glowing terminal keyboard on
  a desk. A true match-cut on shape.
- *Tone & palette:* Deliberate, hands-on. Warm wood `#4A2E1E`, brass `#C08A4E`, spark
  orange `#FF7A3D` on hover.
- *Ambiance:* Metallic clinks, low workshop drone, brief power-tool whir on hover-lift.

**6. GitHub — transparency, ambient**
- *Opening hook:* Dual-monitor glow in a dark room; a contribution graph rendered as a
  constellation, density = activity.
- *Signature interactive moment:* Dragging scrubs through years; dense clusters brighten
  as the visitor passes; clicking a bright cluster surfaces a highlighted repo in a
  floating terminal that types itself out in-world — no modal. Data is a static,
  build-time-curated snapshot (§15) — no live API calls.
- *Closing transition cue:* A "build succeeded" flash; the terminal's green glow warms and
  the monitor bezel dissolves into a wooden desk edge, resolving into Writing. Terminal
  cursor blink slows into a handwriting cursor.
- *Tone & palette:* Precise, alive. Near-black `#0D1117` (deliberate nod to GitHub's own
  dark theme), neon green `#39D353` (GitHub's actual contribution-graph green — the one
  intentional brand echo on the site), electric violet `#8957E5`.
- *Ambiance:* Mechanical keyboard clacks, soft data-blip tones, a low synth drone — a
  workspace at 2am, not a dashboard.

**7. Writing — voice**
- *Opening hook:* Desk lamp's warm pool of light; loose pages drift as if in a draft, pen
  resting on an open notebook.
- *Signature interactive moment:* Dragging a floating page toward camera unfolds it (three
  fold segments, 120ms each, `power3.out`) into a readable excerpt; releasing lets it
  float back.
- *Closing transition cue:* A gust catches one page; it folds itself (same fold geometry
  reused) and lifts into the dark above the desk, scattering into pinpricks of light — the
  opening image of Learning. **This fold motif is the basis for the universal fallback
  transition in §6.3** — even the "utility" transition inherits hand-authored language.
- *Tone & palette:* Reflective, unguarded. Sepia cream `#F3E6D0`, deep brown ink
  `#3B2A1E`, amber lamp `#E8A855`.
- *Ambiance:* Paper rustle, pen-scratch, soft rain-on-window, page-turn foley per unfold.

**8. Learning — curiosity**
- *Opening hook:* Dark starfield room; glowing orbs (topics learned) orbit slowly, sized/
  brightened by depth of interest, not a skill percentage.
- *Signature interactive moment:* Dragging an orb toward camera cracks it open
  (`back.out(1.7)`, 250ms) revealing a label + one-line "why this, right now" note, then
  drifts back; unselected orbits subtly slow near the pointer — a physical parallax, not a
  hover state.
- *Closing transition cue:* The brightest orb (most recently learned topic) pulls to
  camera and overexposes the frame in a warm whiteout flash (~200ms hold — a documented
  exception to the transition budget, §6.4 risk #2) resolving into Life's golden hour.
- *Tone & palette:* Curious, expansive. Deep indigo `#150F30 → #2A1E5C`, glowing orbs
  `#BFEFFF`/white, faint nebula magenta `#6C3AA0`.
- *Ambiance:* Cosmic pad/drone, gentle chime per orb, a faint slow heartbeat pulse.

**9. Life — heart**
- *Opening hook:* Golden-hour porch/living-room scene; character relaxed, a handful of
  loved objects nearby (mug, plant, an instrument).
- *Signature interactive moment:* Hovering/clicking a personal object triggers a small,
  purely delightful vignette (steam curls, a string plucked) — deliberately
  information-free, signaling "texture of a life," not more bullet points.
- *Closing transition cue:* The character picks up a camera among the objects; the frame
  cross-fades into its viewfinder overlay, a shutter click and white flash
  (`power1.out`, 250ms) resolving into Gallery's photo wall — the camera is diegetic, not
  UI chrome.
- *Tone & palette:* Warm, content. Gold/rose `#F6B563 → #E88D5A`, muted sage `#7C8B6B`,
  dusky rose `#D98C82`.
- *Ambiance:* Crickets/evening ambience, soft acoustic guitar pluck, shutter click doubles
  as the transition SFX.

**10. Gallery — memory**
- *Opening hook:* Camera drifts along a photo wall/table spread, dust-in-light parallax.
- *Signature interactive moment:* Clicking a photo lifts it into a full-bleed cinematic
  lightbox with a slow Ken Burns pan/zoom; swipe/arrow moves next; closing animates the
  photo back to its exact wall position, never a plain modal dismiss.
- *Closing transition cue:* On the last photo viewed, every other gallery light dims to
  near-black except that photo's warm spotlight; camera pulls back through an implied
  doorway, and that spotlight is revealed to have *been* a star all along — joining
  Contact's night sky.
- *Tone & palette:* Nostalgic, hushed. Gallery whites/warm spot-lit wood `#EDE7DD` /
  `#8A6B4E`, deep shadow `#1E1B18`.
- *Ambiance:* Quiet shutter clicks, soft footsteps on wood, room-tone reverb, no music.

**11. Contact — the open hand**
- *Opening hook:* Character on a rooftop/hilltop under a full starfield; camera continues
  Gallery's pull-back — the widest shot in the whole experience.
- *Signature interactive moment:* Hovering near star clusters draws faint connecting lines
  (`pathLength` animation) until they resolve into constellation-icons for the fixed
  five-item CTA set defined in §5/§10.5 — **Let's Talk / Resume / GitHub / LinkedIn /
  Email**, in that order; clicking fires the real action (mailto, external link, or the
  Let's Talk contact link) with a starburst confirmation.
- *Closing transition cue:* None forward — the deliberate terminal chapter. Instead, a
  **loop cue**: stars twinkle on a slow randomized cycle indefinitely; the only way
  "onward" is clicking any Carousel card again, closing the loop rather than dead-ending.
- *Tone & palette:* Intimate against vastness — a small warm figure, an infinite cool
  backdrop, deliberately unresolved tension. Night sky `#060B1A → #0A1230`, silver stars
  `#E7ECF5`, warm rim-light on the character `#F2C879`.
- *Ambiance:* Night wind, distant soft synth pad, twinkling chime per constellation
  connected, and — quietest of all — a faint breath/heartbeat texture, meant to be the one
  moment the experience feels like it's holding still with the visitor.

### 6.3 Transition authoring rules & visitor path logic

**Bespoke vs. fallback transitions.** Ten bespoke, hand-authored match-cuts exist — one
per adjacent pair in the fixed order (Welcome→Journey, … Gallery→Contact), specified above
and built as its own GSAP timeline living alongside its chapter's scene component. Each is
authored once and is **reversible** (`timeline.reverse()`), so a backward adjacent move
replays the same timeline in reverse — 10 timelines total, not 20, and nowhere near the 55
pairs a fully bespoke any-to-any system would require.

**Fallback — the Page-Turn Fold.** Any non-adjacent jump (`|source index − dest index| >
1`) uses one shared transition, borrowing Writing's in-world fold motif so it never reads
as a generic fallback:

| Property | Spec |
|---|---|
| Duration | 550–700ms (shorter than the bespoke 900ms–1.3s budget — a jump should feel quicker/more utilitarian) |
| Mechanism | Stage scales to 96% and fades while a diagonal light-leak/paper-grain overlay sweeps via animated `clip-path` polygon keyframes, `cubic-bezier(0.4,0,0.2,1)` |
| Directionality | Left-to-right for a forward jump, right-to-left for backward |
| Mid-point beat | Destination chapter's title flashes centered ~350ms before the world settles — a lightweight "chapter card" so a jump never feels like an error |

**Visitor path logic.**
- *Default first-time visitor:* fresh session (no `storybook:lastChapterId` in
  `localStorage`) → Welcome always plays its full authored intro (§1.5). Nothing
  auto-advances — the site never plays chapters unattended. Once a bespoke closing cue
  settles, the next Carousel card gets a subtle idle nudge (opacity pulse 0.6↔1, 2s cycle)
  for ~4s or until interacted with — the only "encouragement" toward linear order.
- *Returning visitor:* `storybook:lastChapterId` and a `storybook:visitedChapters` set
  persist in `localStorage` (no backend, no cookies, no auth — §2). Stage mounts directly
  into the last-viewed chapter's *resting* frame (not its authored intro) with a plain
  400ms fade.
- *Out-of-order / direct-jump visitor:* Page-Turn Fold for non-adjacent jumps, reversed
  bespoke cut for adjacent ones. Coherence across arbitrary jumps is carried by four
  persistent devices rather than 55 unique transitions: (1) the same illustrated character
  re-posed in every chapter (§13); (2) act-family palettes (§6.1) so even a wild jump lands
  on two compatible emotional registers; (3) visited-state indicators on Carousel cards
  (a filled ring, not a progress bar — a progress bar would read as dashboard UI); (4) the
  shared paper-grain/light-leak texture in the Page-Turn Fold, borrowed from Writing.

### 6.4 Risk call-outs

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| 1 | Authoring N-choose-2 (55) bespoke transitions isn't viable for a small team | Scope blowout, inconsistent quality | 10 reversible bespoke cuts + 1 shared fallback — hard-capped authoring surface |
| 2 | Learning's whiteout-flash and Contact's extended pull-back slightly exceed the 900ms–1.3s budget (§7) | Could read as unbudgeted if not called out | Documented, deliberate exception (+150–200ms max) for exactly these two beats; no other chapter may exceed budget |
| 3 | Adjacent R3F chapters (Projects, GitHub, Learning, Contact) could briefly double-mount a canvas during crossfade | Jank/GPU spike on mid-tier devices; the combined draw-call count briefly exceeds §11.3's ≤80 steady-state ceiling (worst case 105, Projects→Learning) | Delay-unmount the outgoing canvas ~150ms after the incoming one reports first frame ready (see also §11.5); this is §11.3's explicitly documented, capped ≤110-draw-call/≤150ms transient exception, not an unbudgeted overshoot — reconciled there, not merely tolerated here |
| 4 | Ambiance notes describe sound design shipped silent in v1 | Scope-creep risk if "just add audio" is treated as trivial | No playback UI in scope now; if audio ships later it must default-muted and any persistent control reviewed against the no-navbar/no-chrome constraint first |
| 5 | Reduced-motion users hit Journey's scrub-camera and Contact's pull-back hardest | Could feel broken if merely slowed | Skip the camera-move phase entirely for these two under reduced motion, replacing with a single 200ms cross-fade; Journey's drag-scrub degrades to click-to-jump between waypoints |

---

## 7. Scene Transition Choreography

On card click, one orchestrated sequence takes the Stage from world A to world B:
**Exit** (~260–380ms) → **Camera move** (~520ms, overlapping exit) → **Enter**
(~420–560ms, overlapping camera). Total budget stays inside **900ms–1.3s**, hard-capped
at **1300ms** (§7.7) — nothing should ever feel like a page load, and nothing should ever
feel rushed either.

### 7.1 Ownership model — who animates what

Two motion libraries touch the Stage simultaneously. To avoid both engines fighting over
the same element's `transform` on the same frame, ownership is split cleanly and never
dual-driven:

| Layer | Owned by | Why |
|---|---|---|
| Camera rig / parallax layers | **GSAP** timeline | Frame-accurate, label-based sequencing against exit/enter; the R3F camera lerp is a GSAP tween target regardless. |
| Character pose morph | **GSAP** timeline | Must land in lockstep with the background resolving — it's part of the world, not a UI element. |
| Floating objects entrance | **GSAP** (entrance) → hands off to a standalone loop for idle breathing once settled (§7.6) | Entrance is stagger-synced to the timeline; at rest, a continuous loop is cheaper than staying timeline-owned forever. |
| Story cards, Stage markers (§4) | **Framer Motion** variants | Discrete UI elements with enumerable states (idle/hover/active/dragging) fit Framer's variant model better than timeline scrubbing. |
| Chapter copy | **Framer Motion**, triggered by a GSAP label callback, not `AnimatePresence`'s own exit/enter heuristics | Keeps copy frame-locked to the timeline while still using Framer's declarative variants for the tween. |

**Correction to avoid a common trap:** `AnimatePresence mode="wait"` holds the entering
element unmounted until the exiting one fully finishes — producing exactly the blank-gap
problem this spec explicitly avoids. Use Framer's default (`mode="sync"`, i.e. omit
`mode`) only for leaf UI that doesn't need frame-sync with GSAP. For everything that must
be frame-locked (character, floating objects, chapter copy), both outgoing and incoming
scene nodes are kept mounted simultaneously in two slots owned by
`useChapterTransition.ts`, and GSAP timeline labels call `controls.start('exit'|'enter')`
(via `useAnimationControls`) directly. GSAP is the single authority on *when*; Framer
variants are the authority on *what a state looks like*.

### 7.2 Timing & easing reference

Canonical curves, defined once in `lib/transitions.ts`, consumed by both engines (Framer
accepts a raw `[x1,y1,x2,y2]` array; GSAP has no raw cubic-bezier ease, so the same four
numbers are registered once as `CustomEase` paths at module init):

| Name | Cubic-bezier | Feel | Used for |
|---|---|---|---|
| `exit` | `cubic-bezier(0.4,0,1,1)` | Accelerating out | Outgoing copy, character exit pose, outgoing Stage markers |
| `exitObjects` | `cubic-bezier(0.55,0,1,0.45)` | Sharper accelerate | Outgoing floating objects |
| `camera` | `cubic-bezier(0.83,0,0.17,1)` | Slow–fast–slow, cinematic dolly | Camera rig lerp, parallax push |
| `enter` | `cubic-bezier(0.16,1,0.3,1)` | Fast-in, soft settle (expo-out) | Background reveal, character morph-in |
| `enterObjects` | `cubic-bezier(0.34,1.56,0.64,1)` | Back-out, gentle overshoot | Floating objects settling |
| `copy` | `cubic-bezier(0.22,1,0.36,1)` | Quint-out, crisp editorial feel | Chapter title/body reveal |

**Full sequence timing** (t=0 at click; typical chapter):

| t (ms) | Track | Event | Duration | Ease |
|---|---|---|---|---|
| 0 | `ChapterContent` (out) | fade + slide out (−16px) | 260ms | `exit` |
| 0 | `Character` (out) | exit pose (fade, +12px, scale 0.96) | 380ms | `exit` |
| 0 | `FloatingObjects` (out) | drift-off, staggered 40ms apart, random order | 260ms ea. | `exitObjects` |
| 0 | Stage markers (out) | scale 0.94 + fade | 200ms | `exit` |
| 0 | Ambient video/audio | crossfade out | 200ms | `power1.out` |
| 180 | Camera rig / parallax | dolly + layer push to next chapter's framing | 520ms | `camera` |
| 620 | `StageBackground` (in) | resolve/reveal | 560ms | `enter` |
| 660 | `Character` (in) | morph to new pose | 480ms | `enter` |
| 700 | `FloatingObjects` (in) | staggered settle (§7.4 formula) | 380–460ms ea. | `enterObjects` |
| 760 | `ChapterContent` title | fade + rise | 320ms | `copy` |
| 800 | `ChapterContent` body | per-line stagger, 30ms apart | 280ms ea. | `copy` |
| 860 | Stage markers (in) | staggered spring-in (§7.4 formula) | spring | — |
| ~1000–1140 | Idle breathing (all) | loops resume | continuous | `sine.inOut` |

Typical chapter finishes ≈1150ms end-to-end; a marker/object-heavy chapter (Projects,
Learning, GitHub — up to 8 objects + 5 Stage markers) extends to ≈1290ms. Both sit inside
900ms–1.3s; 1300ms is a hard ceiling enforced in code (§7.7), not just a target.

### 7.3 GSAP timeline structure (reference implementation)

```ts
// lib/transitions.ts
export function buildChapterTransition({
  fromRefs, toRefs, cameraRig, toChapter, reducedMotion,
}: TransitionArgs): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

  if (reducedMotion) {
    tl.to(fromRefs.root, { opacity: 0, duration: 0.18, ease: 'power1.out' })
      .set(fromRefs.root, { visibility: 'hidden' })
      .set(toRefs.root, { visibility: 'visible', opacity: 0 })
      .to(toRefs.root, { opacity: 1, duration: 0.18, ease: 'power1.in' })
      .call(() => setStageAtRest(toChapter.id));
    return tl;
  }

  tl.addLabel('exit', 0)
    .to(fromRefs.chapterContent, { autoAlpha: 0, y: -16, duration: 0.26, ease: 'story-exit' }, 'exit')
    .to(fromRefs.character, { autoAlpha: 0, y: 12, scale: 0.96, duration: 0.38, ease: 'story-exit' }, 'exit')
    .to(fromRefs.floatingObjects, {
      autoAlpha: 0, y: '-=10', duration: 0.26, ease: 'story-exitObjects',
      stagger: { each: 0.04, from: 'random' },
    }, 'exit')
    .to(fromRefs.markers, { autoAlpha: 0, scale: 0.94, duration: 0.2, ease: 'story-exit' }, 'exit')
    .to(fromRefs.ambientVideo, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 'exit')

    .addLabel('camera', 0.18)
    .to(cameraRig.position, {
      x: toChapter.camera.x, y: toChapter.camera.y, z: toChapter.camera.z,
      duration: 0.52, ease: 'story-camera',
    }, 'camera')
    .to(cameraRig.parallaxLayers, { xPercent: (i) => toChapter.parallax[i], duration: 0.52, ease: 'story-camera' }, 'camera')

    .addLabel('enter', 'camera+=0.44')
    .call(() => mountIncomingChapter(toChapter.id), undefined, 'enter')
    .fromTo(toRefs.background, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.56, ease: 'story-enter' }, 'enter')
    .fromTo(toRefs.character, { autoAlpha: 0, y: 14, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, ease: 'story-enter' }, 'enter+=0.04')
    .fromTo(toRefs.floatingObjects, { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: (i) => floatingObjectDuration(i), ease: 'story-enterObjects',
        stagger: (i) => floatingObjectDelay(i) }, 'enter+=0.08')
    .call(() => controls.chapterContent.start('enter'), undefined, 'enter+=0.14')
    .call(() => controls.markers.start('enter'), undefined, 'enter+=0.24')
    .call(() => startIdleBreathing(toChapter.id), undefined, 'enter+=0.38');

  return tl;
}
```

**Interruption handling.** A new click calls `tl.kill()` on the live timeline and rebuilds
from the *current* computed styles of the still-mounted outgoing scene (GSAP's
`overwrite: 'auto'` plus reading current transform values, never resetting to idle first),
so nothing visually snaps. Framer-owned tracks use `type: 'tween'` fallback instead of
`spring` when interrupted mid-flight, to avoid velocity carry-over artifacts.

### 7.4 Framer Motion — Story Card states & entrance staggering

`StoryCard.tsx` exposes four variants. `active` always wins over `hover`; `dragging` wins
over everything for the card under the pointer during a drag gesture.

```ts
const cardVariants: Variants = {
  idle:     { scale: 1,    y: 0,   opacity: 0.72, filter: 'brightness(0.85) saturate(0.9)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              transition: { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 } },
  hover:    { scale: 1.06, y: -8,  opacity: 1,    filter: 'brightness(1) saturate(1)',
              boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
              transition: { type: 'spring', stiffness: 300, damping: 20, mass: 0.8 } },
  active:   { scale: 1.12, y: -14, opacity: 1,    filter: 'brightness(1.05) saturate(1.05)',
              boxShadow: '0 14px 32px rgba(0,0,0,0.34), 0 0 0 2px var(--chapter-accent)',
              transition: { type: 'spring', stiffness: 220, damping: 22, mass: 1 } },
  dragging: { scale: 0.97, y: 0,   opacity: 0.95, boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: { type: 'spring', stiffness: 400, damping: 40, mass: 0.6 } },
};
```

Drag config on the Carousel track: `drag="x"`, `dragElastic={0.12}`, `dragMomentum`,
`dragTransition={{ power: 0.2, timeConstant: 200, restDelta: 0.5 }}`. Card rotation while
dragging is tied to instantaneous drag velocity via `useMotionValue`/`useTransform`,
clamped to **±6deg**, smoothed through `useSpring` (stiffness 300, damping 30). On
release, the nearest card snaps to `active` with the `dragging` transition's spring
config, so hand-off reads as one continuous physical motion. Full gesture spec (tap vs.
drag disambiguation, velocity thresholds, boundary rubber-band) lives in §8.3.

Card sizing per breakpoint is defined once in §8.1's width-breakpoint table — do not
duplicate values here.

**Entrance staggering — floating objects & Stage markers.** A naive linear `i * stagger` blows
the tail budget once a content-heavy chapter has 8 objects. Delay grows sub-linearly and
is clamped so the *last* object never starts later than a fixed spread ceiling:

```ts
const D_BASE = 0, STAGGER = 55, SPREAD_CAP = 380, EXPONENT = 0.85;

function floatingObjectDelay(i: number, count: number): number {
  const raw = D_BASE + STAGGER * Math.pow(i, EXPONENT);
  const cap = D_BASE + SPREAD_CAP * (i / Math.max(count - 1, 1));
  return Math.min(raw, cap) / 1000;
}
function floatingObjectDuration(i: number): number {
  const jitter = (hash(i) % 80) - 40; // ±40ms — deterministic, never Math.random()
  return (420 + jitter) / 1000;
}
```

`hash(i)` is a small deterministic string/int hash (e.g. FNV-1a) seeded by the object's
stable `id` from `content/*.ts` — never `Math.random()`, since static export pre-renders
on the server and any client/server mismatch in computed inline styles triggers a
hydration warning (see also §11.4).

Stage markers (2–6 typical, §4) use a simple linear stagger:
`delay_i = 140ms (after ChapterContent title) + 70ms × i`, springing in with
`{type:'spring', stiffness:260, damping:24, mass:0.9}` — the same spring *numbers* as the
`active` card's transition, so the whole Stage reads as one physical system through
motion alone. This is a shared physics constant only: each marker still renders in its
own chapter-specific diegetic form (§4) and must never adopt the card's rectangular,
shadowed visual chrome — sharing a spring curve is not license to share a look.

### 7.5 Reduced motion — Story Card and stagger collapse

- Card variants: `scale`/`y` removed from all four variants; `idle→hover→active` differ
  only by `opacity`/`filter`/`boxShadow` at `duration:0.12, ease:'linear'`. Drag remains
  available (primary touch input) but `dragElastic` becomes `0`, no overshoot on release.
- Both stagger formulas collapse to `stagger=0` — every floating object and Stage marker
  fades in **simultaneously** at `duration:0.15s, ease:'linear'`, no `y` offset, no spring
  overshoot (springs are swapped for plain tweens, not just sped up).
- Full consolidated reduced-motion table lives in §14.1 — this subsection only covers the
  Story Card/stagger-specific collapse; do not re-derive it elsewhere.

### 7.6 Idle "breathing" loops

Once a chapter settles, every Stage element carries a continuous, low-amplitude,
sinusoidal, phase-desynced loop so the world reads as alive, never a painted backdrop.

| Element | Property | Amplitude | Period | Notes |
|---|---|---|---|---|
| Character (rest) | `translateY` | ±4px | 4.2s | phase 0 |
| Character (rest) | `rotate` | ±0.6deg | 5.6s | +1.1s offset from Y so they never sync |
| Floating object *i* | `translateY` | 6–14px, scaled by parallax depth | 3.2–6.8s | `period_i = 3.2 + (hash(id_i) % 361)/100` |
| Floating object *i* | `rotate` | ±2–4deg | Y period +1.4s | |
| `StageBackground` ambient | brightness/hue | ±2–4% | 10–14s | subliminal — reads as "alive," not "animating" |
| Active `StoryCard` | `scale` | 1.12↔1.135 | 2.8s | Framer `repeat: Infinity, repeatType:'mirror'` |
| Stage markers (rest) | `scale` | ±1–2% | 5–9s, phase offset `i×0.4s` | kept subtle enough to never distract from copy |

Amplitude formula for floating objects: `amplitude_i = 6 + depth_i × 8` (`depth_i` =
normalized parallax depth, 0=far, 1=near). GSAP owns the entrance tween then hands off to
a per-object `gsap.to(el, {y:'+=Npx', duration:period/2, ease:'sine.inOut', yoyo:true,
repeat:-1})`; the active card's pulse and Stage-marker micro-pulses live entirely in
Framer's `animate` prop since they need no timeline coordination.

**Reduced motion:** every loop in this table is fully **killed** (`gsap.killTweensOf`,
Framer loop unmounted), not slowed — each element parked at its literal rest frame. This
is the one place "fully static" is the explicit accessibility requirement, the sanctioned
exception to "nothing is ever static" everywhere else.

### 7.7 Risk call-outs

- **Dual-engine transform fights.** If a floating object's entrance tween and its own idle
  loop both target `y` simultaneously, the loop must not start until the entrance tween's
  `onComplete` fires.
- **R3F canvas remount jank.** Where two consecutive chapters are both 3D-hosted, keep one
  persistent canvas and swap the scene graph internally instead of a full unmount/remount
  (see §11.2); only cold-mount/unmount when crossing a DOM/SVG ↔ 3D boundary.
- **Determinism under static export.** Any jitter/variety in stagger or breathing math
  must come from a seeded hash of a stable content id, never `Math.random()`.
- **Tail-latency creep.** `SPREAD_CAP` and a hard `MAX_ENTER_TAIL = 1300` constant in
  `lib/transitions.ts` are load-bearing, not aspirational — any chapter whose computed
  enter-tail exceeds it should fail a lint/test check, not just look slow in review.
- **Interrupted transitions.** Fast repeated clicks must kill and rebuild from live
  computed values (§7.3), never reset-then-restart.

---

## 8. Responsiveness

Non-negotiable framing: **there is no document scroll at any breakpoint, orientation, or
degraded state.** Every rule below re-partitions a fixed `100dvh` box into Stage +
Carousel, never makes the box taller than the viewport. Where content genuinely cannot
fit, the response is *scale down, hide non-essential layers, or degrade to Companion Mode*
(§8.6) — never scroll. The split is driven primarily by **viewport height** (§8.1/§8.2);
width drives card sizing and Stage content scale.

### 8.1 Width breakpoint table

All ranges are `min-width`-based, mobile-first, logical CSS px. Tokens live in
`lib/viewport.ts`, exposed via a `useViewportBucket()` hook that writes results onto CSS
custom properties rather than branching per-component.

| Token | Width range | Representative devices | Stage : Carousel | Carousel height | Card (w × h) | Cards visible* | Gutter |
|---|---|---|---|---|---|---|---|
| `phone-sm` | 320–389px | iPhone SE, budget Android | 76:24 | `max(24dvh,88px)` | 92×112px | ~2.6 | 8px |
| `phone-lg` | 390–479px | iPhone 14–16, Pixel 6–8, Galaxy S22–24 | 78:22 | `max(22dvh,92px)` | 104×128px | ~3.1 | 10px |
| `phablet` | 480–767px | large phones | 80:20 | `max(20dvh,96px)` | 122×148px | ~3.6 | 12px |
| `tablet-portrait` | 768–1023px | iPad portrait, Android tablets | 82:18 | `max(18dvh,104px)` | 148×178px | ~4.8 | 14px |
| `tablet-landscape`/`laptop-sm` | 1024–1365px | iPad landscape, small laptops | 85:15 | `clamp(112px,15dvh,150px)` | 168×202px | ~6.2 | 16px |
| `desktop` | 1366–1919px | 1366×768, 1440×900, 1536×864 | 85:15 | `clamp(120px,15dvh,160px)` | 184×222px | ~7.6 | 20px |
| `desktop-xl` | 1920–2559px | 1080p/1440p monitors | 85:15 | `clamp(140px,15dvh,180px)` | 204×246px | ~9.0 | 24px |
| `ultrawide` | ≥2560px **and** aspect ≥1.9:1 | 3440×1440, 5120×1440, 49" panels | 85:15 of a centered safe column (§8.7) | same caps as `desktop-xl` | same as `desktop-xl` | more (side letterboxing) | 24px |

\* Fully visible cards at rest, including the intentional partial peek of the next card.

Buckets recalculate on resize/orientation change (§8.5), not just on mount, since
foldables and window resizing can cross a boundary at runtime.

`100dvh` is supported iOS Safari 15.4+ and evergreen desktop (2023+). Fallback for older
engines: an effect writes `document.documentElement.style.setProperty('--vh',
window.visualViewport.height + 'px')` on `resize`/`visualViewport.resize`; the shell falls
back via `@supports not (height: 100dvh)`. This avoids the classic iOS Safari
`100vh`-includes-the-address-bar bug clipping the Carousel under browser chrome.

### 8.2 Height overrides (short & landscape viewports)

Applied **on top of** §8.1 regardless of width bucket, since a wide-but-short window
(landscape phone, split-screen tablet) breaks the height ≥ ~600px assumption.

| Condition | Trigger (height) | Ratio override | Carousel treatment |
|---|---|---|---|
| Short landscape | 400–599px | 70:30 of available height, carousel floored/ceilinged to 84–104px | Cards shrink to compact icon chips (56×56px circular, active ring); text label hidden visually but retained via `aria-label` |
| Very short landscape | 320–399px | Carousel floor dominates (~62:38 effective) | Same compact chips; Stage typography drops to its clamp floor (§8.4); non-essential decorative layers hidden |
| Below minimum | height < 320px **or** width < 320px | N/A | **Companion Mode** — §8.6 |

Real device check: iPhone SE landscape (667×375) and iPhone 14/15 landscape (852×393)
both hit "short landscape" — almost every phone in landscape lands here. This is the
common case, not the edge case, and is treated as a first-class layout.

### 8.3 Stage content scaling & touch gesture spec

**Continuous scaling** (no bucket boundary ever produces a visible jump):
- Chapter title: `clamp(1.5rem, 5.5vh, 3.25rem)`
- Story copy: `clamp(0.9rem, 2.6vh, 1.15rem)`
- Character illustration height: `clamp(220px, 55dvh, 640px)`, anchored to a per-chapter
  `compactFocalPoint: {x,y}` (0–1 normalized, used only when §8.2's height override is
  active) rather than naive `object-fit: contain`, so cropping never decapitates the
  character on short viewports.

**Touch gesture spec — Story Carousel** (Framer Motion `drag="x"` on the track;
individual `StoryCard`s are non-draggable, purely a click/tap target):

- **Tap vs. drag:** pointer movement < 8px before release → tap, selects the chapter
  directly. ≥ 8px → drag; the eventual tap is suppressed.
- **Distance threshold:** commits to next/previous if `|dragOffsetX| > 0.33 ×
  (cardWidth+gutter)` at release. Below that → snap-back spring
  `{type:'spring', stiffness:300, damping:30, mass:0.8}` (~230–260ms).
- **Velocity threshold (overrides distance):** `|vx| > 500px/s` commits one card in the
  flick direction regardless of distance. `|vx| > 1400px/s` allows a 2-card fling
  (`projectedOffset = dragOffsetX + velocity.x × 0.2`), rounded to the nearest card
  boundary, **hard-capped at ±2 cards** so a fast flick never skips half the carousel.
  Commit spring: `{stiffness:260, damping:28}` (~300ms).
- **Momentum:** `dragTransition={{power:0.3, timeConstant:200, restDelta:1}}` — coasts,
  then always resolves into a snap to a card boundary; this is paging, never free-scroll.
- **Boundary rubber-band:** `dragElastic={0.15}`, hard-clamped to a **40px max visual
  overscroll**. Spring-back at the boundary: `{stiffness:400, damping:32}` (~170–190ms,
  snappier than the normal snap-back) — reads as "this is the end."
- **Active card state:** identical to `cardVariants.active` defined once in §7.4
  (`scale:1.12, y:-14`, spring `{stiffness:220, damping:22, mass:1}`, elevated shadow plus
  the accent ring) — not redefined here. Touch activation and mouse activation drive the
  same Framer variant; there is no separate tween-based value for the touch context.
- **Non-touch parity:** Arrow Left/Right = identical commit spring, one-card step.
  Trackpad/mouse-wheel horizontal input is intentionally **not** free-scroll — wheel
  deltas debounced 120ms and converted to discrete card-steps, preserving "one thing
  active at a time" across every input modality.
- **Gesture-conflict risks (real, not hypothetical):** iOS Safari's edge-swipe-back and
  Chrome/Android's pull-to-refresh can fight a horizontal drag starting near the edge.
  Mitigation: `overscroll-behavior: none` site-wide, plus a ~16px dead-zone at the
  carousel's extreme left/right where drag-start is ignored. `touch-action: none` on the
  track itself (not `pan-y` — there's no vertical pan); verify tap-to-select still fires on
  iOS Safari under `touch-action: none` as a QA item, not an assumption.

### 8.4 Orientation-change handling (mobile)

1. Listen via `window.screen.orientation.addEventListener('change', …)`, with a
   `matchMedia('(orientation: portrait)')` fallback.
2. **Never interrupt an in-flight chapter transition** (§7) — a mid-transition
   orientation change queues the re-layout and applies it the instant the transition
   completes.
3. Debounce the re-bucket calculation by 120–150ms (the OS orientation animation runs
   ~300–500ms on iOS; recalculating every intermediate frame causes thrash).
4. If recalculation crosses a bucket boundary, cross-fade the shell's CSS custom-property
   change over 150ms (`cubic-bezier(0.4,0,0.2,1)`); same-bucket changes (common on
   near-square foldables) apply instantly, no transition.
5. **Preserve carousel position** — the active chapter stays centered/active after
   re-layout (recompute translateX from the new card width); never reset to index 0.
6. Reiterate: orientation change recomputes a fixed, viewport-locked grid — a relayout,
   never a scroll.

### 8.5 Foldables

Treated as a resize/orientation event using the buckets above, with two explicit cases:
- **Folded** (e.g. Z Fold5 cover, ~344×882): falls into `phone-sm`/`phone-lg` — no special
  case beyond standard buckets.
- **Unfolded** (e.g. Z Fold5 inner ~904×1064, Surface Duo ~540×720/pane): lands near
  `tablet-portrait`/`phablet` but with a **near-square aspect ratio** (0.85–1.2) the
  standard buckets don't anticipate. Rule: when `0.85 ≤ aspectRatio ≤ 1.2`, cap the Stage
  illustration's max-width at 720px and center it, rather than stretching the
  character/scene edge-to-edge beyond its art-directed proportions.
- Fold/unfold transitions debounce identically to §8.4 (120–150ms).
- Forward-looking, non-blocking: `@media (device-posture: folded)` (CSS Media Queries
  Level 5, nascent support) can be layered in later to avoid staging content under the
  hinge — not a v1 dependency, flagged so it isn't forgotten once support matures.

### 8.6 Minimum supported viewport & graceful degradation

**Minimum supported viewport for the full cinematic experience: 320×480px** (portrait) /
**480×320px** (landscape) — the classic small-phone floor, still a standard QA baseline.
Because buckets key off logical CSS px, this also covers narrow slivers from tablet
split-screen "for free" (a 1/3-width iPad Split View at ~320–375px is handled by
`phone-sm` rules).

**Below that floor** (width < 320px or usable height < 320px — first-gen foldable cover
screens, extreme split-screen slivers, embedded-iframe previews) the app enters
**Companion Mode**, a documented, intentional trade-off:

1. `useViewportBucket()` exposes `belowMinimum: boolean`; when true, `Stage.tsx`
   short-circuits *before mounting* any R3F `<Canvas>`, GSAP camera timeline, or floating-
   object physics — skipped entirely, not hidden, to protect memory/CPU.
2. Renders a static, non-animated view: chapter title + 1–2 lines of copy, no character/
   background art layers, `prefers-reduced-motion` forced on regardless of actual OS
   setting.
3. The Carousel remains (compact-chip treatment from §8.2) — all 11 chapters stay
   reachable; content parity is preserved even though animation fidelity is not.
4. A single low-opacity caption ("Best experienced on a larger screen") folds into the
   existing Stage content layer — not a new modal/banner (none permitted by §2).
5. Explicit non-goal: Companion Mode trades away animation and 3D fidelity, never the
   two-region contract or the "no scroll, ever" contract, both preserved unconditionally.

### 8.7 Ultra-wide & large monitors

At `ultrawide` (≥2560px, aspect ≥1.9:1), naively stretching the Stage full-bleed would
leave the character tiny and off-center, copy stranded far from the visual focus.
- Stage foreground content (character, title, copy, Stage markers) composes inside a
  **centered safe column**, max-width 2100px, using `desktop-xl` sizing tokens.
- Only ambient/background layers (gradient, particle fields, R3F environment/camera
  background) extend full-bleed to the physical viewport edges — this is what makes
  ultra-wide feel premium rather than "zoomed out."
- The Carousel track is likewise capped and centered, rather than spacing 11 cards
  absurdly far apart across 5120px.

### 8.8 Recommended QA device/resolution matrix

- iPhone SE (375×667 portrait, 667×375 landscape) — `phone-sm`, short-landscape override
- iPhone 14/15 (393×852 portrait, 852×393 landscape) — `phone-lg`, short-landscape override
- Pixel 7 (412×915)
- iPad Mini (744×1133 portrait), iPad Pro 12.9" (1366×1024 landscape)
- Galaxy Z Fold5 folded (344×882) and unfolded (~904×1064)
- Surface Duo single-pane (540×720) and spanned (720×540)
- 1920×1080, 2560×1440 (`desktop-xl`)
- 3440×1440 and 5120×1440 (`ultrawide`)
- iPad Split View at 1/3 width (~320–375px effective) as a stand-in for the below-320 edge

---

## 9. Content & Folder Structure

```
/app
  layout.tsx          — fullscreen shell, no scroll, fonts, MotionConfig (§14.1)
  page.tsx            — Server Component; imports CHAPTERS, mounts <Storybook />
/components
  /stage
    Stage.tsx
    StageBackground.tsx
    Character.tsx
    FloatingObjects.tsx
    ChapterContent.tsx
    ScrimPanel.tsx        — contrast-guarantee layer, §14.4
  /carousel
    StoryCarousel.tsx
    StoryCard.tsx
  /chapters
    WelcomeScene.tsx
    JourneyScene.tsx
    ExperienceScene.tsx
    ProjectsScene.tsx
    EngineeringScene.tsx
    GithubScene.tsx
    WritingScene.tsx
    LearningScene.tsx
    LifeScene.tsx
    GalleryScene.tsx
    ContactScene.tsx
  /character              — componentized paper-doll rig, §13
    CharacterRig.tsx
    rig-anchors.ts
    layers/
      Head.tsx, Hair.tsx, Expression.tsx, Torso.tsx, Arm.tsx, Legs.tsx, Accessories.tsx
      props/ Laptop.tsx, Satchel.tsx, Wrench.tsx, Pencil.tsx
  /a11y
    ChapterAnnouncer.tsx, SkipLink.tsx, SceneAccessibleOverlay.tsx
/three
  scenes/            — R3F scene components for the 4 3D chapters (§11)
  camera/            — CameraRig.tsx + transition controller
/content
  chapters.ts        — CHAPTER_ORDER + ChapterMeta registry (id, icon, label, order, theme, pose, renderer)
  character.ts        — characterFeatures + per-chapter pose preset table (§13)
  journey.ts, experience.ts, projects.ts, engineering.ts, github.ts,
  writing.ts, learning.ts, life.ts, gallery.ts, contact.ts
  theme.ts            — shared design tokens (scrim/ink pairs, §14.4)
/hooks
  useActiveChapter.ts, useChapterTransition.ts, useViewportBucket.ts,
  usePrefersReducedMotion.ts, usePageVisibility.ts, useAnimationGate.ts,
  useCanvasLifecycle.ts
/lib
  transitions.ts     — GSAP timeline helpers, CustomEase registration
  store/useStorybookStore.ts — Zustand store, §10.2
  viewport.ts
/types
  chapter.ts, content.ts
/scripts
  contrast-audit.ts  — Playwright-based automated contrast check, §14.4
/public
  captions/          — .vtt files, if/when Category-2 video ships (§14.5)
```

This structure is the single reference for file placement across the rest of the
document — later sections name files but do not redefine this tree.

---

## 10. Frontend Architecture

Resolves four implementation decisions: where the Server/Client Component boundary falls
under static export, what drives `activeChapterId`, whether a URL can point at a chapter
without becoming "navigation," and how each chapter's JS is code-split. State management
is not part of the originally-fixed tech-stack table (§3) — it is an open slot resolved
here, not a deviation.

### 10.1 Client/Server Component boundary under static export

`next.config.ts` sets `output: 'export'`. There is no server at runtime — everything ships
prebuilt. That narrows the RSC boundary's job to: keep `layout.tsx`/`page.tsx`
contributing zero bytes of client JS, and correctly quarantine browser-only libraries
(GSAP, Three.js/R3F) so the static-export prerender pass never executes them on Node.

| File | Boundary | Why |
|---|---|---|
| `app/layout.tsx` | Server (default) | Static shell only — `<html>` with scroll lock, `next/font`, metadata. No state, no interactivity. |
| `app/page.tsx` | Server (default) | Imports `CHAPTERS` from `content/chapters.ts` (plain objects, resolved at build time), renders `<Storybook chapters={CHAPTERS} />`. Passing this Server→Client prop is safe under static export since it's serialized into the build output — but constrains content schemas to plain, JSON-serializable data: **no JSX, no functions, no class instances in `/content/*.ts`**, only string icon-keys. |
| `components/Storybook.tsx` | `'use client'` | The real boundary — owns the Zustand store subscription, mounts `<Stage/>` + `<StoryCarousel/>`, wires `popstate`/hash sync (§10.3). |
| `components/stage/*`, `components/carousel/*`, `components/chapters/*Scene.tsx`, `/three/**` | `'use client'` | All interactive/animated by nature. Marked at each leaf so Next's compiler can tree-shake per-module. |

**Concrete risk:** static export still runs a build-time prerender pass that *executes*
client component bodies once under Node to produce the HTML shell. Any code touching
`window`/`document`/WebGL at module-eval or render time (an R3F `<Canvas>` calling
`document.createElement('canvas')`, a GSAP plugin registering against `window` at import
time) throws `ReferenceError: window is not defined` during `next build`, not in the
browser. The fix is structural, not a `typeof window !== 'undefined'` sprinkle (too easy
to miss a nested Drei helper): R3F chapter scenes are excluded from the prerender pass
entirely via `next/dynamic(..., { ssr: false })` (§10.4).

### 10.2 State management — `activeChapterId`

**Decision: a single Zustand store (`lib/store/useStorybookStore.ts`), not Context +
`useReducer`.**

| Concern | Context + `useReducer` | Zustand |
|---|---|---|
| Re-render scope | One Provider value change re-renders every subscriber unless split into multiple Contexts (more boilerplate) | Selector hooks subscribe per-field — `StoryCarousel` only re-renders on `activeChapterId`, `Stage` only on `activeChapterId`/`transitionPhase`/`direction` |
| Imperative reads from GSAP | Needs `useRef`-mirrored state to avoid re-render storms | `getState()`/`subscribe()` outside React — GSAP callbacks read/write directly without a React re-render per tick |
| Testability | Needs a Provider wrapper in every test | Plain module; transition-guard logic is unit-testable with zero React involvement |
| Bundle cost | 0kb | ~1.1kB gzipped — negligible next to Three.js/GSAP/Framer Motion |
| App Router footgun | Provider must itself be Client; easy to mis-place in a refactor | `create()` is just a client-consumed module; no Provider to misplace |

Zustand wins because **transition-phase state changes rapidly during the ~900ms–1.3s
choreography window (§7), and must not force re-renders of an R3F `<Canvas>` subtree**.
Ephemeral per-frame values (camera-lerp progress) never enter the store — they stay
inside a GSAP timeline/`useRef`; the store only commits at transition boundaries
(start/settle), keeping store-driven re-renders at "chapter changed" frequency (~20–40/
session), not animation-frame frequency.

```ts
export type TransitionPhase = 'idle' | 'exiting' | 'entering';

interface StorybookState {
  activeChapterId: ChapterId;
  previousChapterId: ChapterId | null;
  transitionPhase: TransitionPhase;
  direction: 1 | -1;
  hasInteracted: boolean;
  navigateTo: (id: ChapterId) => void;
  _settleExit: () => void;   // called by GSAP onComplete
  _settleEnter: () => void;  // called by GSAP onComplete
}
```

**FSM guard (concrete invariant):** `navigateTo` is a no-op if `transitionPhase !==
'idle'`. A second click mid-transition is deliberately ignored, not queued or interrupted
— at 900ms–1.3s per transition this reads as "the story turning its page," and eliminates
an entire class of GSAP-timeline-race bugs. `direction` is derived by comparing indices in
`CHAPTER_ORDER` (§9), driving both the Carousel's slide direction and, for R3F chapters,
the camera-pan side.

### 10.3 Shallow URL state without contradicting "single route, no navigation"

Goal: a shared link or Back/Forward can land on/step through a specific chapter —
**without** a second route, a navbar, or Next's router treating it as navigation.
Mechanism: the URL **hash fragment**, manipulated directly via the History API, never via
`next/navigation`'s `useRouter()`/`usePathname()`.

- **Why not `useRouter().push()`:** assumes an App Router route change — route-transition
  machinery, scroll-restoration, potential server re-fetches, none applicable here, and it
  would imply a second "virtual route" contradicting §2. The hash is invisible to Next's
  router entirely.
- **On mount:** read `location.hash` once, validate against `CHAPTER_ORDER` (reject
  unknown/malformed, fall back to `'welcome'`), use as the lazy initial store value.
- **Hydration-flash risk (real):** the exported HTML always bakes in `'welcome'` as the
  first-painted chapter — a static export can't branch per request. A hash-matched
  chapter differing means a visitor deep-linking to `#chapter=projects` could see a flash
  of Welcome before Projects swaps in. Mitigation: gate the first paint behind a 300–500ms
  scene-veil (the storybook's own opening-curtain aesthetic), during which
  `useLayoutEffect` resolves the true initial chapter from the hash *before* the curtain
  lifts — turning a bug into reused, on-brand choreography.
- **Writing the hash back:** `window.history.pushState(null, '', '#chapter=' + id)`,
  called from `_settleEnter` (after the enter animation completes, not on click) — avoids
  mid-transition URL flicker, and since the FSM guard already ignores clicks during a
  transition, every `pushState` corresponds to exactly one completed, intentional view.
- **Back/Forward:** a single `popstate` listener (not `hashchange` — `pushState` doesn't
  fire it) parses the hash and calls the same `navigateTo` (same busy-guard), so Back
  feels identical to clicking a Carousel card, with no second route ever created.
- **Explicit, accepted limitation:** per-chapter Open Graph/meta tags are **not**
  attempted. A static export produces one HTML file with one meta set; scrapers don't
  resolve hash fragments. Shareability means "a chapter opens directly for a human with a
  browser," not "distinct social-preview cards per chapter." Sign off on this trade-off
  explicitly (§15).

### 10.4 Per-chapter code-splitting

Chapter scenes are loaded through a registry in `content/chapters.ts` (loader functions,
not a giant `switch`), so each chapter's JS — including any R3F scene — becomes its own
webpack chunk, fetched only when needed.

| Chapter | Renderer | Import strategy |
|---|---|---|
| Welcome | DOM/SVG/Framer | **Static** `import` — guaranteed first view, no dynamic-import waterfall |
| Journey | DOM/SVG/Framer | `next/dynamic`, `ssr: true` |
| Experience | DOM/SVG/Framer | `next/dynamic`, `ssr: true` |
| Projects | **R3F** | `next/dynamic`, **`ssr: false`** |
| Engineering | DOM/SVG/Framer | `next/dynamic`, `ssr: true` |
| GitHub | **R3F** | `next/dynamic`, **`ssr: false`** |
| Writing | DOM/SVG/Framer | `next/dynamic`, `ssr: true` |
| Learning | **R3F** | `next/dynamic`, **`ssr: false`** |
| Life | DOM/SVG/Framer | `next/dynamic`, `ssr: true` |
| Gallery | DOM/SVG/Framer | `next/dynamic`, `ssr: true` |
| Contact | **R3F** | `next/dynamic`, **`ssr: false`** |

**Why `ssr:false` is required, not optional hardening, for the 4 R3F chapters:**
`@react-three/fiber`'s `<Canvas>` creates a WebGL context at mount
(`document.createElement` + `getContext('webgl2')`), which doesn't exist under Node; Drei
helpers assume browser fetch/`Image` decode paths. `'use client'` alone is **not**
sufficient under static export, since the prerender pass still executes client component
bodies once on Node — `ssr:false` is the only `next/dynamic` option that fully excludes a
component from that pass, deferring first execution to the browser post-hydration. The 7
DOM/SVG/Framer chapters get no such flag because prerendering them is free and improves
perceived load for whichever one a hash-deep-link lands on first.

```ts
const ProjectsScene = dynamic(() => import('@/components/chapters/ProjectsScene'), {
  ssr: false,
  loading: () => <SceneCurtain chapter="projects" />,
});
```

`SceneCurtain` reuses the veil/easing language of the inter-chapter transition (§7)
rather than a generic spinner — a cold chunk-load must still read as "the story turning a
page."

**Prefetch strategy:** after Welcome's entrance settles, use `requestIdleCallback`
(Safari fallback `setTimeout(fn, 200)`) to `import()` the Carousel's immediate neighbors
of the active chapter — not all 11 upfront. Re-run on every settle. Mirrors actual
browsing behavior (arrow-key/swipe adjacency) and avoids silently loading all four
R3F bundles for a visitor who only looks at Welcome and Contact.

**Bundle budget** (gzipped; enforced in CI, see §12.1 for the full per-chapter table):

| Bundle | Size | Note |
|---|---|---|
| Framer Motion | ~35–50kB | Shared, global |
| GSAP core | ~30kB | Shared |
| Three.js + R3F + tree-shaken Drei subset | ~150–250kB per R3F chapter chunk | Import only Drei helpers actually used — never the barrel |
| Soft ceiling per chapter chunk | ~300kB gzipped | CI warning, reviewed before merge, not a hard fail |

This budget holds only while 3D chapters stay procedural/primitive-geometry, consistent
with §11.4 — a single imported HDRI or GLTF can add 1–5MB uncompressed with no warning
until profiled.

### 10.5 TypeScript type contracts

Two files anchor the contract: `types/chapter.ts` (metadata + registry shape) and
`types/content.ts` (per-chapter payloads). Content crosses the Server→Client prop
boundary (§10.1) and is hand-authored rather than CMS-validated, so everything stays
plain-data (serializable, no functions/JSX) and leans on the compiler plus a small
dev-only test suite as the only safety net.

```ts
// types/chapter.ts
export type ChapterId =
  | 'welcome' | 'journey' | 'experience' | 'projects' | 'engineering'
  | 'github'  | 'writing' | 'learning'    | 'life'     | 'gallery'   | 'contact';

export const CHAPTER_ORDER: readonly ChapterId[] = [
  'welcome', 'journey', 'experience', 'projects', 'engineering',
  'github', 'writing', 'learning', 'life', 'gallery', 'contact',
] as const;

export type ScenePose =
  | 'idle' | 'walking' | 'working' | 'thinking' | 'waving' | 'looking-at-stars';
export type SceneRenderer = 'dom' | 'r3f'; // drives the ssr:false decision, §10.4

export interface ChapterTheme { background: string; foreground: string; accent: string; }

export interface ChapterMeta {
  id: ChapterId; order: number; icon: string; label: string; shortLabel?: string;
  theme: ChapterTheme; pose: ScenePose; renderer: SceneRenderer;
  ambient?: { videoSrc?: string; audioSrc?: string };
}
```

```ts
// types/content.ts — per-chapter payload shapes
export interface JourneyMilestone { id: string; year: string; title: string; description: string; icon?: string; }
export interface ExperienceRole { id: string; org: string; title: string; period: string; summary: string; highlights: string[]; }
export interface ProjectStory {
  id: string; title: string; tagline: string;
  problem: string; idea: string; journey: string; challenge: string;
  solution: string; outcome: string; lesson: string; // §6's 7-beat structure, typed
  stack: string[]; links?: { demo?: string; repo?: string; caseStudy?: string };
}
export interface GithubHighlight { id: string; label: string; value: string; note?: string; }
export interface WritingPiece { id: string; title: string; excerpt: string; url?: string; date: string; }
export interface LearningTopic { id: string; title: string; note: string; }
export interface LifeItem { id: string; label: string; description: string; }
export interface GalleryPhoto { id: string; src: string; alt: string; caption?: string; }
export interface ContactContent {
  headline: string;
  // 5 CTAs, fixed order per §5/§6.2/§14.2: lets-talk, resume, github, linkedin, email.
  // 'lets-talk' is a distinct CTA (a mailto: with a dedicated subject line, or an
  // external scheduling link) from the plain 'email' CTA — both are real, static links,
  // never a form POST (§2, §3).
  ctas: Array<{ label: string; href: string; kind: 'lets-talk' | 'resume' | 'github' | 'linkedin' | 'email' }>;
}

export interface ChapterContentMap {
  welcome: { headline: string; subline: string };
  journey: JourneyMilestone[]; experience: ExperienceRole[]; projects: ProjectStory[];
  engineering: { toolGroups: Array<{ label: string; items: string[] }> };
  github: GithubHighlight[]; // static snapshot only — never a live fetch, §5/§15
  writing: WritingPiece[]; learning: LearningTopic[]; life: LifeItem[];
  gallery: GalleryPhoto[]; contact: ContactContent;
}

export function getChapterContent<K extends ChapterId>(id: K): ChapterContentMap[K] {
  return CONTENT_REGISTRY[id] as ChapterContentMap[K];
}
```

**Exhaustiveness as a compile-time guardrail** for "exactly 11 chapters, fixed order":
anywhere chapter-specific branching happens, use a `switch` over `ChapterId` with a
`never`-typed default (`function assertUnreachable(x: never): never`). Adding or
reordering a chapter becomes a compile error at every call site that needs to handle it.

**Dev-time invariants** (a small Vitest suite, no production cost): `CHAPTER_ORDER` has
exactly 11 unique entries; every `ChapterMeta.id` appears exactly once in it; every
`ChapterId` resolves via `getChapterContent`; every `renderer:'r3f'` chapter's loader is
wrapped with `ssr:false`. Cheap, mechanical, and the only thing standing between a typo in
hand-authored content and a broken chapter shipping — this project has deliberately opted
out of every other kind of runtime validation (§2).

---

## 11. Three.js / R3F Architecture

This section is the binding technical decision for which chapters get a WebGL canvas, how
one camera moves between them, what the hardware is allowed to cost, how geometry is built
without a single downloaded 3D asset, and what happens in memory when a visitor rattles
through all 11 cards in four seconds.

### 11.1 Chapter-by-chapter: Canvas vs. DOM/SVG/Framer

Default answer is **DOM/SVG/Framer Motion**. A chapter only earns an R3F `<Canvas>` if it
needs true parallax depth with correct occlusion across many moving elements,
instanced/particle-driven ambient motion at a count DOM cannot cheaply animate, or a
camera move that must feel like one continuous shot. "Looks nice in 3D" is not sufficient
— GPU budget is finite and is spent against the Carousel's own drag physics and
Framer/GSAP compositing every frame regardless.

| # | Chapter | Decision | Reasoning |
|---|---|---|---|
| 1 | Welcome | DOM/SVG + Framer | First paint — a WebGL context/shader compile here sits on the critical path to first impression. Dawn gradient + idle breathing + mouse-parallax on 2–3 flat SVG layers delivers 90% of the cinematic feeling for free. |
| 2 | Journey | DOM/SVG + GSAP | "Camera pans across a road" is multiplane parallax (far mountains slow, mid-ground fast) — pure `translateX` layers at different speed ratios. The road never actually curves toward camera, so true 3D perspective buys nothing. |
| 3 | Experience | DOM/SVG + Framer | "Rooms you step into" is a crossfade between full-bleed illustrated room SVGs with a push/zoom crop — `AnimatePresence` handles this natively. |
| 4 | Projects | **R3F Canvas** | Flagship chapter and the phase-4 fidelity template. Volumetric depth + real light falloff + a camera dolly between stations earns its cost. |
| 5 | Engineering | DOM/SVG + Framer (CSS 3D transform) | A pegboard with `perspective`+`translateZ` tilt-on-hover sells "reach out and touch" without a second full 3D scene one chapter after Projects — reserving R3F for 4 of 11 keeps each feel like an event. |
| 6 | GitHub | **R3F Canvas** | Contribution history as a constellation is a large instanced point/line dataset (150–300 nodes) — the case where "many small things drifting with correct depth" is native to WebGL and expensive in DOM. |
| 7 | Writing | DOM/SVG + Framer | Intimacy, not spectacle — a paper-textured SVG with a soft drop-shadow and lazy loop looks like a keepsake; materials would work against the emotional goal. |
| 8 | Learning | **R3F Canvas** | Concept-orbs drifting with correct mutual occlusion and mouse-parallax at this count is the textbook R3F case — DOM cannot fake occlusion/parallax without becoming its own layout engine. |
| 9 | Life | DOM/SVG + Framer | Same reasoning as Writing/Experience — warmth over spectacle. |
| 10 | Gallery | DOM/SVG + Framer (CSS 3D transform) | Photos must stay crisp; a WebGL sampler adds mipmap/blur risk for zero gain over `<img>`. A `perspective` wall + Framer drag — kept a wall/table composition (staggered, rotated, overlapping), never a uniform grid, honoring the no-boxed-grid constraint. |
| 11 | Contact | **R3F Canvas** | Closing "credits roll" — a starfield is the single cheapest, highest-perceived-value GPU use in the app (one `THREE.Points` draw call), bookending Welcome's DOM warmth. |

**Result: 4 of 11 chapters (36%) get a Canvas** — Projects, GitHub, Learning, Contact.
This ratio is itself a product decision: "3D chapter" stays a signal the visitor
subconsciously reads as "something changed here," not wallpaper.

### 11.2 Persistent camera rig strategy

**Decision: one long-lived `<Canvas>`, one persistent camera, GSAP-driven lerps between
named per-chapter camera targets — never destroy-and-recreate a canvas per chapter.**

The 4 R3F chapters are not adjacent in carousel order, and navigation is random-access
(card clicks, not forced sequence) — a visitor regularly jumps Projects → Learning →
GitHub directly. The canvas and camera must survive those jumps without re-paying setup
cost each time.

The canvas mounts as a sibling inside `StageBackground.tsx` (background layer, below the
midground `FloatingObjects.tsx`), `position:absolute; inset:0`, `pointer-events` toggled
per active chapter. Created lazily the first time an R3F chapter is entered — never at
initial app load, to protect Welcome's first paint — but once created, stays mounted for
the session (see §11.5 for the idle-disposal exception). Each R3F chapter's scene
(`ProjectsLabScene`, `GithubConstellationScene`, `LearningOrbsScene`, `ContactSkyScene`
under `/three/scenes/`) mounts/unmounts as a child of that one canvas; the camera is owned
by `/three/camera/CameraRig.tsx`, which outlives every individual scene.

**Why not remount a fresh canvas per chapter:**

| | Persistent canvas + rig (chosen) | Remount per chapter |
|---|---|---|
| Camera continuity | Camera can dolly/pan as one continuous shot between chapters (§7 requires this) | Every entry is a hard cut — no lerp possible |
| WebGL context cost | Paid once per session (~150–400ms mid-tier mobile), masked by prefetch during Welcome's idle time | Paid on every DOM→R3F transition — collides with the 900ms–1.3s budget (§7) |
| Context-limit risk | One context, ever | Rapid clicking risks creating a second/third context before GC reclaims the first — `WEBGL_CONTEXT_LOST`, especially iOS Safari |
| Memory model | Scene-level dispose (shared blast radius if sloppy) | Canvas-level dispose is automatic, but the cost above makes it a non-starter |

Option B (remount) is rejected outright — it cannot deliver the choreography §7 already
commits to.

**Camera targets (initial values, tuned during Phase 6 of §16):**

| Chapter | Position (x,y,z) | LookAt | FOV | Idle motion while active |
|---|---|---|---|---|
| Projects | (0, 1.6, 6) | (0, 1, 0) | 40° | None baseline; on bench hover, lateral dolly ±1.2 units, `power2.out`, 500ms |
| GitHub | (0, 2, 8) | (0, 0, 0) | 45° | Slow orbital drift, 0.05 rad/s around Y |
| Learning | (0, 0, 10) | (0, 0, 0) | 50° | Vertical bob ±0.15 units, 5s period, `sine.inOut`; orbs drift on their own timelines |
| Contact | (0,1,14)→(0,1,11) | (0, 2, −10) | 35° (narrow/telephoto, "credits" feel) | Slow continuous push-in over ~8s, then holds — no loop, this is the ending |

Transition tween: `gsap.to(cameraRig.position/lookAt/fov, {duration:1.1,
ease:"power3.inOut", overwrite:"auto"})`, sitting inside the existing 900ms–1.3s budget
(§7), not a separate budget. Idle motion is layered **additively** on top of the tween's
resting value inside `useFrame` — never fighting the same tweened property.

**Warm-up strategy — the same neighbor-adjacency prefetch rule as §10.4, not a second,
competing policy.** The R3F runtime chunk and a given chapter's scene module are fetched
under exactly §10.4's `requestIdleCallback` neighbor-prefetch mechanism: once an R3F
chapter (Projects, GitHub, Learning, or Contact) becomes an **immediate Carousel
neighbor** of the currently active chapter, its module — and the shared R3F runtime, if
not already resident — is dynamically imported and the canvas is mounted at `opacity:0`
to compile the shared toon-material shader and idle the camera at that chapter's target,
ahead of the click. This never fires directly off Welcome (Welcome's only neighbor is
Journey, a DOM/SVG chapter, per §10.4's own adjacency rule) and never speculatively loads
all four R3F bundles — a visitor who only ever visits Welcome and Contact pays the R3F
runtime + Contact-scene cost exactly once, at the point their own navigation makes
Contact (or Projects, or GitHub, or Learning) an immediate neighbor of where they are,
never earlier. This is what keeps §1.5's bundle-isolation guarantee intact (Three.js/R3F
is fetched only once a visitor's own path puts them one card away from needing it) while
still sinking the shader-compile/context-creation cost before the click that actually
needs it — one prefetch policy, stated once, not two incompatible ones.

### 11.3 Performance budget

Target hardware for "mid-tier mobile GPU": Adreno 610/612/619 or Mali-G52 MC2 class (e.g.
Galaxy A34/A54, Redmi Note 12, Moto G Power 2023, Pixel 6a) — real devices a recruiter
plausibly opens a portfolio link on.

| Tier | Reference hardware | Target FPS (R3F) | Target FPS (DOM) |
|---|---|---|---|
| High | iPhone 13+/A15+, Snapdragon 8-gen, desktop GPUs | 60fps sustained | 60fps |
| Mid (design target) | Adreno 610/612/619, Mali-G52 MC2 | ≥45fps sustained | ≥55fps |
| Low (floor) | iPhone SE (2020), sub-Snapdragon 660 Android | ≥30fps after step-down | ≥45fps |
| Below floor | Projected <30fps even after full step-down | **Canvas disabled entirely** — static poster + Framer parallax fallback | n/a |

**Frame budget** (60fps = 16.6ms; mid-tier 45fps = 22.2ms):

| Cost center | 60fps budget | 45fps budget |
|---|---|---|
| GSAP/Framer tween evaluation | ≤2ms | ≤3ms |
| R3F reconciliation + `useFrame` | ≤1ms | ≤1.5ms |
| GPU draw (R3F scene) | ≤10ms | ≤14ms |
| DOM/CSS compositing overlay | ≤3.6ms | ≤3.7ms |

**Per-chapter draw-call/triangle/particle ceilings** (hard budget, code-review enforced):

| Chapter | Draw calls | Triangles | Particle/instance count |
|---|---|---|---|
| Projects | ≤60 | ≤90k | 40–80 ambient dust motes (`Points`) |
| GitHub | ≤40 | ≤40k | 150–300 instanced nodes (1 draw call via `InstancedMesh`) + ≤150 merged line segments (1 draw call) |
| Learning | ≤45 | ≤70k | 24–40 hero orbs (interactive `InstancedMesh`) + optional 200-point ambient dust |
| Contact | ≤20 | ≤15k | 800–1,500 stars (single `THREE.Points` draw call) |
| **App-wide ceiling** | **≤80** | **≤150k** | — |

Rationale for the 80-draw-call ceiling: mobile WebGL drivers pay ~0.05–0.1ms CPU-side
overhead per draw call before GPU time even starts; at 80 calls that's 4–8ms of the 14ms
mid-tier allowance, sharing headroom with whatever DOM/Framer content composites on top.

**Transient dual-mount exception (documented and bounded, not a silent violation of the
ceiling above).** The ≤80 draw-call / ≤150k triangle figures are the **steady-state**
budget for whichever single R3F chapter is currently settled and active. §7.7/§11.5
require both scenes' content to briefly coexist as sibling groups in the one persistent
canvas during an R3F-to-R3F crossfade, disposing the outgoing group ~150ms after the
incoming one reports first frame ready (§6.4 risk #3) — during that ≤150ms window only,
the combined draw-call count legitimately exceeds 80 (worst case, Projects→Learning:
60+45=105). This is explicitly budgeted, capped headroom — **≤110 draw calls for ≤150ms,
never sustained** — not an open-ended overshoot; if profiling on reference mid-tier
hardware (§11.3) shows this transient window itself causing a dropped frame, the
mitigation is a shorter dispose-delay or a cheaper "outgoing" LOD swap in the last 150ms,
never simply accepting the frame drop as a cost of the ceiling being "aspirational." Any
single settled, non-transitioning chapter must independently stay within its own row of
the table above.

**Adaptive quality ladder** (driven by a rolling FPS sample — Drei's `<PerformanceMonitor>`
or a manual rAF-delta sampler — triggered after 2 consecutive seconds below the tier
target): (1) disable Bloom postprocessing; (2) halve particle/instance counts; (3) drop
`<ContactShadows>`/fake ground shadow; (4) clamp `<Canvas dpr={[1,1.5]}>` down to flat `1`;
(5) if still below 30fps, disable the canvas for that chapter for the rest of the session
and fall back to the static poster-frame path.

**Lighting/postprocessing/texture ceilings:** ≤3 dynamic lights per scene (1 key, 1 fill,
1 accent), no real-time shadow maps on mobile ever (baked radial-gradient "contact
shadow" or a 256×256 `<ContactShadows>` on desktop tier only); at most one postprocessing
pass (Bloom) ever active, never stacked with SSAO/DOF, render-target capped at 0.5× on
mobile (`<768px`, §8.1), full-res on desktop; zero required texture downloads — if a
starfield-twinkle noise texture is ever used, cap at 512×512 and treat as a last resort.

### 11.4 Procedural / primitive-geometry-first asset strategy

**No GLTF, no external 3D model downloads, no third-party asset license dependency —
full stop.** Every 3D object in the four R3F chapters is built at runtime from Three.js
primitives and code: it keeps the bundle asset-light (the whole point of a static-export,
no-CMS site), removes licensing risk, and produces a more distinctive visual language
than a generic asset-store GLTF.

- **Primitive-first geometry:** `BoxGeometry`, `CylinderGeometry`, `CapsuleGeometry`,
  `IcosahedronGeometry`, `TorusGeometry`, `PlaneGeometry`, composed via grouping rather
  than boolean CSG.
- **Extrude the existing SVG paths:** the character/props are already hand-coded flat SVG
  (§13). Reuse the same path data with `THREE.ExtrudeGeometry` (shallow depth, 2–8 units)
  for any 3D prop with a 2D silhouette equivalent — producing a paper-cutout/diorama
  aesthetic, on-brand for "storybook, not dashboard," and technically free (one source of
  truth for silhouette art across DOM and R3F).
- **Toon shading over PBR:** `MeshToonMaterial`, 2–3 step gradient ramp, flat color fills —
  matches the illustrated line-art register of DOM chapters, cheaper than a PBR/IBL
  pipeline (skip `<Environment>` HDRI entirely; `<color attach="background">` plus one
  hemisphere + one directional light instead), and visually unifies 3D and SVG chapters.
- **Instancing for anything repeated:** books, orbs, stars, contribution-nodes each built
  once and drawn via `THREE.InstancedMesh`, per-instance transform/color computed from a
  small **seeded** pseudo-random utility (never `Math.random()` at render time) —
  deterministic output avoids React 19/Next 15 SSR hydration mismatches.
- **Zero required texture downloads:** flat toon materials plus vertex/instance color
  cover every surface in scope; a future texture need is the exception that gets
  budgeted (§11.3), not a default tool.

### 11.5 Canvas mount/unmount and memory-cleanup under rapid navigation

Rapid Carousel clicking is a first-class test case, not an edge case: the latest click
always wins immediately, nothing queues.

- **Generation token on every transition.** `activeChapterId` changes bump a
  `transitionGen` ref in `useChapterTransition.ts`. Any async/delayed side effect (GSAP
  `onComplete`, a lazy-import promise) checks its captured generation against the current
  one before applying anything — a stale generation is a silent no-op.
- **No animation queue.** Every GSAP tween touching the camera rig or scene opacity uses
  `overwrite:"auto"` (or an explicit `.kill()` before the next). Three clicks in one second
  produce one continuous re-target toward the third destination, never three tweens
  playing back to back.
- **Exactly one live WebGL context, always.** Never instantiate a second `<Canvas>` even
  transiently — both scenes' content briefly coexist as sibling groups inside the same
  canvas (opacity/visibility crossfade), then the outgoing group disposes. Mobile Safari's
  WebGL context ceiling is low enough that a rapid-click bug creating contexts faster than
  GC reclaims them will visibly break the page (`WEBGL_CONTEXT_LOST`) — this must be
  designed out structurally, not caught later.
- **Per-scene disposal is explicit, not assumed.** Unmounting a scene component removes it
  from the R3F scene graph but does **not** free GPU memory — geometries, materials, and
  any shader uniforms must be disposed in that component's `useEffect` cleanup
  (`geometry.dispose()`, `material.dispose()`, `InstancedMesh`'s
  `instanceMatrix`/`instanceColor` buffers). A missing matching `.dispose()` call under
  `/three/scenes/` is a code-review blocker — this class of leak is the most common source
  of "silky smooth at click one, stuttering by click five."
- **Canvas lifecycle states** (`useCanvasLifecycle.ts`):

  ```
  cold ──(idle prefetch after Welcome paints)──> warm (opacity 0, off-screen)
  warm ──(first R3F chapter click)──────────────> active (visible, frameloop live)
  active ──(navigate to a DOM chapter)──────────> hidden-alive (opacity 0, pointer-events:none,
                                                    frameloop "demand"/no invalidate — zero
                                                    GPU cost, last R3F scene still resident)
  hidden-alive ──(re-enter an R3F chapter, any time)──> active   [instant, no re-warm cost]
  hidden-alive ──(> 45s continuously on DOM chapters)──> disposed (renderer.dispose(),
                                                    forceContextLoss(), unmounted)
  disposed ──(re-enter an R3F chapter)──────────> warm → active [pays the one-time cost
                                                    again, masked by the transition budget]
  ```

  `hidden-alive` is intentionally **not** `display:none` — toggling `display` on a live
  canvas forces relayout/repaint in some browsers on reappearance; use `opacity:0;
  position:absolute; z-index:-1; pointer-events:none` and gate rendering through the R3F
  `frameloop`/`invalidate` mechanism instead.
- **`prefers-reduced-motion` synergy:** honoring §14.1's rule (transitions collapse to
  cross-fades, idle motion stops) also directly reduces GPU/battery cost — the
  accessibility fallback and the performance fallback are the same code path.

### 11.6 Named risks

| Risk | Where it bites | Mitigation |
|---|---|---|
| Shader/context creation jank on first R3F entry | A visitor's first click lands directly on an R3F chapter without ever passing through its neighbor first (e.g. a hash deep-link straight to Contact) | Prefetch fires via the neighbor-adjacency rule (§10.4/§11.2) as soon as an R3F chapter becomes an immediate Carousel neighbor of the active chapter, not a blanket fixed delay after Welcome's first paint; for the direct-deep-link case where no neighbor visit ever occurred, it's acceptable to eat the cost inside the existing transition budget as a last resort, but must be profiled on real mid-tier hardware |
| WebGL context exhaustion from rapid clicking | iOS Safari especially — symptom is context loss/black canvas | Single persistent canvas (§11.2) + hard "never a second `<Canvas>`" rule (§11.5) design this out structurally |
| GPU memory leak from un-disposed scene geometry | Session degrades over time — fine at click #1, stuttering by click #10 | Disposal checklist (§11.5) is a code-review blocker |
| Thermal throttling from sustained Bloom on mobile | A visitor lingering on Contact's starfield sees FPS decay over time | `PerformanceMonitor`-driven ladder (§11.3) reacts to live FPS, catching thermal decay mid-session, not just slow devices at start |
| `Math.random()` inside instanced-transform generation | React 19 SSR/static-export hydration mismatch, non-reproducible builds | Seeded deterministic PRNG for all per-instance variation (§11.4) |
| Postprocessing stacked without a ceiling | A future chapter "just adding one more pass" quietly doubles GPU cost | Hard rule: one postprocessing pass, ever, anywhere — enforced at PR review |

---

## 12. Performance Engineering & Runtime Discipline

This is a single-route, animation-dense, canvas-heavy site — the combination that
normally turns "award-winning" portfolios into 8-second-to-interactive disasters on a
mid-range phone. The guiding rule: **nothing loads, animates, or renders unless it is
either (a) needed for the very first paint, (b) currently the active chapter, or (c) the
tab is actually visible.** Everything else is unmounted, paused, or not yet fetched. This
section governs bundle/font/asset budgets and the visibility/battery gating layer; the
code-splitting mechanism itself and the per-chapter renderer decision are specified once
in §10.4 and §11.1 respectively — this section only adds the numbers and the runtime
discipline on top.

### 12.1 Bundle size budget per chapter

Because there is only one route, code-splitting is manual, per chapter, keyed off
`activeChapterId` (mechanism: §10.4). Budget table (gzipped, chapter-owned code only,
excludes shared chunks):

| # | Chapter | Render mode | Chapter JS | Chapter assets |
|---|---|---|---|---|
| 1 | Welcome | DOM/SVG | 8 KB | 6 KB (inline-critical, §12.3) |
| 2 | Journey | DOM/SVG | 18 KB | 20 KB |
| 3 | Experience | DOM/SVG | 20 KB | 18 KB |
| 4 | Projects | R3F | 45 KB | 35 KB |
| 5 | Engineering | DOM/SVG | 16 KB | 15 KB |
| 6 | GitHub | R3F | 40 KB | 25 KB |
| 7 | Writing | DOM/SVG | 15 KB | 18 KB |
| 8 | Learning | R3F | 42 KB | 30 KB |
| 9 | Life | DOM/SVG | 17 KB | 20 KB |
| 10 | Gallery | DOM/SVG | 22 KB (lightbox logic) | photos budgeted separately, below |
| 11 | Contact | R3F | 38 KB | 20 KB |

**Shared chunks** (loaded once, cached for the session): App shell (`layout.tsx`,
`Stage.tsx`, `StoryCarousel.tsx`, `StoryCard.tsx`, hooks, Framer Motion core, GSAP core,
fonts) ≤140 KB gzip. R3F runtime (`three` + `@react-three/fiber` + hand-picked Drei
helpers — import individually, **never** `import * as drei`, measured to add 200KB+ of
dead code otherwise) ≤150 KB gzip, fetched once on the first 3D-chapter visit.

Realistic worst case (all 11 chapters visited in one session), summed directly from this
section's own table rather than restated separately: **140 (shell) + 150 (R3F runtime,
once) + 165 (four 3D scenes: 45+40+42+38) + 116 (seven DOM/SVG scenes: 8+18+20+16+15+17+22)
≈ 571 KB gzip JS across the entire visit**, arriving incrementally, browser-cached after
first fetch. Initial load (Welcome only) stays at **≈148 KB gzip JS**, comfortably inside
the ~170 KB "good" baseline for interactive sites.

**Enforcement:** a `size-limit` (or `@next/bundle-analyzer` + a CI assertion script) check
fails the build if any chapter chunk exceeds its budget row by more than 10%. A chapter
that wants a heavier prop/particle system optimizes elsewhere in the same chunk or gets
its budget explicitly revised — never silent creep.

Gallery photos are real raster assets, outside the JS/SVG budget: served through a custom
static-export-compatible `next/image` loader (App Router static export can't use the
default on-demand Image Optimization API, so a custom loader or pre-generated responsive
`srcset` at build time is required), AVIF/WebP, sized to container, capped at **~100 KB
per photo**, fetched only once Gallery mounts.

### 12.2 Font loading strategy

Two families, both variable, both self-hosted via `next/font/local` (or
`next/font/google` with automatic self-hosting) — no runtime request to a font CDN ever
fires:

| Role | Family (variable) | Axes used | First appears |
|---|---|---|---|
| Display/storytelling (chapter titles, Contact's "credits roll") | Editorial serif (e.g. Fraunces) | `wght` 400–600, `opsz` | Welcome — first paint |
| Body/UI (story copy, carousel labels, buttons) | Humanist sans (e.g. General Sans/Inter) | `wght` 400–650 | Welcome — first paint |

One `.woff2` per family covers the full weight range across all 11 chapters, vs. 5–6
static-weight files per family — roughly 250–300 KB of static weights collapsed to
~90–120 KB of two variable files, subset to `latin` (+`latin-ext` only if needed), unused
glyphs stripped.

- `next/font/local` generates `font-display: swap` and an adjusted fallback font
  (`ascent-override`/`descent-override`/`size-adjust`) matching the webfont's metrics —
  the actual CLS mitigation. Text renders instantly in the metric-matched fallback at the
  correct box size, then swaps with effectively zero reflow.
- Only weights visible in Welcome's first paint are preloaded (`preload:true`). A heavier
  display weight used only in Contact's closing typography is **not** preloaded — it rides
  in on Contact's own dynamic chunk.
- No FOIT anywhere: `swap` + metric override means there is never a moment of invisible
  text, which also protects against a false LCP regression.

### 12.3 Inline-critical vs. lazy-loaded SVG

**Inline-critical** (compiled via `@svgr/webpack`, shipped inside initial JS/HTML): the
11 Carousel icons in `StoryCard.tsx` (~1–2 KB raw each); Welcome's character base idle
pose and title-card ornament (LCP-adjacent, must not be behind a second request). Hard
ceiling: **4 KB raw (post-SVGO) per inlined illustration** — inlined SVG loses independent
HTTP caching, so anything larger doesn't belong here regardless of how "critical" it
feels.

**Lazy-loaded** (bundled into the owning chapter's dynamic chunk, or fetched standalone
and browser-cached): chapter-specific background illustrations and `FloatingObjects.tsx`
prop sets; alternate character poses (§13) live with the chapter that uses them; Gallery's
line-art/photo treatments.

All SVGs pass through SVGO (`removeViewBox:false` — the viewBox must survive for
responsive `clamp()` sizing per §8.3; metadata/editor cruft stripped), targeting 40–60%
size reduction from raw export. A lazy illustration resolving mid-transition fades in
(`opacity` only, `cubic-bezier(0.16,1,0.3,1)`, ~250ms) inside a container already sized by
the Stage's fixed grid — it never pops in at a different size, keeping CLS at zero (§12.4).

### 12.4 Core Web Vitals & Lighthouse targets

| Metric | Target | Rationale |
|---|---|---|
| LCP | <1.8s (aim <1.2s) | Static export, edge-hosted; Welcome's title/character SVG is inline-critical, pre-rendered. |
| INP | <200ms (aim <100ms) | Carousel clicks trigger the §7 orchestration — that work must stay off the main thread's critical path. |
| CLS | <0.02 (aim ≈0) | Structurally close to zero by design (below). |
| TBT | <200ms | Guards INP; watch specifically during first 3D-chapter mount (WebGL context init + shader compile is the realistic long-task source). |
| Lighthouse Performance (desktop) | ≥95 | Default single-navigation audit measures the Welcome-only bundle (~148 KB), since 3D chapters are behind interaction-gated dynamic imports. |
| Lighthouse Performance (mobile, default throttling) | ≥80 | Slightly lower, acknowledging mobile CPU throttling plus font/illustration payload at 4x-slowdown. |

**Why CLS is structurally low here.** No document scroll, no scroll-snap, no
below-the-fold injected content, no ads, no cookie banner, no late nav — the largest
real-world CLS source (scroll-triggered reflow) doesn't exist here by construction. The
Stage/Carousel split is a fixed grid on `position:fixed; inset:0` (§4), so the layout box
for both regions is stable before any content resolves.

| Remaining risk | Mitigation |
|---|---|
| Web font swap reflows text | `next/font` metric-matched fallback (§12.2) — ~0 box-size delta |
| Lazy chapter illustration shifts siblings | Containers pre-sized (`aspect-ratio`/explicit dims from `content/chapters.ts`) before the asset arrives |
| R3F `<Canvas>` mounting after its DOM wrapper | `next/dynamic`'s `loading` fallback (`StagePlaceholder`/`SceneCurtain`, §10.4) is identical-dimension to the real canvas |
| Carousel card raise/highlight | `transform`/`box-shadow` only, never `margin`/`width`/`height` |
| Gallery lightbox open/close | `position:fixed` overlay, never inserted into normal flow |

Given the single-viewport, no-scroll architecture, a CLS regression above 0.02 is a bug,
not an acceptable trade-off.

**Measurement approach:** a plain single-navigation Lighthouse run only tells the truth
about the Welcome cold-load. Two additional passes are required: a Lighthouse **User
Flow** (timespan mode) capturing a Carousel click into a 3D chapter, for real INP/TBT on
the R3F-mount case; and a **snapshot** audit mid-3D-chapter to catch GPU-driven long tasks
a cold-load trace would miss.

### 12.5 Battery & GPU discipline

Every animating primitive — R3F render loops, GSAP ambient timelines, Framer `repeat:
Infinity` idle loops, mouse-parallax listeners — subscribes to a single central gate:

```
hooks/usePageVisibility.ts   — wraps document.visibilitychange
hooks/useActiveChapter.ts    — exposes activeChapterId
hooks/useAnimationGate.ts    — shouldAnimate = isVisible && isActiveChapter && !prefersReducedMotion
```

- **R3F render loops.** Every `<Canvas>` defaults to `frameloop="demand"` — renders only
  on `invalidate()`. Chapters with genuine ambient motion (GitHub's particles, Learning's
  orbs) switch to `"always"` only while `useAnimationGate()` is true, forced to `"never"`
  the instant the tab hides or the user navigates away. Per §11.5, non-active chapters
  fully **unmount** their canvas content rather than merely pausing it — never more than
  one live WebGL context in memory, which matters more for battery/thermal than
  frameloop tuning alone.
- **GSAP.** On `visibilitychange → hidden`: `gsap.globalTimeline.pause()`
  (`gsap.ticker.sleep()`), covering every active timeline including ambient drift loops
  without tracking them individually. Resume on `visible` with
  `gsap.globalTimeline.resume()` — the ticker's lag-smoothing prevents a visible
  catch-up jerk.
- **Framer Motion.** Idle loops (breathing/blink, carousel icon bob) use `animate` with
  `repeat: Infinity` gated by `useAnimationGate()` — the component switches between the
  looping variant and a frozen resting variant, or unmounts when gated off. This must be
  explicit: Framer's own off-screen pause optimization gives nothing for free here,
  since nothing is ever off-screen in a single fixed viewport.
- **Mouse-parallax.** The ambient parallax listener is rAF-batched (never reacting to raw
  `mousemove`) and **removed**, not just no-op'd, on `hidden`; reattached on `visible`.
- **Mobile GPU ceiling.** `<Canvas dpr={...}>` capped at `Math.min(devicePixelRatio,
  1.5)` — on a 3x-DPR device, roughly a 4x fragment-shader cost reduction for a visually
  marginal sharpness difference, applied uniformly across all four 3D chapters.
- **Reduced motion.** `prefers-reduced-motion` folds into the same `useAnimationGate()`
  check, not a separate code path — idle/ambient loops stop exactly the way they do for a
  hidden tab, satisfying accessibility (§14.1) and battery discipline with one mechanism.

---

## 13. Character Illustration

A single illustrated character (Omkar) appears in every chapter's Stage. He is not a
static mascot — he is built as a **componentized paper-doll rig**: one shared skeleton
with swappable head, body, prop, and expression layers, so adding/adjusting a pose is a
matter of composing existing parts rather than commissioning a whole new drawing each
time.

### 13.1 Design philosophy

- Editorial, hand-drawn **storybook illustration** — modern picture-book character design
  (flat vector, warm ink linework, two-tone shading) — never a corporate "isometric
  avatar" or a flat-design SaaS mascot.
- One character, one outfit, one coherent line-and-color system used everywhere. Variety
  across chapters comes from **pose + prop + expression + scene dressing**, never from
  redesigning the character.
- Likeness lives in a small, isolated set of layers (face/hair/skin, §13.5) so it can be
  swapped in later without touching the rig, poses, or any chapter code.

### 13.2 Componentized rig architecture

Independent, absolutely-positioned SVG layers composed inside one root
`<svg viewBox="0 0 480 720">` (a 2:3 portrait canvas), authored against a shared set of
pivot anchors so any layer can be swapped without breaking alignment with any other.

**Shared anchor coordinates** (native viewBox units, in `rig-anchors.ts`, never redefined
per-layer):

| Anchor | Coordinates | Purpose |
|---|---|---|
| `MIRROR_AXIS` | x=240 | Vertical symmetry — arms mirror across this |
| `NECK` | (240,196) | Head/hair pivot |
| `SHOULDER_L`/`SHOULDER_R` | (196,224)/(284,224) | Arm pivot |
| `HIP` | (240,400) | Torso/legs pivot |
| `HAND_REST_L`/`HAND_REST_R` | (170,430)/(310,430) | Arms-down resting hand |
| `HAND_FORWARD_L`/`HAND_FORWARD_R` | (210,360)/(270,360) | Hands holding a prop |
| `HAND_RAISED` | (330,200) | Wave gesture height |
| `HAND_REACHUP` | (280,90) | Overhead reach |
| `FOOT_L`/`FOOT_R` | (200,700)/(280,700) | Ground contact baseline |

**Component tree** (code in `/components/character`, data in `/content/character.ts` per
§9):

```
CharacterRig.tsx    — root <svg>; composes layers from pose/expression/prop props
rig-anchors.ts      — the anchor table above, typed constants
layers/
  Head.tsx          — face silhouette + fixed identity features (jaw, ears)
  Hair.tsx          — independent of Head so hairstyle stays constant across tilts
  Expression.tsx    — eyes/brows/mouth only, variant-switched (§13.4)
  Torso.tsx         — variant: standing | walking | leaning-work | seated
  Arm.tsx           — variant: rest | raised-wave | forward-reach | open-out | point |
                      cross-strap | reach-up — single component, mirrored via
                      side="left"|"right" around MIRROR_AXIS instead of authoring pairs
  Legs.tsx          — variant: standing | stride | seated-tuck
  Accessories.tsx   — glasses etc. — identity-constant, always rendered
  props/            — Laptop.tsx, Satchel.tsx, Wrench.tsx, Pencil.tsx — anchored at HAND_FORWARD_*
```

Only **4 torso/leg families** (`standing`, `walking-stride`, `leaning-work`, `seated`) are
needed for all 11 chapters — differentiation is carried mostly by arm gesture, prop, and
expression, deliberately cheap to vary. `Arm.tsx` needs only **7 authored shape variants**,
each usable on either side via mirror transform, rather than 14 hand-authored pairs. Pose
changes are driven entirely by props on `<CharacterRig pose expression prop />`; a new
pose for a future chapter is: pick existing variants, or author exactly one new variant of
exactly one layer.

### 13.3 Style guide

Canvas & line weight (native `480×720` viewBox units, `stroke-linecap`/`linejoin: round`
throughout):

| Element | Stroke width | Color |
|---|---|---|
| Outer silhouette | 5 units | Warm black `#2B2420`, 100% |
| Interior seams | 3 units | Warm black `#2B2420`, 85% |
| Fine detail (lashes, folds, hair strands) | 1.5 units | Warm black `#2B2420`, 70% |

**Palette** (each base tone paired with one flat shadow tone — no gradients, no filters):

| Role | Base | Shadow pair |
|---|---|---|
| Cream (paper base) | `#F5EFE1` | `#E4DAC2` |
| Off-white (highlight) | `#FAF6EC` | `#EFE7D4` |
| Soft beige (default skin) | `#E8DCC5` | `#CBB893` |
| Muted yellow (accent/glow) | `#E3B23C` | `#C4932A` |
| Terracotta (clothing accent) | `#C1633D` | `#9C4A2C` |
| Forest green (secondary clothing/env) | `#3F5A45` | `#2E4433` |
| Deep blue (night scenes, denim) | `#28405A` | `#1B2E42` |
| Warm black (ink, never pure `#000`) | `#2B2420` | — |

**Shading:** flat **two-tone cel shading** only — base fill plus one flat shadow fill
where a form turns from the implied light source; no drop shadows/blur filters on
character layers, keeping cross-fades (§7) cheap regardless of how many layers are
mounted. Paper grain (~4–6% opacity noise) is applied once at the Stage background level,
never per illustration layer. **Optional rim light** for strong-directional-light
chapters (Welcome dawn, Contact moonlight): a 1.5–2 unit lighter offset stroke, authored
as a literal extra path, never a filter.

### 13.4 Minimum viable pose & expression set (v1)

**Expressions** (6 total — eyes: filled ellipse + highlight dot, brows: one curved
stroke, mouth: one stroke path, so a later likeness pass only touches a handful of simple
paths):

| Expression | Read | Used in |
|---|---|---|
| `warm-smile` | Soft, direct, welcoming | Welcome, Gallery, Contact |
| `focused` | Slightly lowered brow, on-task | Projects, Engineering, GitHub |
| `determined` | Relaxed mouth, steady gaze | Journey, Experience |
| `thoughtful` | Eyes drifted up-left, closed mouth | Writing |
| `curious` | Raised brows, wide eyes | Learning |
| `joyful` | Open smile, crinkled eyes | Life |

**Chapter → pose composition table.** Left and right arms are chosen independently from
the same 7-variant `Arm.tsx` set (e.g. Journey: left=cross-strap, right=rest), so the
rig's theoretical combinatorial design space is 4 torso families × 7 left-arm variants ×
7 right-arm variants × 6 expressions × 4 props = 8,232 possible combinations. Only the 11
below are ever composed and shipped — this is the entire, closed v1 pose surface, not the
full combinatorial space:

| Chapter | Torso/Legs | Left arm | Right arm | Expression | Prop |
|---|---|---|---|---|---|
| Welcome | standing | rest | raised-wave | warm-smile | none |
| Journey | walking-stride | cross-strap | rest | determined | satchel |
| Experience | standing | rest | rest | determined | none |
| Projects | leaning-work | forward-reach | forward-reach | focused | laptop |
| Engineering | leaning-work | forward-reach | forward-reach | focused | wrench |
| GitHub | seated | forward-reach | forward-reach | focused | laptop |
| Writing | seated | rest | forward-reach | thoughtful | pencil |
| Learning | standing | rest | reach-up | curious | none (the knowledge orb is an independent floating object, not hand-held) |
| Life | standing | open-out | open-out | joyful | none |
| Gallery | standing | rest | point | warm-smile | none |
| Contact | standing | rest | raised-wave | warm-smile | none |

This is a fixed, closed v1 matrix — the rig supports arbitrary recombination in code, but
only these 11 exact combinations ship, to avoid open-ended QA surface.

**Staging within the Stage:** each pose preset carries a `stagePosition:{xPct}`
(percentage, not pixels, so it survives §8's responsive rules) — e.g. Welcome/Contact
centered at `xPct:50`, Journey offset to `xPct:35` for the path/milestone graphics.
Character height follows §8.3's Stage content-scaling formula exactly
(`clamp(220px, 55dvh, 640px)`, anchored to the per-chapter `compactFocalPoint`) — not
redefined or re-derived here. On mobile (§8.1's 78/22 split) the rig may crop below
`FOOT_L`/`FOOT_R` and rely on torso+gesture+expression to carry the read.

### 13.5 Reference photo → illustrated likeness pipeline

A **one-time, offline design step** performed by the illustrator before authoring path
data — not a runtime image-processing feature, introducing no backend/AI dependency.

1. **Photo intake:** front-facing or 3/4 view, even/neutral lighting, plain background
   preferred, ≥1024px on the short side. A profile shot and a half-/full-body shot are
   nice-to-have reference, not required.
2. **Feature-extraction checklist** (the illustrator's "character bible"): face shape;
   skin tone (sample 3 points, average, clamp to HSL saturation 25–40% / lightness 55–75%
   nudged toward the beige/terracotta family — keeping the result inside the flat
   warm-paper system rather than a jarring photorealistic RGB); hair color (same clamp)
   and style; eye color/shape, eyebrow thickness/shape; facial hair presence/style;
   glasses yes/no + frame shape; build (informs `Torso.tsx` width, not skeletal
   proportions).
3. **Proportion system is fixed independent of the photo** — a stylized **1:5.5
   head-to-body ratio** (more heroic/legible than realistic ~1:7.5, less exaggerated than
   chibi ~1:3), baked into the anchor table. The photo informs coloring and facial
   features only, never body proportions.
4. **Redraw, don't filter.** The face is traced/redrawn into `Head.tsx`/`Hair.tsx`/
   `Expression.tsx`/skin-tone slots using the checklist as the brief. The rig skeleton,
   anchors, and every pose/prop/torso variant are untouched — likeness is entirely
   contained in those 4 layer types.
5. **Validation pass:** render the derived head across the rig's supported head-tilt
   range and confirm likeness still reads off-axis. Mitigation: cap head rotation to
   **±12°** in `Head.tsx` — no profile turns in v1, documented as a hard limit in
   `rig-anchors.ts`.

### 13.6 Fallback plan — the Generic Storyteller character (never blocks the build)

The photo has not been received as of this writing (see §15). The project ships without
waiting for it:

- A **"Generic Storyteller"** character uses the identical rig, anchors, style guide, and
  pose matrix, with tasteful, non-corporate default features — glasses on by default (a
  specific frame reads as "a person," not a faceless icon), a simple cropped hairstyle,
  default palette values (skin `#E8DCC5`, hair `#2B2420`). Deliberately not called an
  "avatar" anywhere in this document — §13.1 already flags that exact word as the
  corporate/SaaS-mascot failure mode this illustration system is built to avoid; the
  mechanism (shared rig/anchors/style guide) is on-brand even though the word isn't.
- All of it lives in exactly one typed file:

  ```ts
  export const characterFeatures = {
    skinTone: "#E8DCC5",
    hairStyle: "short-cropped", // "short-cropped" | "medium-wavy" | "curly-crop" | "long-tied"
    hairColor: "#2B2420",
    facialHair: "none",         // "none" | "stubble" | "beard"
    glasses: true,
    build: "average",           // "slim" | "average" | "broad"
  } satisfies CharacterFeatures;
  ```

- **This file plus the 4 likeness-bearing components are the entire seam.** When the real
  photo arrives: edit `characterFeatures`, redraw `Head.tsx`/`Hair.tsx`/`Expression.tsx`/
  skin fill — nothing in the 11 chapters, pose matrix, animation code, or rig anchors
  changes. This is the concrete guarantee the illustration workstream is decoupled from
  the photo dependency.
- Corollary: keep the generic face as iconic/simple as §13.4's stroke counts imply — an
  over-detailed generic face costs more to unwind later.

### 13.7 Animation & performance notes

- **Idle motion** (breathing/sway at rest): GSAP, `power1.inOut`, 2.4s, yoyo/repeat `-1`,
  ±2–3° torso rotation, ±1.5% translateY — subtle, ambient. Fully disabled (static pose)
  under `prefers-reduced-motion` (§14.1).
- **Expression/pose layer swap:** cross-fade opacity 0→1 over **220ms**,
  `cubic-bezier(0.22,1,0.36,1)`, starting ~150ms into the Enter phase of §7's transition —
  rides inside the existing 900ms–1.3s budget, never a separate slow morph.
- **Limb changes prefer transform, not path morphing:** animate rotation/translation on
  the rigid sub-group hung off its pivot anchor for pure-angle differences (idle sway,
  minor tilt); only swap the whole `Arm.tsx`/`Torso.tsx` variant when limb geometry
  actually differs. Path-tween morphing between dissimilar shapes is avoided entirely —
  fragile and expensive across 11 chapters' worth of cross-fades.
- All layers are inline SVG React components (no raster assets) — tiny character bundle,
  Tailwind/Framer Motion drives layer opacity/transform directly, no extra requests.

### 13.8 Risks & mitigations

| Risk | Mitigation |
|---|---|
| Likeness reads correctly at rest but degrades at extreme head angles | Hard-capped ±12° head rotation; no profile poses in v1 |
| Reference photo never arrives or arrives late | §13.6's fallback ships as the v1 default; likeness becomes a scoped, isolated patch (4 files + 1 content object), never a blocking dependency |
| An over-detailed placeholder face makes the eventual likeness swap expensive | Style guide enforces iconic, low-stroke-count features regardless of generic vs. real face |
| Photo-sampled skin/hair RGB clashes with the warm-paper palette | Mandatory HSL clamp step (§13.5 step 2) before any color is used |
| Per-layer shading (gradients/filters) on a character cross-fading across 11 chapters becomes a jank source | Flat two-tone cel shading only on the character; texture/grain confined to the Stage background (§13.3) |
| Reusing only 4 torso families across 11 chapters reads repetitive | Accepted by design — differentiation via gesture + prop + expression + dressing, the same economy a picture book uses |
| Rig flexibility invites scope creep into an open-ended combinator | §13.4's table is the closed, final v1 matrix — exactly 11 pinned combinations ship; recombination is a capability of the code, not a shipped feature |

---

## 14. Accessibility Specification

Conformance target: **WCAG 2.2 Level AA**, audited as testable acceptance criteria, **with
one explicitly documented, scoped exception** (SC 1.4.4 Resize Text / SC 1.4.10 Reflow,
§14.7) rather than an unqualified blanket claim — see §14.7 for what that exception is and
why it exists. This product deliberately has no navbar, no routing, no page scroll, so
several standard "just use semantic HTML and page navigation" answers don't apply — the
Stage/Carousel model substitutes its own equivalents for focus management, landmark
structure, and navigation announcement.

### 14.1 `prefers-reduced-motion` — mechanism and per-chapter reduction table

**Mechanism (global, not opt-in per chapter):**
- Root layout wraps the app in Framer Motion's `<MotionConfig reducedMotion="user">` —
  strips transform/scale/rotate-based animation from every `motion.*` element when the OS
  setting is on, while still permitting opacity transitions, with no per-component
  flag-checking for Framer-driven UI.
- `MotionConfig` does **not** reach GSAP or R3F. `lib/transitions.ts` wraps every GSAP
  timeline in `gsap.matchMedia()` with two contexts — `"(prefers-reduced-motion:
  no-preference)"` and `"(prefers-reduced-motion: reduce)"` — exposed as one shared helper,
  `runChoreography(fullTimeline, reducedTimeline)`, so no chapter author can ship a GSAP
  timeline that silently ignores the setting.
- `hooks/usePrefersReducedMotion.ts` (wrapping `matchMedia` + `change` listener) feeds R3F
  components directly, since Drei/R3F have no built-in awareness of the setting.

**Global collapse rules** (apply everywhere unless the per-chapter table below overrides):

| Full-motion behavior | Reduced-motion replacement |
|---|---|
| Chapter transition choreography (§7, 900ms–1.3s) | Single opacity crossfade, 180ms, linear — no slide/scale/parallax |
| Camera pans / R3F camera lerp | Instant cut to the destination framing |
| Floating/idle motion (drift, bob, breathing, blink) | Motion stopped; element at its resting frame |
| Mouse-move parallax layers | Disabled; layers pinned at neutral offset |
| Staggered/typewriter text reveal | Full text rendered immediately, no per-char/line delay |
| Spring-physics pop-ins (cards, panels, CTAs) | Instant show/hide, no overshoot |
| Ambient looping background video | Does not autoplay; static poster frame with a visible manual play control |
| R3F auto-rotate / continuous particle systems | Disabled; single static frame; user-initiated drag-orbit still permitted |

**Per-chapter table:**

| Chapter | Full-motion behavior | Reduced-motion replacement |
|---|---|---|
| Welcome | Dawn gradient drift; breathing/blink loop; title stagger+scale intro; dust motes | Gradient freezes; static idle pose; title fades once (180ms, no stagger/scale); motes removed |
| Journey | Camera pans the road; milestones spring in sequence; walk-cycle | Camera cuts directly per milestone; milestones render simultaneously; character shown as a static standing pose per milestone |
| Experience | Mouse-parallax rooms; push transition; light flicker | Parallax disabled; plain crossfade; fixed lit state |
| Projects | Terminal flicker/scanline; auto-typing console; bench idle-bob; particle/steam drift; camera dolly | Flicker stopped; console text renders in full immediately; props at rest; sparse static particles; dolly replaced by instant cut |
| Engineering | Tools sway; dust/light-ray animation; assembly build-up | Sway/ray motion stopped; assembly collapses straight to the finished static illustration |
| GitHub | Ambient activity pulses; blinking terminal cursor; slow orbital camera drift; drag-to-scrub through years | Pulses → static snapshot; cursor solid; orbital drift disabled, camera holds a fixed frame; drag-to-scrub remains available since it's user-initiated (not ambient auto-advance) — keyboard/AT users reach the same year-scrub and repo-highlight actions via `SceneAccessibleOverlay` (§14.2), never a timed autoplay |
| Writing | Papers drift/flutter on hover; excerpt types on | Papers at rest; hover = simple border/opacity highlight; excerpt renders in full immediately |
| Learning | Orbs drift/orbit; hover-expand with spring | Orbs frozen in a static constellation layout; expand is instant show/hide; auto-rotate disabled |
| Life | Ambient particles; objects float; background parallax | Particles removed; float stopped; parallax disabled |
| Gallery | Lightbox scale+fade spring; tile hover-raise/tilt; optional autoplay | Lightbox → plain opacity crossfade ≤200ms; hover → static border highlight; **autoplay disabled outright** (also satisfies SC 2.2.2 independent of the OS setting) |
| Contact | Star drift; character look-outward animation; CTA stagger/spring | Star field freezes on one frame; character shown in final static pose; CTAs appear together via one opacity fade |

**Risk call-out:** GSAP timelines do not auto-respect `prefers-reduced-motion` the way
Framer's `MotionConfig` does — the single most likely place for a silent regression (a
new GSAP camera move shipped without a reduced variant). Route all GSAP choreography
through `runChoreography()` so no code path can bypass the check; add it to the audit
checklist (§14.6).

### 14.2 Screen-reader experience of chapter changes

No page navigation exists, so the Stage/Carousel pair is modeled explicitly on the
**WAI-ARIA "Tabs" pattern, manual activation**: the Story Carousel is `role="tablist"`,
each card is `role="tab"` with `aria-selected`, the Stage is the single `role="tabpanel"`
whose content swaps as the selected tab changes. Manual activation (arrow keys move focus
among tabs but do **not** change chapter; Enter/Space activates) is deliberate —
automatic activation would fire a full ~1s transition and 3D scene mount on every
arrow-key tap while someone is just browsing names.

**`aria-live` announcer:** a single visually-hidden node, once in the root layout, never
remounted: `<div aria-live="polite" aria-atomic="true" className="sr-only"
id="chapter-announcer" />`, managed by `components/a11y/ChapterAnnouncer.tsx`. Updates on
**activation** (not roving focus movement), independent of the transition's 900ms–1.3s
duration. `polite` (not `assertive`) so it queues rather than interrupts. Template:
`"Chapter {order} of 11: {label} — {srSummary}"`, sourced from a new `srSummary` field
(≤~110 chars) added to each chapter's `content/chapters.ts` entry. Examples: Welcome —
*"Chapter 1 of 11: Welcome — Where this story begins, and who's telling it."* Projects —
*"Chapter 4 of 11: Projects — A tour of things I've built, told as experiments on a
workbench."* Contact — *"Chapter 11 of 11: Contact — The end of the story, and how to
reach me."* `document.title` also updates on activation (`"{label} — Omkar"`) via
`useActiveChapter.ts` — no new route, just tab-chrome text, giving screen-reader users a
reliable orientation cue a normal SPA would get free from routing.

**Focus management on chapter switch:** per the Tabs pattern, **focus stays on the
activated tab** in the Carousel — it does *not* jump to the new chapter's heading. Forcing
a focus jump to `<h1>` on every change (the common "SPA route change" advice) would fight
the tablist model and disorient a keyboard user deliberately arrowing through 11 chapters.
Flagged explicitly so a future contributor doesn't reintroduce it. A visually-hidden
**skip link** (`components/a11y/SkipLink.tsx`, "Skip to chapter stage") is the first
focusable element, visible on focus, moves focus directly into the Stage `tabpanel`. The
Stage wrapper is `role="tabpanel"`, `aria-labelledby="tab-{chapterId}"`, `tabIndex={0}`,
reachable with one `Tab` from the active tab or via the skip link, with the site's
standard focus-ring treatment (§14.4) shown, never suppressed.

**Logical reading order of Stage content** (DOM order, independent of the visual
background/midground/foreground z-index stack, §4): (1) chapter heading (`<h1>` — the
previous chapter's has already unmounted via `AnimatePresence`, so never more than one on
the page); (2) chapter story copy; (3) in-scene interactive props/Stage markers in the same
order they read visually; (4) chapter CTAs last (Contact's fixed order: Let's Talk /
Resume / GitHub / LinkedIn / Email); (5) purely decorative layers (floating objects,
ambient particles, the character when not itself discussed by copy) are
`aria-hidden="true"` and out of tab order (`tabIndex={-1}` if otherwise focusable).

**3D (R3F) chapters as an accessibility black box:** a `<canvas>` exposes nothing to
assistive tech. Every R3F chapter must: mark the canvas `aria-hidden="true"` (or
`role="img"` with a one-line `aria-label` summarizing the scene — decorative framing, not
a content substitute); mirror every clickable 3D mesh as a real DOM control in
`components/stage/SceneAccessibleOverlay.tsx` — a `sr-only focus:not-sr-only` list of
buttons driving the same state setters as the canvas raycast handlers. This is real
duplicated interaction surface, budgeted explicitly into Phase 6 of §16, not an
afterthought once the 3D scenes already work for mouse users.

**Mobile/touch screen readers:** §8 makes swipe the primary touch navigation gesture. The
Carousel must be built from real `<button role="tab">` elements, not a bare `<div>` +
pointer-event drag surface, so VoiceOver/TalkBack's own swipe-to-next-element gesture
(which walks the accessibility tree) works identically to desktop keyboard navigation.

**Modal exception — Gallery lightbox:** unlike everything else in the Stage, the lightbox
is a true modal — focus trapped inside (`Tab`/`Shift+Tab` cycle only through Prev / Next /
Close), `Escape` closes it and returns focus to the originating thumbnail, and the rest of
the Stage gets `aria-hidden="true"`/`inert` while it's open.

### 14.3 Keyboard traversal — tab order and key bindings

Every interactive prop, card, and CTA must be reachable and operable with keyboard alone —
no exceptions for "it's a 3D scene" or "it's decorative-looking." Where a mouse-only
interaction exists, a keyboard-operable equivalent is mandatory
(`SceneAccessibleOverlay`, §14.2).

**Tab order:**

| # | Element | Behavior |
|---|---|---|
| 1 | Skip link ("Skip to chapter stage") | Hidden until focused; Enter jumps into the Stage `tabpanel` |
| 2 | Story Carousel `tablist` — one tab stop total | Roving `tabindex`: only the active tab has `tabindex="0"`; the other 10 reached via arrow keys |
| 3 | Stage `tabpanel` wrapper | Reached by the next `Tab` after the active tab, or via the skip link |
| 4+ | In-Stage interactive elements, reading order per §14.2 | Sequential `Tab` order; horizontal in-scene collections (Journey's roadside milestone signposts, Gallery's wall/table photo composition — never a uniform grid, §11.1 — and Projects' workbenches) share the same roving-tabindex + arrow-key *keyboard* model as the Carousel for traversal only; this is an accessibility interaction pattern, not a shared visual form — each retains its own bespoke §6.2 staging |
| — | Gallery lightbox (open) | Focus trapped to Prev / Next / Close only |

**Key bindings:**

| Key | Context | Action |
|---|---|---|
| `Tab`/`Shift+Tab` | Global | Standard forward/backward traversal |
| `←`/`→` | Focus in Carousel tablist or any in-scene roving-tabindex collection | Move roving focus one item; does **not** activate/change chapter |
| `Home`/`End` | Focus in Carousel tablist | Jump to first (Welcome)/last (Contact) tab |
| `Enter`/`Space` | Focused tab or in-scene prop/card/CTA | Activate: for a tab, triggers the transition + `aria-live` announcement, focus stays on the tab; for a prop/CTA, performs its action |
| `Esc` | Gallery lightbox open | Closes it, returns focus to the triggering thumbnail |
| `←`/`→` | Gallery lightbox open | Previous/next photo (scoped to the trapped modal focus) |
| `[`/`]` (optional, document-level) | Anywhere outside a modal | Previous/next chapter — a bonus "cinematic remote control" shortcut; guard against firing while a modifier key is held or during IME composition |

There is no text-input field anywhere (Contact is `mailto:`/`tel:`/social links only, per
§2 — no form, no backend), so the `[`/`]` shortcut needs no "am I typing" guard beyond
ignoring modifiers and IME composition.

Any future in-chapter horizontally scrollable *DOM* region — none is currently spec'd;
GitHub's activity view is an R3F constellation reached via drag-scrub plus
`SceneAccessibleOverlay` (§14.2), never a DOM list, so it deliberately does not read as a
dashboard — should it ever exist, it should pair `overflow-x` with **visible Prev/Next
buttons** rather than a bare `overflow-x:auto` div, since buttons are a cheaper, more
robust guarantee of keyboard access than re-implementing arrow-key scroll handling per
instance. Note §8.3 explicitly permits horizontal drag/scroll for the Carousel strip
itself — only *document* scroll is banned anywhere.

### 14.4 Color-contrast plan for text on illustrated backgrounds

**Targets (WCAG 2.2 AA):** body/story copy (16–18px regular) ≥4.5:1 (SC 1.4.3); large
text (≥24px regular or ~19px bold — titles, big display) ≥3:1; non-text UI (button
borders, focus rings, icon glyphs) ≥3:1 (SC 1.4.11). Stretch target (not the compliance
bar): ≥7:1 where achievable, plus an APCA `Lc ≥ 60` design-time gut-check for body text on
the busiest illustrated panels.

**Why a scrim is mandatory, not optional polish:** backgrounds are hand-illustrated,
textured, non-uniform — there is no single background color to compute contrast against,
and no guarantee a future art pass won't put a high-detail object behind an existing text
block. Contrast is guaranteed by a controlled layer *between* text and art
(`components/stage/ScrimPanel.tsx`), never by hoping the illustration stays light/dark
enough:

```
background: linear-gradient(180deg, rgba(28,20,13,0) 0%, rgba(28,20,13,0.62) 35%, rgba(28,20,13,0.72) 100%);
backdrop-filter: blur(12px) saturate(115%);
```

(direction flips to match composition; centered title cards use a flat
`rgba(24,17,12,0.55)` rounded card instead). `backdrop-filter` guarantees the contrast for
*any* layer behind it — SVG, ambient video, or an R3F canvas. Belt-and-suspenders
`text-shadow`: body `0 1px 3px rgba(15,10,6,0.55), 0 1px 1px rgba(15,10,6,0.4)`; large
titles `0 2px 12px rgba(15,10,6,0.5)`.

**Worked example** (lightest warm-paper background `#F4E4C9`, under `--scrim-standard` at
72% opacity): composite background ≈`#584E42` (L≈0.079); ink `--ink-on-warm`=`#FBF3E4`
(L≈0.902) → contrast ≈**7.4:1** — clears 4.5:1 with margin and clears the 7:1 stretch
target. The darkest chapter (Contact's night sky) needs a much lighter scrim
(`rgba(11,18,32,0.35)`) and resolves to roughly **15–17:1** — the method holds at both
ends of the palette.

**Token pairs** (`content/theme.ts`, §9):

| Token | Value | Use |
|---|---|---|
| `--ink-on-warm` | `#FBF3E4` | Text on the standard dark scrim |
| `--scrim-standard` | `rgba(28,20,13,0.72)` bottom-weighted gradient | Default `ScrimPanel` behind story copy/CTAs |
| `--scrim-light` | `rgba(24,17,12,0.35)` | Large-title-only zones, 3:1 bar not 4.5:1 |
| `--ink-deep` | `#241708` | Light-surface UI chrome (Carousel cards) not on illustration |
| `--focus-ring` | `#FFD166` | Focus indicator accent, all interactive elements |

**Carousel card contrast (the one intentional card-grid exception, §5/§7):** cards sit on
a solid/near-solid tile color, not raw illustration — flat-color contrast checks apply
directly; verify each theme's tone/label pair independently. The "active card raised,
others recede" treatment must recede via **desaturation/scale/dim of the card artwork**,
not opacity-fade of the label text — fading the whole card uniformly is the most common
way this pattern drops inactive-card labels below the 3:1 floor. Label text must hold
≥3:1 even receded, since it's still a real, operable tab.

**Focus ring contrast:** a single-color ring can wash out against light or near-black
backgrounds. Double ring: `box-shadow: 0 0 0 2px #FFD166, 0 0 0 4px rgba(15,10,6,0.55);` —
amber reads against dark scenes, the dark halo keeps it visible against light paper.

**Small-viewport adjustment (<640px, §8.1):** illustration detail compresses at small
sizes, increasing local busyness relative to text. Bump `--scrim-standard` opacity by
**+0.05** and cap `text-shadow` blur radius lower on this breakpoint.

**Automated verification (`scripts/contrast-audit.ts`):** a Playwright script that, per
chapter, screenshots the rendered Stage, samples pixels behind each text bounding box
(post-scrim, as actually rendered), and asserts ≥4.5:1 (body) / ≥3:1 (large text, UI)
using the WCAG relative-luminance formula. Run before any art/content change to a
chapter's background ships, not only at initial launch.

### 14.5 Caption and transcript requirements for video

Per §7, video use is scoped to short **ambient, muted, looping background layers** —
never autoplay-with-sound. Two distinct categories, different obligations:

**Category 1 — decorative ambient loop** (the spec's baseline — e.g. a workshop
light-flicker loop behind Projects): no audio track, no dialogue, no unique information →
captions not applicable, `aria-hidden="true"` is correct. Still governed by **SC 2.2.2
(Pause, Stop, Hide)**: any autoplaying loop running >5s needs a visible pause/play
control, independent of the `prefers-reduced-motion` handling (§14.1). Under reduced
motion, default to a static poster frame with a manual play control rather than
autoplay-then-pause.

**Category 2 — narrated/dialogue video** (not currently spec'd, a plausible future ask —
e.g. a narrated intro or a project walkthrough with voiceover): flagged as an **open
decision for Product** (§15), not something to silently build:
- A `.vtt` caption file per video at `/public/captions/{chapterId}.vtt`, wired via
  `<track kind="captions" srclang="en" label="English" default>`.
- A full text transcript as a typed field in the relevant `/content/{chapter}.ts` file
  (`videoTranscript: string`), rendered in an on-page disclosure (`<details>`) near the
  video — zero backend required.
- `default` on the caption track, since this chrome-less UI has no persistent "CC" button
  convention to rely on for discoverability.
- Meaningful visual-only information gets bracketed transcript notes (e.g. `[screen shows
  architecture diagram of X]`).
- **Recommendation:** do not introduce Category 2 video for launch unless a chapter
  explicitly requires it — real production cost (captions must be written and timed),
  and should be a deliberate Product decision, not a mid-build addition.

**Seizure-safety risk call-out (SC 2.3.1):** "glowing terminal flicker" (Projects),
"ambient light flicker" (Experience, Engineering), pulsed activity motion (GitHub) carry
real photosensitive-seizure risk if a flicker/strobe exceeds ~3 flashes/second with high
contrast between states — easy to violate without measuring Hz, since it can look "right"
at an unsafe rate. Before shipping any of these: keep under 3Hz, avoid large luminance
swings between states, and do a manual frame-rate check (or a tool such as the
Photosensitive Epilepsy Analysis Tool) as part of the review gate for those chapters —
included in the checklist below.

### 14.6 Audit checklist / definition of done

- [ ] `MotionConfig reducedMotion="user"` wraps the root layout; every GSAP timeline is
      registered through `runChoreography()` (no bare `gsap.timeline()` outside it).
- [ ] Every row of §14.1's per-chapter table verified with the OS reduced-motion flag on.
- [ ] Carousel is a real `role="tablist"` of `role="tab"` buttons, roving `tabindex`,
      manual activation, `aria-selected` correct on the active tab only.
- [ ] `#chapter-announcer` fires an `srSummary`-based announcement on every activation,
      independent of transition timing; `document.title` updates in step.
- [ ] Focus remains on the activated tab after a chapter change; skip link jumps into the
      Stage `tabpanel`; no auto-focus-to-heading has been added.
- [ ] DOM reading order for every chapter matches §14.2 (heading → copy → props → CTAs);
      decorative layers are `aria-hidden`.
- [ ] Every clickable 3D mesh in Projects/GitHub/Learning/Contact has a working
      `SceneAccessibleOverlay` keyboard/AT equivalent driving the same state.
- [ ] Gallery lightbox traps focus, closes on `Esc`, returns focus to its trigger; Stage
      is `inert` while it's open.
- [ ] Every horizontal in-scene collection is reachable via the roving-tabindex/arrow-key
      model or via visible Prev/Next buttons.
- [ ] `scripts/contrast-audit.ts` passes ≥4.5:1 (body) / ≥3:1 (large text, UI) on every
      chapter's rendered Stage, post-scrim, at desktop and mobile breakpoints.
- [ ] Carousel "recede" state reduces artwork saturation/scale only — inactive-card label
      text independently verified ≥3:1.
- [ ] Focus ring visually confirmed against the lightest (Welcome) and darkest (Contact)
      chapter backgrounds.
- [ ] Any flicker/pulse effect (Projects, Experience, Engineering, GitHub) measured under
      3Hz; sign-off recorded before ship.
- [ ] If any narrated video ships: `.vtt` captions present and `default`, transcript
      present, confirmed against §14.5 Category 2 requirements.
- [ ] Manual pass with at least one of NVDA/JAWS (Windows) and VoiceOver (macOS/iOS)
      through all 11 chapters in order, keyboard only, no mouse.
- [ ] §14.7's scoped conformance exception reviewed and explicitly signed off (§15) —
      not silently folded into a blanket "Level AA" claim in any client-facing document.

### 14.7 Known conformance exception — text resize & reflow vs. the fixed-viewport constraint

WCAG 2.2 AA's **SC 1.4.4 (Resize Text** — text scalable to 200% with no loss of content or
functionality) and **SC 1.4.10 (Reflow** — content usable at a 320px-equivalent/400%-zoom
viewport without two-dimensional scrolling) are both structurally in tension with §2's
immutable "no document/page scroll anywhere, ever" inside a permanently fixed,
viewport-locked 85/15 Stage. Enlarging text or the effective viewport in a fixed-height
illustrated Stage either forces overflow/clipping (failing 1.4.4/1.4.10) or forces scroll
(violating the hard constraint) — there is no configuration that satisfies both at once,
and this document does not claim otherwise or paper over the trade-off.

**Resolution, scoped and explicit, not silently dropped:**
- **Browser page zoom** (Ctrl/Cmd `+`/`-`, which scales the *entire* viewport — including
  the fixed grid — not just text) is the supported magnification path, tested up to 200%
  (§16.2's manual checklist). Because the Stage/Carousel grid, the `clamp()`-based type
  scale (§8.3), and `dvh`-based sizing all scale together as one unit, 200% browser zoom
  re-partitions the layout exactly as a smaller physical viewport would (§8.1/§8.2's
  buckets) — never clipping, never forcing a scrollbar. This path satisfies the *intent*
  of 1.4.4/1.4.10 (nothing is lost, nothing becomes two-dimensionally scrollable) even
  though it scales the whole composition rather than text alone.
- **OS/browser text-only resizing** (font-size-only scaling independent of page zoom —
  what SC 1.4.4 specifically targets, e.g. some mobile browsers' "text size" sliders) is
  **not fully satisfiable** inside a fixed-height, illustrated Stage without either
  clipping art or violating the no-scroll constraint. This is a known, accepted,
  documented limitation of the single-viewport storybook format — not an oversight, and
  not something a future contributor should attempt to "fix" by quietly introducing
  scroll. The compensating provision: once effective text scale would push body copy past
  its `clamp()` ceiling, the experience degrades into **Companion Mode** (§8.6), which
  already exists for below-minimum viewports and drops the animated/illustrated layers in
  favor of plain, reflowable text — the same mechanism doubles as the fallback for
  text-only zoom the illustrated Stage cannot otherwise absorb.
- This trade-off is a client sign-off item (§15, alongside the OG-tag limitation), not a
  detail buried in an appendix — any external accessibility statement for this site should
  name SC 1.4.4/1.4.10 as a scoped, documented exception rather than asserting unqualified
  Level AA conformance.

---

## 15. Open Items / Inputs Needed From You

These are real, unresolved blockers — engineering can and does proceed around them
(§16), but none of them can be silently decided by the build team.

1. **Reference photo for the character illustration** — not yet received (only a
   filename came through as text at one point, no image bytes). Needs to be re-attached
   or its file path provided. **Not a launch blocker**: §13.6's "Generic Storyteller"
   fallback ships as the v1 default, built from the identical rig/anchors/style guide, so
   illustration and pose work proceed on schedule regardless. When the photo arrives, the
   likeness update is a scoped, 4-component + 1-content-object patch (§13.5, §13.6) — it
   never touches the rig, poses, or chapter code. Photo intake requirements are specified
   in §13.5 step 1 (front-facing or 3/4 view, even lighting, plain background preferred,
   ≥1024px short side).
2. **Real content for each chapter** — Journey milestones, Experience roles, Projects
   case studies (problem/idea/journey/challenge/solution/outcome/lesson per §6.2),
   Writing samples, Learning topics, Life/favorites, Gallery photos, Contact links/resume
   file. Can be gathered chapter-by-chapter as we build. Per the Delivery Lead's plan
   (§16, Phase 0), this becomes a tracked **content gap-list** with an owner and target
   date per chapter, produced in Phase 0 and used to sequence Phase 5's build order —
   chapters are built in whatever order their content is actually frozen, not in
   narrative order, so a slow chapter never blocks a ready one.
3. **GitHub data source decision** — static/manual curated snapshot committed to
   `content/github.ts` at build time (recommended, and the approach assumed throughout
   this document, §5/§6.2/§9) vs. none at all. A live build-time or client-side fetch is
   explicitly rejected: it conflicts with the "no API/no backend" hard constraint (§2) and
   introduces staleness/rate-limit risk with no corresponding benefit for a static
   portfolio. Decision should be locked in Phase 0 (§16) rather than left open into later
   phases; the content file should carry a "last updated" comment for future manual
   refreshes.
4. **Confirm the 11-chapter list/order is final**, or provide adjustments, before Phase 0
   closes. `CHAPTER_ORDER` (§10.5) is the single source of truth once locked, and
   reordering after Phase 3 (§16) becomes expensive — it touches the transition-adjacency
   authoring in §6.3, the camera-neighbor prefetch logic in §10.4, and the fixed 11-pose
   character matrix in §13.4.
5. **Analytics instrumentation approach** (§1.4) — client-side, privacy-respecting
   snippet (Vercel Analytics or Plausible) is proposed but not yet confirmed. Needs
   explicit sign-off before any script tag is added to `app/layout.tsx`.
6. **Per-chapter Open Graph limitation** (§10.3) — accepted that a shared link to
   `#chapter=projects` will always preview with the generic site-wide social card, never a
   chapter-specific one, since a static export can't branch per request and scrapers don't
   resolve hash fragments. Needs an explicit "yes, that's fine" before launch, since it's
   a real (if minor) trade-off, not an oversight.
7. **Category 2 (narrated/dialogue) video** (§14.5) — not currently planned, but flagged
   as a real production-cost decision (captions + transcript authoring) if a future
   chapter wants a narrated reel or voiceover walkthrough. Recommend deferring past launch
   unless a chapter explicitly requires it.
8. **Ambient audio** (§6.4 risk #4) — sound design is fully specified per chapter
   (§6.2's "Ambiance Note" rows) but ships silent in v1. If/when audio is greenlit, it
   must default-muted per autoplay policy, and any persistent mute/play control needs
   review against the no-navbar/no-chrome constraint (§2) before it's added.
9. **WCAG 2.2 AA scoped conformance exception sign-off** (§14.7) — SC 1.4.4 (Resize Text)
   and SC 1.4.10 (Reflow) are structurally unsatisfiable in a fixed-viewport, no-scroll
   Stage for OS/browser text-only zoom, compensated for via degradation into Companion
   Mode (§8.6) rather than full in-Stage reflow. Needs an explicit "yes, that's an
   acceptable, documented trade-off" sign-off before any client-facing accessibility
   statement claims blanket Level AA conformance.

---

## 16. Implementation Phases & Delivery Roadmap

Each phase has a scope, a Definition of Done, an explicit review checkpoint, and, where
relevant, a flagged risk with its mitigation folded in. Durations are indicative sprints,
not contractual dates — Phase 0 and Phase 5 are gated by content delivery, not
engineering effort (§16.3).

| Phase | Name | Est. duration | Gate type |
|---|---|---|---|
| 0 | Foundations, Content Audit & Illustration Kickoff | 1 week | Go/no-go before build starts |
| 1 | Shell & Chrome | 1 week | Visual sign-off |
| 2 | Story Carousel | 1 week | Interactive prototype sign-off |
| 3 | Chapter State Machine & Transition Choreography | 1–1.5 weeks | **Choreography sign-off** (blocking) |
| 4 | Template Chapters — Welcome + Projects to full fidelity | 2–3 weeks | **"Is this premium?" sign-off** (hard gate) |
| 5 | Remaining 9 chapters (DOM/SVG) | 3–4 weeks, content-dependent | Rolling review every 2 chapters |
| 6 | 3D Chapters via R3F | 2–3 weeks | **Low-end device perf sign-off** (hard gate) |
| 7 | Polish, Hardening & Launch | 1.5–2 weeks | Final UAT / launch approval |

Total: roughly **12–17 weeks** of engineering effort, assuming content for each chapter is
frozen at least one phase before that chapter is built. Slippage in content delivery
directly extends Phase 5; it does not stall Phases 1–4 or 6, which is why the build
sequence is deliberately reordered around content readiness rather than the chapter's
narrative position.

### 16.1 Phase-by-phase plan

**Phase 0 — Foundations, Content Audit & Illustration Kickoff (1 week).** Repo scaffold,
tooling, and surfacing every open content/asset dependency before a single animated pixel
is built.

DoD: Next.js 15 App Router scaffolded with static export, TypeScript strict, Tailwind,
ESLint/Prettier in a pre-commit hook · `/types/chapter.ts` defines `Chapter`, `ChapterId`,
`ChapterTheme`, `CharacterPose` (§10.5) · `/content/chapters.ts` exists with all 11
chapters stubbed matching §5's fixed order · a **content gap-list** produced per chapter
with owner + target date (§15 item 2) · character reference photo confirmed usable or the
fallback (§13.6) confirmed as the v1 path, with the pose list agreed · decision recorded
on GitHub data sourcing (§15 item 3) · CI runs typecheck + lint + (once they exist)
Playwright smoke tests on every PR.

Review checkpoint: client confirms the 11-chapter list/order is final (§15 item 4), the
pose list, and the content gap-list/deadlines.

**Phase 1 — Shell & Chrome (1 week).** Fullscreen layout, scroll lock, the 85/15 grid,
responsive breakpoints — no chapter content yet.

DoD: `app/layout.tsx` applies the scroll lock and `100dvh`/`100vh` fallback (§4, §8.1) ·
Stage + Carousel mounted via the fixed grid inside `position:fixed; inset:0` · responsive
rules verified concretely at 1920×1080, 1440×900, 834×1194 (iPad), 390×844 (iPhone 14),
375×667 (iPhone SE), plus a landscape-phone stress test (~740×360, §8.2) · zero-scroll
invariant verified programmatically (`scrollHeight <= innerHeight`) at all reference
viewports · placeholder color-block content in both regions.

Review checkpoint: client views the fullscreen shell live at desktop/tablet/mobile widths
and signs off on the proportions and no-scroll behavior before visual design layers in.

**Phase 2 — Story Carousel (1 week).** The one intentional card-grid element — built to
full interaction fidelity even with placeholder art.

DoD: `StoryCard.tsx` renders all 11 cards in fixed order with real icon+label, hover and
active/raised states · drag/swipe with momentum (§8.3) · keyboard support per §14.3
(`tablist` pattern, roving tabindex, `Enter`/`Space` activation, visible focus ring ≥3:1) ·
`aria-selected` + `aria-live` region wired · touch targets ≥44×44px · prev/next affordances
styled as hand-lettered, ink-stroke page-turn tabs (echoing the Page-Turn Fold motif,
§6.3) rather than generic UI-kit chevrons, shown on desktop/tablet, hidden on touch (where
swipe is primary).

Review checkpoint: client drives the carousel themselves (mouse drag, phone swipe,
keyboard-only) and confirms it feels premium at the interaction level; also the moment to
confirm card art direction, since that gates Phase 4 illustration work.

**Phase 3 — Chapter State Machine & Transition Choreography (1–1.5 weeks).** Prove the
core "world change" moment feels cinematic using placeholder scenes (solid color +
label), deliberately before final art exists, so choreography can be iterated cheaply.

DoD: `activeChapterId` lives in the Zustand store (§10.2), `useChapterTransition.ts`
drives the GSAP timeline from §7.3, overlapping Framer variants rather than sequencing
strictly · timing matches §7.2 exactly, measured via `performance.now()` deltas in dev
mode · `prefers-reduced-motion` collapses the sequence per §14.1, verified by reading the
media query once in `transitions.ts` · no blank/flash frame between chapters · 60fps
sustained through the full transition on desktop Chrome · the direct-jump case (§6.3's
Page-Turn Fold) uses its own shorter, distinct budget, not a scaled-up version of the
adjacent-cut budget.

Review checkpoint — **Choreography sign-off (blocking)**: client watches the raw
transition on placeholder scenes and explicitly approves pacing/feel before Phase 4
starts — cheaper to change easing on a color block than on finished illustration + R3F
scenes.

Risk flagged here: R3F camera-rig behavior (§11.2) for the 3D chapters can only be
partially validated at this stage since those canvases don't exist yet — the camera
controller's *interface* (lerp target, duration, easing) is locked here; real-device
performance is not provable until Phase 6.

**Phase 4 — Template Chapters: Welcome + Projects to full fidelity (2–3 weeks).** Build
exactly two chapters to shippable quality, establishing the reusable Stage primitives
every other chapter consumes.

DoD: `StageBackground.tsx`, `Character.tsx`, `FloatingObjects.tsx`, `ChapterContent.tsx`
proven genuinely reusable via per-chapter config, not one-off hardcoded JSX · character
illustration integrated with at least 2 production-quality poses (idle for Welcome,
working/thinking for Projects, §13.4) · all copy/structured content pulled from typed
`content/*.ts`, zero hardcoded strings in components · Lighthouse mobile (throttled) ≥90
Performance / ≥95 Accessibility, desktop ≥95 Performance (§12.4) · contrast audit passed
against the real warm-paper background (§14.4) · both chapters pass the Phase 3
choreography timing budget unchanged.

Review checkpoint — **"Is this premium?" sign-off (hard gate)**: full client walkthrough
on at least one desktop and one phone. This answers whether the direction reads as
"cinematic storybook" or "generic portfolio with animations" — the entire thesis of the
product (§1.2). **No further chapter art begins until this is explicitly approved.**
Budget one full revision cycle into this phase's estimate; first-pass rejection here is
normal and far cheaper to absorb than discovering it after Phase 5.

Risk flagged here: the character illustration system's risk (§16.3, Risk #2) is either
resolved or confirmed real at this gate — if 2 poses + 2 chapters already ran meaningfully
over the 2–3 week estimate, that ratio should be assumed to apply across the remaining 9
poses/chapters, adjusted here, not discovered in week 12.

**Phase 5 — Remaining 9 chapters, DOM/SVG (3–4 weeks, content-dependent).** Journey,
Experience, Engineering, GitHub (non-3D layer), Writing, Learning (non-3D layer), Life,
Gallery, Contact (non-3D layer) — each reusing Phase 4's Stage primitives with
chapter-specific dressing and character pose. (These 9 plus Phase 4's Welcome + Projects
account for all 11 chapters, per §2/§5's fixed order — Contact's DOM/SVG layer, including
its constellation-icon CTAs' static markup, ships here; Phase 6 only adds its R3F
starfield canvas on top.)

DoD (per chapter, all 9 must pass before phase closes): content finalized in the typed
`/content/*.ts` file, no placeholder copy shipped · unique scene dressing per §6.2's world
description · character pose added to the pose map (§13.4) · same perf/contrast/a11y bar
as Phase 4 · Gallery specifically: lightbox keyboard-operable per §14.2/§14.3 · Contact
specifically: all CTAs are real, functional anchor/mailto links in the static export,
resume file present in `/public`.

Build sequencing: chapters are built in whatever order their content becomes frozen
(§15 item 2's gap-list), not in narrative order — sitting idle waiting for one chapter's
content while others are ready is the single most avoidable cost in this phase.

Review checkpoint: rolling review every 2 chapters (e.g. after {Journey, Experience},
after {Engineering, Writing}, etc.) — a short async walkthrough or 15-minute live review,
catching direction drift within 2 chapters of it happening, not a full Phase-4-style gate
each time.

**Phase 6 — 3D Chapters via React Three Fiber (2–3 weeks).** Add the R3F canvas layer to
Projects, GitHub, Learning, Contact on top of their already-shipped DOM/SVG content.

DoD: each canvas lazy-mounts only when active and fully unmounts on exit (§10.4, §11.5) ·
`/three/camera` transition controller lerps the camera using the same timing locked in
Phase 3 (§11.2) · draw-call/triangle budgets enforced per §11.3, checked via
`r3f-perf`/Drei's `<Perf>` · frame budget ≥55fps desktop, ≥30fps sustained on the defined
low-end reference device (iPhone SE 2nd/3rd-gen, mid-tier Android), measured on the
physical device, not just DevTools throttling · adaptive quality ladder (§11.3)
implemented — no chapter is allowed to become unusable on a low-end device, it degrades,
never breaks · WebGL context-loss handling (`oncontextlost`/`oncontextrestored`) so
backgrounding the tab never leaves a black canvas · `prefers-reduced-motion` respected
inside 3D chapters too (§14.1).

Review checkpoint — **Low-end device perf sign-off (hard gate)**: live demo on the actual
reference low-end phone, client watches the fallback trigger and approves the degraded
experience still feels intentional. This is the project's single highest-uncertainty
phase and does not get a "fix it in polish" pass — if a chapter can't hit the fps floor
even in fallback mode by this checkpoint, the decision to simplify its 3D scope is made
here, not in Phase 7.

Risk flagged here: recommend prototyping the heaviest scene (Contact's night sky or
Projects' lab) on the reference low-end device as early as Phase 0/3, in parallel with
choreography work, rather than waiting for Phase 6 for the first real signal.

**Phase 7 — Polish, Hardening & Launch (1.5–2 weeks).** Micro-interactions, full
accessibility audit, performance pass, cross-browser pass, QA gates (§16.2).

DoD: micro-interactions added (idle floating motion on unselected cards, cursor-follow
parallax, physical button-press feedback) · full QA/testing strategy executed and passed,
including the reduced-motion and keyboard-only release gates · R3F canvases confirmed
lazy-mounted/unmounted correctly across rapid switching, no memory growth over 20
consecutive changes · cross-browser pass (Chrome, Safari macOS+iOS, Firefox, Edge) · all
11 chapters individually meet Lighthouse Performance ≥90 mobile/≥95 desktop, Accessibility
≥95, Best Practices ≥95 · a direct hit to any unexpected path still renders inside the
same fullscreen shell.

Review checkpoint: final UAT — client plus 1–2 outside testers unfamiliar with the
project walk the entire storybook end to end, no guidance given, and confirm the
"remembers Omkar as a person" success criterion (§1.1) feels true before launch.

### 16.2 QA & testing strategy

No backend, no user accounts, no dynamic data — QA is weighted toward manual cross-device
feel-testing and a thin, high-value automated interaction/visual smoke layer, not a large
integration/API test suite testing something that doesn't exist.

**Manual cross-device checklist** — run at the end of Phase 4, again at Phase 7, plus a
lighter version at each Phase 5 rolling checkpoint (device/viewport matrix: §8.8). Per
device: no document/page scroll appears under any interaction (drag, swipe, resize,
rotate, browser page zoom to 200% per §14.7's documented resize/reflow exception);
Carousel drag/swipe momentum feels physical;
transitions complete within budget without stutter; character illustration renders crisp
at actual pixel density; 3D chapters either hit the fps floor or cleanly fall back, never
a stuttering in-between; touch targets ≥44×44px; orientation change re-lays-out without a
FOUC or a scroll appearing mid-rotation.

**Automated smoke tests (Playwright, `/tests/e2e/*.spec.ts`, CI on every PR touching
`/components`, `/content`, or `/three`, blocking on failure):**
1. Interaction smoke (all 11 chapters) — click each `StoryCard`, assert
   `[data-active-chapter]` updates, the `aria-live` region updates, zero
   console errors/warnings, and the zero-scroll invariant holds immediately after.
2. Transition timing assertion — a `data-transitioning="false"` flag flips back within
   budget + 150ms buffer.
3. Visual regression — `toHaveScreenshot()` baselines per chapter at three viewports,
   `maxDiffPixelRatio: 0.02`; baselines updated only via a reviewed script, never
   auto-approved in CI.
4. Reduced-motion pass (**release gate**) — `emulateMedia({reducedMotion:'reduce'})`,
   assert the transition collapses per §14.1 and `FloatingObjects` reports
   `data-motion="reduced"`.
5. Keyboard-only pass (**release gate**) — no mouse/touch events at all: `Tab` into the
   Carousel, arrow through all 11 cards, `Enter` to activate, assert no keyboard trap, the
   focus ring is present, and Stage/`aria-live` content updates match the mouse-driven test.
6. Static export sanity — after `next build && next export`, re-run the interaction smoke
   suite against the served static output, not just the dev server.

**Non-negotiable release gates:** the reduced-motion pass and the keyboard-only pass must
be green in CI before any production deploy — build-breaking, same level as a failed
typecheck, given the accessibility commitments in §14 and this product's
animation-by-default nature.

### 16.3 Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Content-gathering is the true critical path — real material for 8 of 11 chapters may not arrive on the engineering schedule | High | High — blocks Phase 5 chapter-by-chapter even when plumbing is ready | Phase 0's content gap-list with owners/dates (§15 item 2); Phase 5 build order follows content readiness, not narrative order; placeholder copy is used only for Phase 3 choreography proof, never shipped |
| 2 | Character illustration system takes longer than the 2–3 week Phase 4 estimate — bespoke illustration work historically runs over | Medium-High | High — the character appears in every chapter; a delay blocks all remaining chapters | Reference photo + full pose list locked in Phase 0 (or the fallback confirmed, §13.6); only 2 poses validated in Phase 4 before committing art-production time to the remaining 6+; reviewed explicitly at the Phase 4 gate |
| 3 | R3F canvas performance on low-end mobile is unproven until Phase 6 — GPU limits, thermal throttling, context loss could make 4 of 11 chapters unusable on older phones | Medium | High — could force cutting or drastically simplifying the 3D layer | Prototype the heaviest scene on the physical reference low-end device as early as Phase 0/3, not Phase 6; device-tier detection with a static-poster fallback built in from the start, not retrofitted under deadline pressure |
| 4 | "Is this premium?" sign-off (Phase 4) fails on first pass — the core creative bet is inherently subjective | Medium | Medium-High — a rejected gate should reshape remaining chapters, not just Welcome/Projects | One full revision cycle budgeted into the Phase 4 estimate explicitly; first walkthrough treated as a working session, not pass/fail; Phase 5 art doesn't start until this gate is actually approved |
| 5 | Scope creep via "just one more chapter/feature" | Medium | Medium — directly conflicts with §2's hard constraints | Chapter list and the two-region rule are frozen per §2; new ideas logged to a v2 backlog, never built mid-project |
| 6 | Accessibility regressions creep back in during Phase 7 polish — micro-interactions and last-minute tweaks are a common regression source | Medium | Medium-High — directly violates §14's commitments | Reduced-motion and keyboard-only Playwright checks (§16.2) run in CI from Phase 3 onward, not introduced only at the end; both release-blocking |
| 7 | Static export constraints bite the GitHub chapter — "live" activity conflicts with the no-backend/no-API constraint, and a manual snapshot can go stale | Low-Medium | Low — cosmetic/staleness only, doesn't block launch | Decision (static/manual curated snapshot, §15 item 3) locked in Phase 0; `content/github.ts` carries a "last updated" comment for future refresh |
| 8 | iOS Safari-specific quirks — `100dvh` inconsistencies, WebGL context loss on backgrounding, touch-drag conflicting with edge-swipe gestures | Medium | Medium — could break the no-scroll guarantee or blank the 3D canvases specifically on iOS | Explicit Safari/iOS row in the device matrix (§8.8, §16.2) at every QA pass; `100dvh` with `100vh` fallback (§8.1); `oncontextlost`/`oncontextrestored` handlers on every R3F canvas (Phase 6 DoD) |
