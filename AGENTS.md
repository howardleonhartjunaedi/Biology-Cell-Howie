# AGENTS.md (Codex instructions for this repo)

Read `CLAUDE.md` (master spec, §4.5 anti-vibecode rules) and `docs/KONTEN-MATERI.md` (biology content source of truth) before changing anything.


Last updated: 10 Nov 2026. Presentation day: **Wednesday 11 Nov 2026**.

## 1. Project
- **What:** "SEL", an educational biology website about cells (animal vs plant), set in a lagoon/reef story. Indonesian-language UI.
- **Who:** Howard Leonhart Junaedi, Kelompok 4, XI-A5.
- **Path:** `C:\Users\p4ulu\Desktop\Codes\sel` (Vite + vanilla JS + Three.js + GSAP/ScrollTrigger + Lenis).
- **Pages:** Beranda (landing, `index.html`), Lab Sel (3D cell viewer), Osmosis, Kuis (68 questions), Rangkuman.

## 2. Source-of-truth files (read these first)
| File | Role |
|---|---|
| `CLAUDE.md` | Master spec. §4.5 = anti-vibecode rules. §6.1 = landing notes. |
| `docs/KONTEN-MATERI.md` | Biology content source of truth. **Never invent biology facts.** |
| `docs/PENJELASAN_KODE.md` | Code explanations in Indonesian (update per feature). |
| `docs/LOG.md` | Work log (add an entry per feature). |
| `docs/ASSETS.md` | 3D model material/mesh → organelle mapping tables. |
| `src/data/credits.json` | All asset credits/licenses. |
| `src/styles/tokens.css` | Design tokens (colors, spacing, type). |
| `docs/laporan/screenshots/` | Before/after screenshots. |

## 3. Rules to keep
- Workflow per feature: build → verify (Playwright/browser) → explain in PENJELASAN_KODE (Indonesian) → log in LOG.md → commit.
- Do not download files without asking. Do not add dependencies without asking.
- Never enter credentials. Howard runs `gh auth login` / `vercel login` himself.
- Commit only, do not push unless asked.
- Docs, commits and website text: normal Indonesian/English, no gimmick styles.
- Use design tokens, not raw values (§4.5).
- Be honest in labels: renders are labeled as renders, illustrations "bukan skala sebenarnya".

## 4. Recent commits
| Commit | What |
|---|---|
| 593804c | Applied §4.5 anti-vibecode rules on all pages (tokens, `:active` scale, hover states, quiz report download states). |
| 382b35b, ae77c6e | Lab Sel uses downloaded 3D models (montanna animal cell, okchs plant cell), Draco-compressed, raycast organelle picking, MeshPhysicalMaterial, opaque membrane/cytoplasm. |
| 0f9c50b | Landing walkthrough replaced by AirPods-style scroll-scrub video (not pushed). |

## 5. Landing scroll-scrub (current state)
- **Video:** `assets-src/walkthrough.mp4` (34.5 s), built by `tools/make-walkthrough.mjs` (ffmpeg, 1 s crossfades, teal grade). Order: surface → fish → animal-cell render → coral (Gili) → seagrass + turtle → microscope photo → plant-cell render → seabed.
- **Frames:** `tools/make-frames.mjs` → `public/seq/` 345 WebP frames, 10 fps, 1280 wide, quality 55, 17.5 MB; writes `src/data/seq.json`.
- **Runtime:**
  - `src/pages/landing/scroll-sequence.js`: GSAP pin `+=600%`, scrub 0.5.
  - `sequence/frames.js`: staged preload, every 8th frame first, nearest frame shown, loader until 25%, every 2nd frame under 768px.
  - `sequence/plane.js` + `shaders/sequence.*.glsl`: WebGL plane with grain, vignette, cursor ripple, drawn by the single renderer in `stage.js`.
  - `sequence/canvas2d.js`: 2D fallback.
  - `sequence/panels.js` builds text panels from `src/data/landing-beats.json` (6 beats, text from KONTEN §1).
  - Mode Tenang / reduced motion: 6 still frames.
  - `#ringkasan` table "Dua sel, satu laguna" and CTA over the last frame.
- **Styles:** `src/pages/landing/sequence.css`.
- Swap video: replace `assets-src/walkthrough.mp4`, run `node tools/make-frames.mjs`.

## 6. Lab Sel models
- `public/models/animal-cell.glb` (1.8 MB), `public/models/plant-cell.glb` (0.76 MB); Draco decoder local in `public/draco/`.
- `src/pages/sel/glb-cell.js` (material/node → organelle maps), `lab-viewer.js`, `cell-models.js` (procedural fallback), `highlight.js`.
- Verified: all 11 animal and 12 plant organelles pickable.

## 7. Known content caveats (tell the teacher)
- Cell clips are 3D renders, not microscope footage.
- Microscope photo is a leaf with stomata, not seagrass (labeled).
- Seabed footage is sand; KONTEN says "lumpur" (mud).

## 8. Open review findings (not yet fixed)
**UI polish (verdict: Block)**
- HIGH: plain `:hover` sticks on touch. Wrap in `@media (hover: hover)`: `polish.css:51,55,59-62,85-86,90`; `components.css:71,186,225,396`; `kuis.css:59,136,336`; `osmosis.css:87`; `sel/detail.css:83`; `sel/lab.css:177`; `landing/hero.css:106`.
- MEDIUM: press scale `polish.css:106` 0.97 → 0.96, and add `transform` to the transition list at `polish.css:46` (150ms ease-out).
- LOW: `:not(:disabled):active` on all press selectors; `will-change` only under `.sequence-live .beat__line { will-change: transform }`; `.still__image` outline `1px solid oklch(1 0 0 / 0.1)`, offset −1px.

**Typography (verdict: Approve with work)**
- MEDIUM: `.beat__quote-text` add `font-weight: 500` (only Cormorant italic 500 is loaded).
- MEDIUM: `.beat__lead`, `.beat__fact` add `max-width: 62ch`.
- MEDIUM: scale line weight 800 → 600; keep 800 for titles, 600 emphasis, 400 body.
- LOW: `.beat__terms` body size and `line-height: 1.5`; title tracking 0.08em → 0.02em; `text-wrap: balance` on title/poetic/quote, `pretty` on lead/fact/note.
- LOW: add tokens `--fw-black/semibold`, `--lh-tight/heading/body`, `--ls-caps`.
- Not verified: scale line at 320px / 200% zoom; note contrast over coral frame.

## 9. Pending / untested
- Frame rate on the school laptop and a real phone (only tested on an RTX 5060 Ti: 129 fps).
- Push + Vercel deploy (Howard logs in himself).
- Teacher review of the 68 quiz questions; teacher names for Rangkuman.
- `PENJELASAN_KODE.pdf` export.
