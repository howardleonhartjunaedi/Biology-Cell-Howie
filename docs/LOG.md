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

## Minggu, 8 November 2026 (lanjutan) — Aturan desain dari skill
**Yang dikerjakan**
- Membaca skill desain yang dipasang Howard (design-taste-frontend, ui-ux-pro-max, impeccable, no-ai-design-slop,
  make-interfaces-feel-better, frontend-design) dan merangkumnya di `docs/DESIGN.md`.
- Mengaudit kerangka yang sudah dibuat terhadap aturan itu dan memperbaikinya: kontras warna abu-abu, ukuran area klik 44 px,
  tautan "Langsung ke isi", transisi yang spesifik, tombol tekan, perataan teks, warna seleksi dan scrollbar.

**Kendala dan solusi**
- Warna abu-abu bawaan desain ternyata gagal uji kontras (2,7–4,3 : 1). Solusi: warna baru yang diukur 5,2–6,2 : 1.
- Muncul error "Transition was skipped" di console setiap pindah halaman. Solusi: skrip kecil di `<head>` yang menangkap
  lompatan transisi (`public/view-transition.js`). Dicek di versi build: tidak ada error baru.
- Beberapa aturan skill bertentangan dengan rancangan yang sudah disetujui (eyebrow, panah di tombol). Dicatat di
  `docs/DESIGN.md` bagian 4 untuk diputuskan Howard.

## Minggu, 8 November 2026 (lanjutan) — Beranda versi teks
**Yang dikerjakan**
- Memakai skill cinematic-gsap-lenis-motion-system (gulir halus Lenis + ScrollTrigger), build-threejs-scroll-worlds
  (rencana satu dunia 3D yang dikendalikan gulir, untuk Fase 2), dan landing-page-design (efek kata menyala saat digulir).
- Membuat 8 adegan Beranda lengkap dengan teks dari KONTEN-MATERI §1, tabel "Dua sel, satu laguna", dan tombol "Lewati intro".
- Warna latar adegan makin gelap mengikuti kedalaman.

**Kendala dan solusi**
- Menu atas pecah menjadi dua baris di layar sedang. Solusi: `white-space: nowrap` dan menu ponsel mulai di lebar 1000 px.
- Kata "bakteri" terpisah ke baris sendiri di kotak fakta karena aturan CSS lama. Solusi: aturan itu dihapus.
- Skill landing-page-design melarang huruf miring dan meminta struktur halaman jualan (FAQ, harga). Tidak dipakai karena
  Beranda adalah perjalanan belajar, bukan halaman jualan, dan rancangan sudah disetujui.
