# LOG PEMBUATAN WEBSITE SEL

Catatan harian untuk laporan (BAB IV Kendala, BAB VI Evaluasi).

## Minggu, 8 November 2026 — Fase −1 dan Fase 0

**Yang dikerjakan**
- Fase −1: mengecek skill dan alat. Skill GSAP, frontend-design, web-design-guidelines, dan find-skills sudah ada.
  Skill Three.js (cloudai-x/threejs-skills) dipasang. GitHub CLI 2.103.3 dan Vercel CLI 65.12.1 dipasang.
  Node.js 24.20.0 dan Git 2.55 sudah tersedia.
- Fase 0: membuat proyek Vite multi-halaman dengan 6 halaman kosong (Beranda, Lab Sel, Gerbang Sel, Lab Osmosis,
  Kuis, Rangkuman). Membuat token warna, gaya dasar, navigasi atas dengan tombol Mode Tenang, menu ponsel,
  dan footer "Lanjut" dengan titik progres di setiap halaman.
- Memasang library yang disetujui: vite, three, gsap, lenis, dan @gltf-transform (alat kompres model).
- Membuat alat `tools/inspect-model.mjs` dan `tools/compress-models.mjs` untuk audit model 3D.

**Kendala dan solusi**
- Tombol "Menu" muncul di layar laptop padahal seharusnya hanya di ponsel. Penyebab: aturan CSS `.toggle` ditulis
  setelah `.nav__menu-button` sehingga menimpanya. Solusi: memakai selektor yang lebih spesifik `.nav .nav__menu-button`.
- Repositori GitHub model 3D (BiologySimulation) ternyata sudah pindah nama; data diambil dari alamat barunya.

**Langkah berikutnya**
- Mengunduh dan memeriksa model 3D kandidat, lalu menulis keputusan di `docs/ASSETS.md`.
- Membuat repositori GitHub dan deploy pertama ke Vercel.
- Fase 1: mengisi semua halaman dengan teks materi asli.
