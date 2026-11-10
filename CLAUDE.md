# CLAUDE.md — MASTER PROMPT · Website "SEL" (Kelompok 4, XI-A5, Kolese Kanisius)

> This file is read by Claude Code at the start of every session. It is the single source of truth
> for HOW to build this project. All Indonesian learning content lives in `docs/KONTEN-MATERI.md`.
> If anything here conflicts with a direct instruction from Howard in chat, Howard wins — then update this file.

---

## 0. Context you must always keep in mind

| Item | Value |
|---|---|
| Project | Educational website about **cell biology (materi Sel, Biologi kelas XI)** |
| Name | **SEL** — tagline *"Kecil, tapi menyusun segalanya."* |
| Owner / group leader | **Howard Leonhart Junaedi** (XI-A5 / 20) — he will **answer every code question from the teacher alone** |
| Group | Kelompok 4, XI-A5 (members listed in `docs/KONTEN-MATERI.md` §8) |
| Class | Web Development final project, topic taken from Biology |
| Hard deadline | **Wednesday 11 November 2026 — live presentation.** Today the build starts Sunday night 8 Nov. |
| Project folder (Howard's PC, Windows) | `C:\Users\p4ulu\Desktop\Codes\sel` — create the `sel` folder inside `Codes` if it doesn't exist and work only inside it |
| Hosting | Source on **GitHub** (teacher reads the source there) + live deploy on **Vercel** (Netlify/Cloudflare acceptable) |
| Language of the website | **Bahasa Indonesia** (all UI text and content) |
| Language of code | English identifiers, plain and descriptive |
| Teacher's grading rubric | Report & documentation 20% · **Material accuracy 25%** · Concept & design 15% · **Function & quality 25%** · Presentation 15% |
| Teacher's rules (pedoman) | Must have: beranda, halaman materi, navigasi jelas, **daftar referensi**; cite every source of text/images/models; don't copy material wholesale; document all 5 meetings (Pertemuan 1–5) with screenshots |

### The single most important constraint
**Howard must be able to explain what every file and every important block of code does.**
Therefore: simple, readable, boring code beats clever code. Every feature you finish must be explained in
`docs/PENJELASAN_KODE.md` (see §2.3). If you write something you could not explain to a 16-year-old in 3 sentences,
simplify it.

---

## 1. Golden rules (non-negotiable)

1. **One feature at a time.** Plan → build → run → verify → explain → commit. Never build three pages in one go.
2. **No new dependency without asking Howard first.** Approved list is in §3.1. Anything else: ask, say why, say what it costs to explain.
3. **No frameworks.** No React, Vue, Next.js, Tailwind, TypeScript. Vanilla HTML + CSS + JavaScript (ES modules) built with Vite.
4. **Content comes only from `docs/KONTEN-MATERI.md`.** Never invent biology facts, numbers, or examples. If you need a fact
   that is not there, add it to `docs/CEK-MATERI.md` as a question for Howard instead of putting it on the site.
5. **Credit everything.** Every 3D model, image, video, font, library, and text source goes into `src/data/credits.json`
   at the moment you add it (creator, title, license, URL). Page 6 renders from that file.
6. **Never ship a model/image whose license is unknown, "all rights reserved", or NoDerivatives (ND) in modified form.**
7. **Performance first:** must run smoothly on an average school laptop with integrated graphics and on a projector.
   Follow the budget in §5.6. Every 3D page needs a working **Mode Tenang** fallback.
8. **Use Howard's installed skills** (caveman for chat replies, ui-ux-pro-max for UI, etc.) — see §12.1b.
9. **No comments-as-documentation.** Keep code comments to a minimum (only where something is truly non-obvious).
   Explanations go in `docs/PENJELASAN_KODE.md`, written in Indonesian.
10. **Accessibility basics always:** semantic HTML, real text (not text baked into canvas only), keyboard access,
   `prefers-reduced-motion` respected, sufficient contrast.
11. **Keep the build green:** `npm run dev` and `npm run build` must work after every commit. No console errors.
12. **Small files.** Aim for files under ~250 lines. Split by responsibility (one scene / one component / one helper per file).
13. **Be honest in the UI:** a simulation is labelled as an illustration (*"Ilustrasi, bukan skala sebenarnya"*) where relevant.

---

## 2. How to work with Howard (the loop)

### 2.1 Every feature follows this loop
1. **Plan** — state in 3–6 bullets what you will build and which files you will touch. Wait for "ok" if the change is large
   (new page, new dependency, new 3D asset, change of architecture). Small changes: just proceed.
2. **Build** — smallest working version first.
3. **Run & verify** — run the dev server, open the page, check the console, test on a narrow (mobile) width.
   If a browser/Playwright tool is available, take a screenshot into `docs/laporan/screenshots/` (see §11).
4. **Explain** — append a section to `docs/PENJELASAN_KODE.md` (format §2.3).
5. **Log** — append one entry to `docs/LOG.md` (date, what was built, problems met, next step). This feeds the report.
6. **Commit** — conventional message in Indonesian or English, e.g. `feat(landing): efek riak pada judul SEL`.
   End commit messages with the attribution lines your harness requires (if any).

### 2.2 When Howard says…
| Howard says | You do |
|---|---|
| `jelasin` / `jelaskan` | Explain the last code you wrote, block by block, in simple Indonesian. Update `PENJELASAN_KODE.md` if needed. |
| `uji aku` | Quiz Howard like his teacher would: 5 questions about specific files/lines of THIS project ("apa fungsi `updateRipple` di `title-ripple.js`?"). Wait for answers, then grade them. |
| `status` | Short report: what's done, what's next, what's at risk for Wednesday. |
| `mode darurat` | Stop polishing. Switch to the MVP fallback order in §10.3. |
| `cek materi` | Re-check all on-site text against `docs/KONTEN-MATERI.md` and list mismatches. |

### 2.3 Format of `docs/PENJELASAN_KODE.md` (Indonesian)
For each file, one section:
```
## src/pages/landing/title-ripple.js
**Tugas file ini:** (1–2 kalimat)
**Dipakai oleh:** index.html → main-landing.js
**Cara kerja (langkah demi langkah):**
1. ...
2. ...
**Bagian penting:**
- `fungsiA()` — apa yang dilakukan, input, output.
- Baris shader `uv += dir * strength` — artinya ...
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa pakai shader, bukan CSS? J: ...
```
Write it for a 16-year-old: concrete, no jargon without a one-line definition. At the end of the project, also export
`docs/PENJELASAN_KODE.pdf` (Howard asked for a text/PDF explanation file).

---

## 3. Tech stack & structure

### 3.1 Approved dependencies (and only these, unless Howard approves more)
| Package | Why |
|---|---|
| `vite` | Dev server + multi-page build |
| `three` | All 3D (scenes, shaders, GLTF loading, raycasting) |
| `gsap` (+ `ScrollTrigger`) | Scroll-driven timelines, UI tweens |
| `lenis` | Smooth scrolling |
| `html-to-image` (or `html2canvas`) | "Unduh Report Card" on the quiz page — pick ONE |
| `@gltf-transform/cli` (devDependency, tools only) | Compress/inspect 3D models (never shipped to the browser) |

Three.js add-ons come from `three/examples/jsm/...` (GLTFLoader, DRACOLoader or meshopt decoder, EffectComposer,
RenderPass, UnrealBloomPass, OutputPass, RoomEnvironment). Fonts via Google Fonts (`Montserrat`, `Cormorant Garamond`)
— self-host the woff2 files in `public/fonts/` if time allows so the site works on bad school Wi-Fi.

### 3.2 Project structure
```
sel/
├─ CLAUDE.md
├─ index.html                 # Page 1 · Landing (SEL – menyelam)
├─ sel.html                   # Page 2 · Lab Sel (hewan ⇄ tumbuhan + detail organel)
├─ gerbang-sel.html           # Page 3 · Membran & transpor
├─ lab-osmosis.html           # Page 4 · Lab Osmosis (mikroskop + video)
├─ kuis.html                  # Page 5 · Kuis (latihan + ujian + report)
├─ rangkuman.html             # Page 6 · Rangkuman, sumber, kredit, anggota
├─ vite.config.js             # multi-page input
├─ package.json
├─ public/
│  ├─ models/                 # compressed .glb only (originals in /assets-src, gitignored if huge)
│  ├─ video/                  # osmosis clips (.webm + .mp4 fallback)
│  ├─ img/                    # posters, fallbacks for Mode Tenang, landing parallax layers
│  └─ fonts/
├─ src/
│  ├─ styles/
│  │  ├─ tokens.css           # design tokens (§4)
│  │  ├─ base.css             # reset, typography, layout utilities
│  │  └─ components.css       # nav, buttons, cards, pins, chips, footer-next
│  ├─ core/                   # shared, tiny, reusable
│  │  ├─ renderer.js          # creates ONE WebGLRenderer with the perf settings (§5.6)
│  │  ├─ quality.js           # FPS monitor + auto quality tiers + Mode Tenang flag
│  │  ├─ smooth-scroll.js     # Lenis + GSAP ScrollTrigger glue
│  │  ├─ nav.js               # top nav + active page + progress dots
│  │  ├─ page-transition.js   # View Transitions API + fade fallback
│  │  ├─ loader.js            # GLTF/texture loading with progress + caching
│  │  ├─ pick.js              # raycast hover/click helper (used by pages 2 & 3)
│  │  ├─ info-card.js         # the shared "pin + card" UI (pages 2 & 3)
│  │  └─ materials.js         # shared "lab realism" materials + environment
│  ├─ pages/
│  │  ├─ landing/  (main.js, scenes/*.js, title-ripple.js, shaders/*.glsl)
│  │  ├─ sel/      (main.js, cell-viewer.js, organelle-detail.js, ...)
│  │  ├─ gerbang/  (main.js, membrane-stage.js, modes/*.js)
│  │  ├─ osmosis/  (main.js, microscope.js)
│  │  ├─ kuis/     (main.js, practice.js, exam.js, report.js, timer.js)
│  │  └─ rangkuman/(main.js)
│  └─ data/
│     ├─ organel.json         # page 2 content (from KONTEN-MATERI §3)
│     ├─ membran.json         # page 3 content (§4)
│     ├─ osmosis.json         # page 4 content (§5)
│     ├─ soal.json            # question bank (§6)
│     ├─ rangkuman.json       # page 6 summary cards (§7)
│     └─ credits.json         # every source/model/font/library (§8)
├─ tools/
│  ├─ inspect-model.mjs       # lists nodes/materials of a .glb (for asset audit)
│  ├─ compress-models.mjs     # gltf-transform pipeline (Node, works on Windows)
│  └─ render-osmosis.html     # renders the 6 osmosis clips from a Three.js scene (MediaRecorder)
└─ docs/
   ├─ KONTEN-MATERI.md        # all Indonesian content (source of truth)
   ├─ PENJELASAN_KODE.md      # explanations for Howard
   ├─ ASSETS.md               # asset audit results + decisions
   ├─ CEK-MATERI.md           # open science questions for the teacher/Howard
   ├─ LOG.md                  # dated build log (for the report)
   └─ laporan/screenshots/
```

### 3.3 Coding conventions
- ES modules, `const`/`let`, small pure functions, early returns. No classes unless a scene object truly needs state.
- One Three.js scene per file; every scene exports `create(...)`, `update(dt, progress)`, `dispose()`.
- All tunable numbers at the top of the file as named constants (`const RIPPLE_STRENGTH = 0.015`) — easy to explain and tweak.
- GLSL in separate `.glsl` files imported with `?raw`, each shader < ~40 lines.
- Content strings never hard-coded in JS — read from `src/data/*.json`.
- CSS: use the tokens; BEM-like class names (`.card`, `.card__title`, `.card--active`).

---

## 4. Design system

### 4.1 Colors (`src/styles/tokens.css`)
```css
:root{
  --c-deep:      #063B4C;  /* deep water / landing background */
  --c-lagoon:    #1FC8C8;  /* fresh turquoise, links, meters */
  --c-aqua:      #B8F1EC;  /* tagline, soft highlights */
  --c-forest:    #2E7D4F;  /* rainforest */
  --c-cream:     #FFF4D6;  /* titles, primary text on dark */
  --c-coral:     #FF7A59;  /* accent: buttons, active states, pins */
  --c-lab:       #0E1116;  /* lab background (pages 2–6) */
  --c-lab-2:     #151B22;  /* cards/panels on lab background */
  --c-line:      #26303A;  /* borders */
  --c-muted:     #6B7A86;  /* labels, captions */
  --c-text:      #D3D9DE;  /* body text on dark */
  --c-good:      #4CC38A;  --c-warn: #F2B544;  --c-bad: #E5534B;  /* quiz feedback & timer */
}
```
Landing = water palette (deep/lagoon/aqua/forest). Pages 2–6 = **dark lab** (lab/lab-2) with the same accents.

### 4.2 Typography
| Role | Font | Notes |
|---|---|---|
| Display title ("SEL", page titles) | **Montserrat 800**, uppercase, letter-spacing 0.12–0.2em | |
| Tagline / poetic lines | **Cormorant Garamond Italic 500** | |
| UI + body | **Montserrat 400/500** | 16px body, 1.6 line-height |
| Labels / eyebrows | Montserrat 500, 11–12px, uppercase, letter-spacing 0.15em, `--c-muted` | e.g. `SEL · LAB` |

### 4.3 Components (build once in `components.css` + `core/`, reuse everywhere)
- **Top nav**: logo "SEL" left; links: Beranda · Lab Sel · Gerbang Sel · Lab Osmosis · Kuis · Rangkuman; toggle **Mode Tenang** (right). Collapses to a menu on mobile.
- **Pin + info card** (pages 2 & 3, identical look): numbered/dot pin with leader line → card with **name (Montserrat 800)**, one-line explanation, link **"Lihat detail →"** (coral, underlined). Hovered 3D part glows (emissive) and the rest dims to ~55% so the user never mis-clicks.
- **Detail panel** (right side): eyebrow `BAGIAN 3 DARI 4`, title, **DESKRIPSI**, **FUNGSI**, optional *Tahukah kamu?* box.
- **Breadcrumb**: `Sel Hewan › Mitokondria › Krista`; **back button** pill `← Kembali ke sel`.
- **Chips** (mode selectors), **pill buttons**, **solution buttons** (page 4).
- **Footer "next page"** on EVERY page: big button `Lanjut: <Nama halaman> →` with a small preview, a small `← Sebelumnya`, and progress dots `● ● ○ ○ ○ ○`.
- **Meters/bars** (volume, turgor, concentration, quiz topic bars).

### 4.4 Motion
- Easing: `power2.out` for UI; `power3.inOut` for camera moves; durations 0.4–1.2 s.
- Scroll: Lenis (lerp ~0.1) + GSAP ScrollTrigger `scrub: 1` for scroll-linked 3D.
- `prefers-reduced-motion: reduce` → disable scroll scrubbing & camera flights (jump-cut instead), keep content.

### 4.5 Aturan anti-vibecode (dari Howard, 8 Nov 2026 — wajib di semua halaman)
**DILARANG:**
- Drop shadow / glow pada teks.
- Gradien ungu/biru generik.
- Glassmorphism.
- Emoji sebagai ikon.
- Card dengan border-radius besar untuk semua konten.
- Semua elemen rata tengah.
- Gambar vektor/clipart buatan kode untuk pemandangan.
- Angka spasi acak.
- Lebih dari 1 animasi "wow" per layar.
- Teks generik ("Selamat datang di...", "Jelajahi dunia menakjubkan...").

**WAJIB:**
- Grid 12 kolom + skala spasi 8px (8/16/24/32/48/64/96/128) sebagai token.
- Type scale tetap (display/h1/h2/body/caption) sebagai token.
- Layout asimetris & editorial.
- Aset nyata (HDRI, foto, model 3D berlisensi).
- Satu set motion token (durasi & easing).
- Semua state (hover/focus/active/disabled/loading/empty/error).
- Cek di 1440px, 1024px, 390px.

**Proses setiap layar baru:** bangun HANYA berdasarkan desain yang sudah disetujui Howard (Figma/Claude Design).
Setelah membangun: screenshot Playwright, bandingkan dengan desain, daftar perbedaan, perbaiki sampai cocok.
Pakai skill ui-ux-pro-max untuk review akhir setiap layar.

---

## 5. Global features

### 5.1 Navigation & page flow
`Landing → Lab Sel → Gerbang Sel → Lab Osmosis → Kuis → Rangkuman → (↺ back to Landing)`.
Each page ends with the footer-next button (§4.3). Top nav allows jumping anywhere.

### 5.2 Page transitions
Use the **View Transitions API** (`@view-transition { navigation: auto; }` + a short fade/zoom) for cross-page
navigation; if unsupported, a simple fade-out overlay before `location.href`. On the landing→Lab Sel transition, the
last scene is black, so a black fade feels seamless.

### 5.3 Mode Tenang (calm mode)
Toggle in the nav, stored in `localStorage` (`sel:mode-tenang`). Auto-enabled if `prefers-reduced-motion` or if the
quality monitor drops to the lowest tier. In Mode Tenang: no WebGL; show still images (`public/img/fallback-*.webp`)
+ all text content + all interactions that don't need 3D (cards still open from a list). **The site must be fully
usable and fully readable in Mode Tenang.**

### 5.4 Loading
Per page: a minimal loader (thin progress line + "Menyiapkan lab…"). Preload the NEXT page's main asset during idle
time (`requestIdleCallback`) — e.g. load the Lab Sel models while the user scrolls the landing page.

### 5.5 Skip intro
Landing has a small `Lewati intro ↓` button that jumps to the end section.

### 5.6 Performance budget (enforce in `core/renderer.js` and `core/quality.js`)
- ONE `WebGLRenderer` per page; `setPixelRatio(Math.min(devicePixelRatio, 1.5))`; `antialias: true` only on tier high.
- Quality tiers: **high / medium / low / tenang**. Measure FPS for 2 s after load and continuously; if < 40 fps drop a tier
  (lower pixel ratio, fewer particles, disable bloom), if < 20 fps go Mode Tenang and tell the user with a small toast.
- Pause rendering when the tab is hidden or the canvas is off-screen (`IntersectionObserver`).
- Only the active scene renders; dispose geometries/materials/textures of scenes you leave.
- Models: compressed with meshopt or Draco, textures ≤ 1024 px WebP/KTX2. **Target ≤ 8 MB per model, ≤ 12 MB per page.**
- Instancing for anything repeated (fish school, phospholipids, ribosomes, particles).
- Fog to hide distant detail. Post-processing (bloom) only on tier high.

### 5.7 SEO/meta
Each page: `<title>`, meta description in Indonesian, Open Graph image, favicon (a simple cell glyph).

---

## 6. PAGE SPECIFICATIONS

> Content strings: `docs/KONTEN-MATERI.md`. Mockups were approved by Howard in chat; follow these descriptions.

### 6.1 Page 1 — Landing "SEL" (`index.html`) — cinematic dive into a Raja Ampat–style lagoon
> **Update 10 Nov 2026:** The existing Lab Sel button in the final scene replaces the duplicate landing footer. Use one continuous dark backdrop behind the journey through the bottom of the final scene.
> **Update 10 Nov 2026 (Howard):** scenes 3–8 below are replaced by a scroll-scrub video walkthrough (`src/pages/landing/scroll-sequence.js`, frames in `public/seq/`, text in `src/data/landing-beats.json`). Scenes 1–2 (island hero + ripple title + dive) still use Three.js.
**Concept:** a tropical lagoon where rainforest meets the sea (Raja Ampat). Blue, fresh, morning light.
One continuous journey downward: above water → dive → fish → **animal cell** → coral → seagrass (lamun) → **plant cell**
→ into the mud (summary) → black → button to Lab Sel. ~7–8 screens of scroll, `Lewati intro` available.

**Technique:** each depth level is its own small Three.js scene; switches are hidden behind transition shaders
(water-surface warp, zoom blur, fade). Camera and scene parameters are driven by ONE GSAP timeline scrubbed by
ScrollTrigger over a tall pinned section. Text panels are normal HTML positioned over the canvas.

| # | Scroll | Scene | On-screen text (see KONTEN §1) | Effects |
|---|---|---|---|---|
| 1 | 0–10% | Above the lagoon: rainforest edges (2.5D parallax image layers with fog between), rippling turquoise water plane | Title **SEL** + tagline, `Gulir untuk menyelam ↓`, `Lewati intro` | Water surface shader (ripples + sun glints), title effect §6.1.1, floating title on scroll |
| 2 | 10–20% | Camera dives through the surface | Intro text: what a cell is | Surface-crossing transition (wavy distortion → blue), drifting particles |
| 3 | 20–32% | Underwater: light rays, school of fish, camera follows one fish; **scale counter** appears (30 cm → 1 mm → 20 µm) | Virchow; cell size 10–100 µm | Fish swim vertex shader (instanced), god-ray planes, fog |
| 4 | 32–45% | Zoom into fish skin → **animal cell**; organelles light up one by one | Animal cell text + labels | "Jelly" translucent living membrane (noise wobble), organelle glow |
| 5 | 45–52% | Swim past coral | Coral is an animal fact | Coral sway |
| 6 | 52–68% | Seagrass meadow sways → zoom into a leaf → **plant cell** | Lamun fact + plant cell labels | Caustics on sand (animated texture), sway shader |
| 7 | 68–88% | Sink into the mud; colors mute | **"Dua sel, satu laguna"** comparison table + bacteria teaser | Darkening particles |
| 8 | 88–100% | Fade to black | "Ini baru permukaannya." / "Siap melihat lebih dalam?" + button **`Lanjut: Lab Sel →`** | Slow fade |

#### 6.1.1 Title effect (approved after 3 iterations — follow exactly)
- Real `<h1>SEL</h1>` and tagline exist in HTML (for SEO, screen readers, Mode Tenang); the WebGL version is drawn on top.
- Text rendered to a canvas texture (Montserrat 800 "SEL", letter-spaced; Cormorant Garamond Italic tagline below), shown on a full-screen quad.
- **At rest: 100% sharp, no motion.**
- **Cursor tilt (updated 10 Nov 2026):** up to 20° per axis with a shared 1000 px perspective for the title and supporting text. Ease back to neutral when the mouse leaves. Deepen the existing background gradient behind the text for contrast over the bright sky.
- **Cursor lens:** pixels within ~90 px of the cursor are displaced with smooth falloff and a slight sideways wave, up to ~20 px depending on cursor speed.
- **Ripple echo (updated 10 Nov 2026):** movement drops sources every ~40 px; rings expand at ~120 px/s, use a Gaussian band ~24 px, have amplitude 3–8 px, and fade over ~2.4 s. A click produces a 10 px ripple. Use summed rings in the fragment shader.
- Bilinear sampling (default texture filtering) so the bend looks like refraction, not jagged pixels.
- Touch: tap = one ripple. On scroll into scene 2, global ripple strength rises and the title sinks/fades.
- Reference look: unseen.co hero text; the ripple has no added glow.

### 6.2 Page 2 — Lab Sel (`sel.html`)
> **Update 10 Nov 2026:** Keep the main cell view fixed to the viewport on desktop, with the organelle list independently scrollable when needed. Keep small screens and detail content scrollable. During a cell change, the outgoing model moves sideways and away from the camera while fading, as the incoming model enters from the opposite side.
**Mood:** dark laboratory. Very dark background (`--c-lab`), faint grid, a spotlight cone from above, the cell resting on
a softly glowing **glass pedestal**, a few dust particles. No full lab 3D room (too heavy).

**Entry:** from black, a spotlight "switches on" (light intensity tween + subtle sound optional/off by default) and the cell fades in.

**Screen A — whole cell**
- Center: a **cutaway (half-sliced) 3D cell** — realistic style.
- **Cursor tilt:** the cell tilts toward the cursor (±25° yaw, ±15° pitch, eased), so the user can peek at its sides. No free spin. Touch: drag to tilt.
- **Swipe between cells:** ‹ › arrows, swipe gesture, ←/→ keys; dots `● Hewan  ○ Tumbuhan`. The current cell slides off the pedestal, the other slides in. Title changes: `SEL HEWAN` / `SEL TUMBUHAN`.
- **Hover an organelle:** it glows (emissive) and everything else dims → a pin + leader line + card appears (name, one-line function, `Lihat detail →`). One label at a time — never all labels at once.
- **Click / "Lihat detail":** camera flies into that organelle inside the cell (≈1 s), then crossfade to Screen B.
- Accessible list of organelles (collapsible side list) that triggers the same hover/click — needed for Mode Tenang, keyboard users, and for pointing during the presentation.
- Subtitle under the title (Cormorant italic): `Gerakkan kursor untuk melihat sisi lain`.

**Screen B — organelle detail**
- Large cutaway organelle model in the same style, tilts with the cursor.
- **Numbered pins** on its inner parts (same pin style). Click a pin → right panel shows **DESKRIPSI** and **FUNGSI** for that part (+ "Tahukah kamu?" where available).
- Top-left: `← Kembali ke sel` (camera zooms back out) + breadcrumb `Sel Hewan › Mitokondria › Krista`.
- Bottom: `‹ <organel sebelumnya>` · `<organel berikutnya> ›`.
- **Full-detail organelles** (with numbered parts): Nukleus, Mitokondria, Kloroplas, Badan Golgi, Retikulum Endoplasma.
  **Simple-detail organelles** (model + description + function, no numbered parts): the rest.
- Detail model source: preferably the organelle isolated from the cell model (hide others, frame camera); otherwise a separate model or a generated Three.js model (see §7). Example of a generated mitochondria already approved: capsule outer membrane, inner membrane band, extruded cristae, teal matrix, instanced ribosomes, DNA rings, clipping-plane cutaway.

**Footer:** `Lanjut: Gerbang Sel →` — on click, camera zooms toward the cell membrane surface, then page transition.

### 6.3 Page 3 — Gerbang Sel (`gerbang-sel.html`) — membrane & transport, fully 3D
**Entry:** continues the zoom: we land on the membrane surface.

**Layout:** same dark lab. Center: a 3D membrane block (cutaway like a textbook); label `LUAR SEL` above, `DALAM SEL` below.
**Mode chips:** `Struktur` · `Difusi` · `Difusi Terfasilitasi` · `Osmosis` · `Pompa Na⁺/K⁺` · `Endositosis` · `Eksositosis` (+ `Kotranspor` if time).
**Controls:** `Masuk` / `Keluar` toggle (where meaningful), ▶ Play · ⏸ Pause · `Langkah berikutnya` · ↺ Ulangi · speed slider.
**Hover/select:** identical pin+card system as page 2 on every membrane part, protein, and molecule.

| Mode | 3D behavior | Content ref |
|---|---|---|
| Struktur | Layers separate a bit (exploded view); pins on fosfolipid (kepala hidrofilik/ekor hidrofobik), protein integral, protein perifer, glikoprotein, glikolipid | KONTEN §4.1 |
| Difusi | O₂ / CO₂ molecules slip between phospholipids from high → low concentration; particle counters each side | §4.2 |
| Difusi terfasilitasi | Glucose passes via a **carrier protein that changes shape**; ions via a **channel protein** | §4.2 |
| Osmosis | Water molecules cross the membrane from hipotonik → hipertonik side; ends with a link card `Lihat efeknya pada sel → Lab Osmosis` | §4.2 |
| **Pompa Na⁺/K⁺** (must-have) | One highlighted pump protein; **Na⁺ = orange spheres, K⁺ = red cubes, ATP = yellow star**; 6-step cycle with captions; counters (Na⁺ keluar, K⁺ masuk, ATP terpakai, siklus); concentration bars both sides (Na⁺ accumulates outside, K⁺ inside → "melawan gradien"); charge indicator (+ luar / − dalam) | §4.3 |
| Endositosis | Membrane dents, wraps a particle, pinches off a vesicle (needs a deformable generated membrane patch) | §4.4 |
| Eksositosis | Golgi vesicle travels to membrane, fuses, releases contents | §4.4 |
| Kotranspor (if time) | Proton pump pushes H⁺ out; H⁺ flows back in **together with sucrose** through a cotransporter | §4.4 |

Must-have for Wednesday: Struktur, Difusi, Difusi terfasilitasi, Osmosis, Pompa Na⁺/K⁺. Nice-to-have: Endo/Eksositosis, Kotranspor.
Molecules are generated in Three.js (instanced spheres/cubes/hexagons) on top of the membrane model.
**Footer:** `Lanjut: Lab Osmosis →`.

### 6.4 Page 4 — Lab Osmosis (`lab-osmosis.html`) — microscope + pre-rendered videos (approved mockup)
- Header: eyebrow `SEL · LAB OSMOSIS`, title `LAB OSMOSIS`, italic subtitle `Teteskan larutan, lalu amati apa yang terjadi pada sel.`
- Toggle: `Sel Hewan` (sel darah merah) | `Sel Tumbuhan` (sel epidermis bawang merah).
- **Round microscope view** (black eyepiece vignette, label `SEL DARAH MERAH · 400×`) containing a `<video>` (muted, playsinline).
- Three solution buttons: **Hipotonik** (lebih encer dari isi sel) · **Isotonik** (sama dengan isi sel) · **Hipertonik** (lebih pekat dari isi sel).
- Click → drop animation falls onto the slide + ripple → video plays from "normal" to the result; blue water-direction arrows overlay.
- Meters: **Volume sel** (both), **Tekanan turgor** (plant only).
- **Hasil Pengamatan** panel below: state name, ARAH AIR, MENGAPA, CONTOH NYATA (KONTEN §5).
- Scroll further: summary of the 6 states + "Ingat!" box · **"Bukti nyata dari praktikum kami"** (Howard's microscope photos, if provided) · 3 questions "Tebak keadaan sel ini" · (if time) 4-solution practicum (aquades, NaCl 0,1/0,5/1%) labelled clearly as practicum results.
- **Videos:** 6 clips (2 cells × 3 solutions), 4–6 s, ~1 MB each, `.webm` + `.mp4`, plus poster images. Produce them with `tools/render-osmosis.html` (a Three.js scene in the same visual style, recorded with `MediaRecorder` at 1080p/30fps). Fallback if no time: render the same animation live (2D SVG/canvas like the approved mockup).
- **Footer:** `Lanjut: Kuis →`.

### 6.5 Page 5 — Kuis (`kuis.html`)
**Top bar:** title + **`Mode Ujian`** button in the top-right. Default = Mode Latihan.

**Mode Latihan**
- Choose topic: `Semua` · `Sel & Organel` · `Sel Hewan vs Tumbuhan` · `Membran & Transpor` · `Osmosis`; number: 5 / 10 / 15.
- Standard multiple choice (one correct answer, 4 options). After answering: instant ✓/✗ (green/red), short explanation, link `Pelajari lagi →` to the related page (and anchor/organelle when possible).
- End: score + `Ulangi soal yang salah` + `Ganti topik`.

**Mode Ujian**
- Start screen with rules → `Mulai Ujian`.
- **25 questions, 30:00 timer** (top-right; yellow at ≤ 10:00, red at ≤ 5:00; auto-submit at 0:00). Questions drawn randomly per exam with this split: Sel & jenisnya 4 · Organel & bagiannya 8 · Membran & transpor 7 · Osmosis 6. Shuffle question order and option order.
- Navigator grid 1–25 (answered = filled, ragu-ragu = yellow, empty = grey), `Sebelumnya` · `Berikutnya` · `Tandai ragu-ragu`. No feedback until submit. Warn if empty answers remain.
- **Report:** score `21/25`, nilai (0–100), predikat (A ≥ 85, B 70–84, C 55–69, D < 55 — adjustable constants), time used, benar/salah/kosong; **bar per topic**; **Kelebihan** (topics ≥ 80%) and **Perlu dipelajari lagi** (topics < 60%, with the specific concepts missed + button to that page); full review (your answer, correct answer, explanation); buttons `Ulangi Ujian` · `Latihan Topik Lemah` · `Unduh Report Card` (PNG via html-to-image).
- Save last results in `localStorage` (`sel:kuis-riwayat`), show on the start screen.
- Bars are plain HTML/CSS (no chart library).
- **Footer:** `Lanjut: Rangkuman →`.

### 6.6 Page 6 — Rangkuman & Kredit (`rangkuman.html`)
1. **Rangkuman** — 5 cards (Sel · Sel Hewan & Tumbuhan · Organel · Membran & Transpor · Osmosis), each with key points and `Buka lagi →`.
2. **Sumber & Kredit** — rendered from `credits.json`, grouped: Sumber materi · Model 3D · Video & gambar · Font & library · Inspirasi desain · Penggunaan AI (honest statement).
3. **Anggota Kelompok 4 · XI-A5** — members table + subject, teachers, school, year.
4. Closing line `Kecil, tapi menyusun segalanya.` + button `↺ Selam lagi dari awal`.

---

## 7. 3D asset strategy (decide during Phase 0 — do NOT spend more than ~1 hour total on asset hunting)

### 7.1 Requirements for any model used for hover/click
- Organelles must be **separate meshes or separate materials**, so they can be highlighted individually.
- License must allow use (CC BY, CC BY-SA, CC BY-NC, CC BY-NC-SA are OK for this school project; CC0 ideal).
  **Not OK:** no license, "all rights reserved", ND (NoDerivatives) if we modify/compress the file.
- After compression ≤ 8 MB.

### 7.2 Candidates already researched (verify each with `tools/inspect-model.mjs` before use)
| Use | Candidate | License | Notes |
|---|---|---|---|
| Animal cell (page 2) | "Animal cell 2.0 – annotated in English" by **montanna** (Sketchfab, remix of Lauri Purhonen's model). A copy with embedded license metadata exists in GitHub repo `patrickzhou1234/BiologySimulation` → `models/animal_cell.glb` (70 MB) | **CC BY 4.0** | 23 materials; organelles separable by material (~2000 ribosome meshes share one material). No textures → realism comes from our lighting/materials (§7.4). Must compress heavily. |
| Plant cell (page 2) | "Plant CELL" by **NaraXR** (Sketchfab, needs Howard's free login to download) | CC BY-NC | 25 materials, 2048 px textures, 13 MB |
| Plant cell alt. | "Plant Cell \| Biology" by **okchs** (Sketchfab) | CC BY | 17 materials, 8.7 MB |
| Membrane (page 3) | **"cell membrane" by 2amz** (Sketchfab) — Howard's choice | CC BY-NC-SA | 5 materials, 6.5 MB GLB |
| Membrane alt. | "Cell membrane" by **Lukas Ded** (copy in the same GitHub repo `models/cell_membrane.glb`) | CC BY | 58 meshes |
| Golgi detail | "Golgi Apparatus/Complex" by **MajoraMaster** (GitHub copy `models/golgi.glb`) | CC BY | 1.6 MB |
| Mitochondria detail | "Mitocondrias" by **3D_UTPL** (GitHub copy `models/mitocondrias.glb`) | CC BY-NC-SA | textured, 2.1 MB |
| Embed alternative (only if Howard chooses it) | Vida Systems "Plant Cell – Cell Structure" + organelle set, Gaia Tech "Animal Cell" via **Sketchfab Viewer API** | embed only (ND / not downloadable) | Needs internet; Sketchfab logo; hover via `nodeMouseEnter`, highlight via `highlightMaterial`, camera via `setCameraLookAt` |
| Fish / coral / seagrass (landing) | Low-poly CC0 packs (e.g., Quaternius, Kenney) or simple generated geometry | CC0 | Keep tiny |

Rejected (don't use): `gordensun/learningcell`, `limin112/cell` (AI-generated single mesh, no usable license), `cclank/cell-architecture-studio` plant/WBC (unknown provenance), NIH 3D "Animal Cell" STL (single colorless mesh), `erick1439/3d-cell-model` (no license).

### 7.3 Fallback = generate with Three.js (always acceptable)
If a candidate fails the checks, build the cell/organelle procedurally: lathe/capsule shapes, extruded cristae/thylakoid
stacks, instanced ribosomes, clipping-plane cutaways, the shared materials of §7.4. Keep the same lighting so it matches.
The membrane for Endositosis/Eksositosis is generated anyway (instanced phospholipids on a deformable surface, ~800 instances).

### 7.4 "Lab realism" look (shared in `core/materials.js`)
- Environment lighting from `RoomEnvironment` + PMREM (or a small HDRI), ACES filmic tone mapping, sRGB output.
- Key light (warm, top-left), cool rim light (back-right), dim fill. Spotlight on the pedestal (page 2).
- `MeshPhysicalMaterial` with clearcoat 0.4–0.6, roughness 0.35–0.6; cytoplasm/membrane slightly translucent (transmission or opacity) — test cost on school laptop.
- Optional subtle noise normal map for organic surfaces; bloom only on tier high.
- When a downloaded model's materials look flat, **replace its materials by name/index with ours** (allowed for CC BY / BY-NC / BY-SA, mention "dimodifikasi" in credits).

### 7.5 Pipeline
1. Put originals in `assets-src/` (gitignore files > 50 MB).
2. `node tools/inspect-model.mjs assets-src/x.glb` → list nodes, meshes, materials, triangle count, textures. Record in `docs/ASSETS.md`.
3. `npm run compress` (runs `tools/compress-models.mjs`), equivalent to: `npx gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp --texture-size 1024` (add `--simplify` carefully for >300k triangles).
4. Map materials/nodes → organelle IDs in `src/data/organel.json` (`"meshMatch": {"material": "Material.010"}` etc.).
5. Add credit entry. Test FPS. Commit.

---

## 8. Data schemas (create these files; fill from KONTEN-MATERI)

```jsonc
// src/data/organel.json
{
  "cells": {
    "hewan": { "title": "SEL HEWAN", "model": "/models/animal-cell.glb", "organelles": ["membran-plasma","sitoplasma","nukleus","mitokondria","re-kasar","re-halus","ribosom","golgi","lisosom","peroksisom","sentriol"] },
    "tumbuhan": { "title": "SEL TUMBUHAN", "model": "/models/plant-cell.glb", "organelles": ["dinding-sel","membran-plasma","sitoplasma","nukleus","mitokondria","kloroplas","vakuola","re-kasar","re-halus","ribosom","golgi","peroksisom"] }
  },
  "organelles": {
    "mitokondria": {
      "name": "Mitokondria",
      "short": "Tempat respirasi sel yang menghasilkan energi (ATP).",
      "membrane": "ganda",
      "detail": "full",                      // "full" | "simple"
      "meshMatch": { "hewan": {"material": "?"}, "tumbuhan": {"material": "?"} },
      "parts": [
        { "id": "membran-luar", "name": "Membran luar", "deskripsi": "...", "fungsi": "..." }
      ],
      "tahukahKamu": "...",
      "sumber": ["slide-bab1", "slide-update2"]
    }
  }
}
```
```jsonc
// src/data/soal.json — at least 60 questions, ~15 per topic
[{ "id": "org-01", "topik": "organel", "konsep": "krista",
   "soal": "Bagian mitokondria berupa lipatan membran dalam yang memperluas permukaan untuk respirasi adalah ...",
   "opsi": ["Matriks", "Krista", "Stroma", "Tilakoid"], "jawaban": 1,
   "penjelasan": "Krista adalah lipatan membran dalam ...", "halaman": "sel.html#mitokondria", "status": "perlu-cek" }]
// topik ∈ "sel" | "organel" | "membran" | "osmosis"   (Kuis UI "Sel & Organel" = sel+organel; "Sel Hewan vs Tumbuhan" = items tagged konsep "hewan-vs-tumbuhan")
// status: "perlu-cek" until Howard approves → "ok"
```
```jsonc
// src/data/credits.json
[{ "kategori": "model3d", "judul": "Animal cell 2.0 - annotated in English", "pembuat": "montanna",
   "lisensi": "CC BY 4.0", "url": "https://sketchfab.com/3d-models/animal-cell-20-annotated-in-english-0d9f7f4257224975b2ef83a283709b2f",
   "catatan": "dikompresi dan material dimodifikasi", "dipakaiDi": ["sel.html"] }]
// kategori ∈ "materi" | "model3d" | "media" | "font" | "library" | "inspirasi" | "ai"
```
`membran.json`, `osmosis.json`, `rangkuman.json`: simple objects keyed by mode/state/card mirroring KONTEN §4, §5, §7.

---

## 9. Report support (Pertemuan 3–5 need evidence)
- `docs/LOG.md` — dated entries; problems + solutions (BAB IV "Kendala", BAB VI "Evaluasi").
- `docs/laporan/screenshots/` — after each phase: desktop 1440×900 + mobile 390×844 screenshots of each page, named `fase2-landing-desktop.png` etc. (BAB IV "Tangkapan layar prototype", BAB VI "Dokumentasi").
- `docs/CEK-MATERI.md` — every content doubt + the teacher's answer (BAB V "Validasi materi").
- `docs/PENJELASAN_KODE.md` + PDF (presentation prep).

---

## 10. Build plan

### 10.1 Phases (do them in this order)
| Phase | Goal | Done when |
|---|---|---|
| **−1. Skills & tools** (Sun night, first 15 min) | §12.1 skills installed, §12.2 tools checked | Skills listed as loaded |
| **0. Setup & audit** (Sun night) | Vite multi-page project, tokens, base CSS, nav, footer-next, empty 6 pages; git + GitHub repo; Vercel deploy of the skeleton; asset audit (§7) → `docs/ASSETS.md` | Skeleton deployed, all links work, asset decision written |
| **1. Content-first skeleton** (Sun night/Mon morning) | ALL 6 pages with their real text, cards, tables, quiz (practice mode), credits, members — **no 3D yet**, Mode Tenang look | Site already passes the teacher's minimum requirements |
| **2. Landing 3D** (Mon) | Scenes 1→2 first (title effect + dive), test on a weak laptop; then 3–8 | Smooth ≥ 40 fps on tier medium |
| **3. Lab Sel 3D** (Mon/Tue) | Cell viewer, tilt, hover/glow/card, swipe, detail screen for 5 full organelles | Hover never mis-picks; back/next work |
| **4. Gerbang Sel 3D** (Tue) | Membrane stage + Struktur, Difusi, Difusi terfasilitasi, Osmosis, **Pompa Na⁺/K⁺** | Pump cycle correct (3 Na⁺ out, 2 K⁺ in, 1 ATP) |
| **5. Lab Osmosis** (Tue) | Microscope UI + 6 clips (or live fallback) | All 6 states correct |
| **6. Kuis ujian + report** (Tue) | Exam mode, timer, navigator, report, download | 25 q / 30 min / per-topic analysis works |
| **7. Polish & QA** (Tue night/Wed morning) | §10.2 checklist, final deploy, screenshots, `PENJELASAN_KODE.pdf` | Howard can demo offline-safe (Mode Tenang) and online |

### 10.2 QA checklist (run before every deploy)
- [ ] All nav links + footer buttons + "Pelajari lagi" links work; no 404s.
- [ ] No console errors on any page; `npm run build` passes.
- [ ] Each page usable at 390 px width; text readable on a projector (contrast, size).
- [ ] Mode Tenang works on every page and is remembered.
- [ ] FPS ≥ 40 on a mid laptop (tier medium); auto-downgrade works.
- [ ] All content matches `KONTEN-MATERI.md`; spelling (nukleolus, pinositosis, Na⁺/K⁺ — never "Na3+").
- [ ] Every asset has a credits entry; page 6 shows them.
- [ ] Quiz: timer colors, auto-submit, report math, download PNG.
- [ ] Keyboard: tab through nav, buttons, quiz options; visible focus ring.

### 10.3 MVP fallback order (if time runs out — `mode darurat`)
Keep, in this order of priority: (1) 6 pages with correct content + navigation + credits (Phase 1) →
(2) Landing scenes 1–2 + simplified rest → (3) Lab Sel hover/card/swipe (detail screens can be simple) →
(4) Kuis exam + report → (5) Pompa Na⁺/K⁺ → (6) Osmosis live 2D fallback → (7) everything else.
Never leave a half-working 3D feature visible; hide it behind Mode Tenang content instead.

---

## 11. Deployment
- GitHub repo (public, so the teacher can read the source): `sel-kelompok4` (or Howard's choice). Include a README in Indonesian: what the site is, how to run (`npm install`, `npm run dev`), structure, credits link.
- Vercel: framework preset "Vite", build `npm run build`, output `dist`. Every push to `main` deploys.
- Large original assets are not committed; only compressed files in `public/`.

---

## 12. Skills & tools to use in this project

### 12.1 First-session setup — install these skills (do this BEFORE Phase 0)
At the very start of the first session, check which skills are already installed (list `.claude/skills/`,
`.agents/skills/` and the user-level skills folder). Then show Howard the install commands for the missing ones,
and run them **after he says ok**. Run them from the project root (`C:\Users\p4ulu\Desktop\Codes\sel`) in PowerShell:

```powershell
# 1. Three.js knowledge (fundamentals, geometry, materials, lighting, textures, loaders, shaders, postprocessing, interaction, animation)
npx skills add cloudai-x/threejs-skills -y

# 2. Official GSAP skills (core, timeline, scrolltrigger, plugins, performance)
npx skills add https://github.com/greensock/gsap-skills -y

# 3. Frontend design quality (Anthropic)
npx skills add anthropics/skills --skill frontend-design -y

# 4. Web design / accessibility review (Vercel)
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -y

# 5. Skill discovery (Howard already has this one; install only if missing)
npx skills add vercel-labs/skills --skill find-skills -y
```
Notes:
- If a command fails because the CLI asks interactive questions, rerun without `-y` and let Howard answer, or use
  `npx skills find <keyword>` to locate the correct package name.
- `npx skills` may install into `.agents/skills/`. If Claude Code does not pick them up, copy each skill folder
  into `.claude/skills/` (project) and tell Howard.
- After installing, restart the session (or reload) so the skills are loaded, then confirm by listing them.
- Optional searches with find-skills if a need appears: `npx skills find lenis`, `npx skills find gltf`,
  `npx skills find webgl performance`, `npx skills find accessibility`.

### 12.1b Howard's own installed skills — USE THEM
Howard already has his own skills installed (for example **caveman** and **ui-ux-pro-max**). At the start of EVERY
session: list all available skills (project + user level), and in your first reply show a one-line table of which ones
you will use for this project. Use them whenever the task matches, with these rules:

| Skill | When to use | Rules for this project |
|---|---|---|
| **caveman** (and its stronger variants if installed) | **Default style for your chat replies to Howard** — status updates, plans, short answers, progress reports. Saves tokens and time. | **Never** use caveman style for: `docs/PENJELASAN_KODE.md`, `docs/KONTEN-MATERI.md`, `docs/LOG.md`, any text shown on the website, commit messages, or when Howard says `jelasin` / `jelaskan` / `uji aku` / asks "kenapa" — those must be full, clear Indonesian sentences because Howard must understand them and the teacher may read them. If Howard says "normal mode", stop caveman for the rest of the session. |
| **ui-ux-pro-max** | Before building or restyling any page/component: pick layouts, spacing, interaction patterns, states (hover/focus/active/disabled), accessibility checks; review each page in Phase 7 QA | Must respect the design system in §4 (colors, fonts, dark lab look). Use it to refine, not to replace the approved concept or mockups. |
| **frontend-design** | Visual polish, typography rhythm, distinctive details | Same as above — stay inside §4 |
| **threejs-\*** | Any Three.js work (scenes, shaders, loaders, raycasting, post-processing) | Follow §5.6 performance budget |
| **gsap-\*** | Scroll timelines, ScrollTrigger, UI tweens | Respect `prefers-reduced-motion` |
| **web-design-guidelines** | Accessibility / UX audit before each deploy | Fix all "must" issues |
| **find-skills** | When a need appears that no installed skill covers | Ask Howard before installing anything new |
| Any other skill Howard has | If its description matches the task | Mention it in your plan ("pakai skill X untuk ...") |

If ui-ux-pro-max is missing, find it with `npx skills find ui-ux-pro-max` and ask Howard before installing.
If caveman is missing, just write short, direct replies.

### 12.2 Tools Howard must have on Windows (check with the commands, help install if missing)
| Tool | Check | Why |
|---|---|---|
| Node.js LTS (≥ 20) | `node -v` | Vite, npx skills, gltf-transform |
| Git | `git --version` | Version control |
| GitHub account + `gh` CLI (optional) | `gh --version` | Create the repo |
| Vercel account (+ Vercel CLI optional: `npm i -g vercel`) | `vercel --version` | Deploy |
| Sketchfab account (free) | — | Only if downloading NaraXR / 2amz models |
| A Chromium browser | — | Testing + View Transitions |

Windows specifics: use PowerShell; write helper scripts as Node `.mjs` files (not `.sh`); use `npm run` scripts for
tools (e.g. `"compress": "node tools/compress-models.mjs"`); paths in code always use forward slashes.

### 12.3 Use these skills when the task matches
- **threejs-fundamentals / threejs-geometry / threejs-materials / threejs-lighting / threejs-textures / threejs-loaders / threejs-shaders / threejs-postprocessing / threejs-interaction / threejs-animation** (cloudai-x/threejs-skills)
- **gsap-core / gsap-timeline / gsap-scrolltrigger / gsap-performance** (greensock/gsap-skills, official)
- **frontend-design** (anthropics/skills) — for layout and visual polish
- **web-design-guidelines** (vercel-labs/agent-skills) — for accessibility/UX review before deploy
- **find-skills** — if a need appears that no skill covers (e.g. `npx skills find lenis`, `npx skills find gltf`)
- Playwright / browser tool (if available) — screenshots for the report + basic smoke tests
- Vercel MCP (if connected) — deploy status and logs

---

## 13. Open items (ask Howard when relevant, don't block on them)
- Teacher names (Biologi & Web Development) for page 6.
- Name spelling: "Junaedi" (used here) vs "Juneadi" (in the Pertemuan 2 file) — confirm.
- Final choice of plant cell model and whether to use the Sketchfab embed alternative.
- Microscope photos/videos from the class osmosis practicum (for page 4 "Bukti nyata").
- Content doubts listed in `docs/KONTEN-MATERI.md` §9.
