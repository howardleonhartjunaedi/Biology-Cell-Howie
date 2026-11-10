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

## Minggu, 8 November 2026 (lanjutan) — Beranda 3D lengkap (adegan 1–8)
**Yang dikerjakan**
- Satu kanvas WebGL di belakang teks, dikendalikan posisi gulir lewat "dirigen" (`conductor.js`) dan naskah `landing-chapters.json`.
- Adegan 1–2: laguna dengan shader air, pulau hutan 2.5D, efek riak judul SEL, menyelam menembus permukaan, sinar cahaya, gelembung.
- Adegan 3 dan 5: kawanan ikan (instancing) yang diikuti kamera, taman karang bergoyang.
- Adegan 4: sel hewan ilustrasi; organel menyala bergiliran sinkron dengan daftar teks.
- Adegan 6: padang lamun dengan pola kaustik, lalu sel tumbuhan (dinding sel, kloroplas, vakuola menyala bergiliran).
- Adegan 7–8: lumpur dengan sedimen, lalu memudar ke hitam sebelum tombol "Lanjut: Lab Sel".
- Pengatur kualitas otomatis, Mode Tenang mematikan 3D, render berhenti saat tab disembunyikan.

**Kendala dan solusi**
- Ekor ikan terbalik (terlihat seperti mata panah). Solusi: kerucut ekor diputar ke arah sebaliknya.
- Butiran terlihat kotak saat dekat kamera. Solusi: tekstur titik bulat.
- Fungsi butiran menimpa posisi tinggi yang diatur adegan (gelembung loncat ke permukaan). Solusi: simpan tinggi dasar dulu.
- Setelah muat ulang, adegan salah (ikan muncul di section lamun) karena posisi section diukur sebelum tata letak berubah. Solusi: `ResizeObserver` mengukur ulang.
- Kamera menembus padang lamun dan teks sulit dibaca di atas pasir terang. Solusi: lamun digeser ke kanan, pasir digelapkan, scrim gelap di sisi kiri teks.

**Langkah berikutnya**
- Uji di laptop sekolah / proyektor. PC sendiri: 139–144 FPS.
- Lanjut ke halaman Lab Sel.

## Minggu, 8 November 2026 (lanjutan) — Redesign adegan 1 Beranda
**Yang dikerjakan**
- Howard menilai hero terlihat murah (bukit vektor datar, air polos, judul berbayangan, nav teal solid). Redesign hanya adegan 1.
- Langit HDRI CC0 dari Poly Haven, air `Water.js` dengan pantulan, tiga lapis pulau dari foto Unsplash dengan kabut biru dan parallax.
- Judul tanpa bayangan, rata kiri di grid 12 kolom; indikator gulir garis; "Lewati intro" di kanan bawah; nav transparan di atas hero.
- Vignette dan film grain halus dengan CSS.
- Screenshot sebelum/sesudah di `docs/laporan/screenshots/fase2-landing-hero-*.png` (1440, 1024, 390).

**Kendala dan solusi**
- HDRI pertama ("Spruit Sunrise") ternyata berisi pepohonan Afrika Selatan di cakrawala, jadi terlihat di belakang pulau. Solusi: pakai HDRI "pure sky" (langit saja).
- HDRI kedua ("Kloofendal 28d Misty") terlalu putih berkabut; judul krem tidak terbaca dan air jadi abu-abu. Solusi: "Qwantani Morning" (langit biru pagi) dan kamera diputar menyamping dari matahari.
- Sisa awan abu-abu ikut terlihat setelah langit foto dihapus. Solusi: aturan hapus ditambah (awan lebih gelap dan putih kebiruan ikut dihapus).
- Pulau terlalu besar dan menutupi judul. Solusi: lapis dikecilkan dan dijauhkan.
- Rumus cakrawala salah dua kali lipat (cakrawala di 40%). Solusi: diperbaiki ke 45%.
- Nav kadang tetap gelap saat diuji karena IntersectionObserver salah membaca saat ukuran jendela uji berubah. Solusi: cukup cek posisi gulir.
- Peringatan WebGL saat ukuran layar berubah. Solusi: tekstur judul dibuang sebelum digambar ulang.

**Catatan aturan baru (§4.5 anti-vibecode)**
- Adegan 3–8 masih memakai bentuk buatan kode (ikan, karang, lamun, sel). Perlu keputusan Howard apakah diganti aset nyata.

## Minggu, 8 November 2026 (lanjutan) — Polish pass dan perbaikan tampilan
**Yang dikerjakan**
- Token spasi 8 px, type scale, dan motion token dipakai di semua CSS dan GSAP.
- Preloader (penghitung + huruf SEL keluar dari mask), text reveal per baris, kursor kustom, tombol magnetik, grain + vignette, suara air (Web Audio, default mati), panel lil-gui di `?debug`.
- Perbaikan dari skill web-design-guidelines: `color-scheme`, `theme-color`, `touch-action`, `scroll-margin-top`, animasi berhenti saat reduced-motion.
- Perbaikan "tampilan asal-asalan": bayangan teks dihapus (diganti scrim lebih gelap), ikan tidak lagi menutupi kolom teks, ikan lebih halus, text reveal ramah pembaca layar.

**Kendala dan solusi**
- Adegan 3D tertinggal satu section di uji headless (1,5 FPS). Penyebab sebenarnya: penghalusan kamera memakai waktu frame yang dibatasi, jadi di laptop lambat kamera ikut lambat. Solusi: dirigen memakai waktu asli.

## Senin, 9 November 2026 — Lab Sel (Fase 3)
**Yang dikerjakan**
- Materi 3D Beranda diperbaiki (lingkungan pantulan, material fisik, geometri halus).
- Lab Sel lengkap: daftar organel dan panel detail (bisa tanpa 3D), ruang lab 3D dengan lampu sorot dan pedestal kaca,
  sel hewan dan tumbuhan terpotong (cutaway), sorot + kartu info saat kursor menunjuk, miring mengikuti kursor, geser sel,
  kamera terbang ke organel, layar detail dengan pin bernomor untuk 5 organel lengkap, tautan langsung `sel.html#organel`.
- Acuan: deskripsi CLAUDE.md §6.2 (belum ada desain Figma yang disetujui).

**Kendala dan solusi**
- Layar sel dan layar detail tampil bersamaan karena `display: grid` mengalahkan atribut `hidden`. Solusi: aturan `.lab-view[hidden]`.
- RE pada sel tumbuhan menembus dinding sel. Solusi: diperkecil dan digeser.
- Di ponsel, tombol menu terpotong dan sel terlalu besar. Solusi: jarak tombol diperkecil, kamera mundur otomatis di layar sempit.
- Peringatan GSAP "target not found" dari judul yang isinya berubah. Solusi: judul dinamis diberi `data-no-reveal`.

## Selasa, 10 November 2026 — Gerbang Sel (Fase 4)
**Yang dikerjakan**
- Gerbang Sel: 5 mode wajib (Struktur, Difusi, Difusi terfasilitasi, Osmosis, Pompa Na⁺/K⁺) dengan membran 3D, kartu info,
  Jeda/Langkah berikutnya/Ulangi/kecepatan, penghitung dan bar pompa, tanda muatan (+ luar / − dalam).
- Endositosis, eksositosis, kotranspor ditampilkan sebagai teks di bawah (versi 3D belum dibuat).

**Kendala dan solusi**
- Kamera terlalu dekat sehingga membran memenuhi layar. Solusi: kamera dijauhkan.
- Tombol kontrol tidak bergaya karena gaya `.pill-button` hanya ada di file Lab Sel. Solusi: dipindah ke `components.css`.
- Atribut `hidden` kalah oleh `display: flex` (kontrol dan tautan kartu). Solusi: aturan `[hidden]` khusus.

## Selasa, 10 November 2026 — Lab Osmosis, Kuis, Rangkuman (Fase 5, 6, dan halaman 6)
**Yang dikerjakan**
- Lab Osmosis: mikroskop bundar (Canvas 2D) untuk sel darah merah dan sel epidermis bawang merah, tombol Hipotonik/Isotonik/Hipertonik,
  animasi tetesan + riak, panah biru arah air, meter Volume sel dan Tekanan turgor, panel Hasil Pengamatan (arah air, mengapa, contoh nyata),
  tabel 6 keadaan, kotak "Ingat!", dan 3 soal "Tebak keadaan sel ini". Video pra-render diganti animasi langsung (pilihan cadangan di CLAUDE.md §6.4).
- Kuis: bank 68 soal (sel 17, organel 19, membran 17, osmosis 15), Mode Latihan (topik, jumlah, umpan balik langsung, "Pelajari lagi",
  ulangi soal yang salah) dan Mode Ujian (25 soal dengan pembagian 4/8/7/6, timer 30 menit kuning/merah, navigator, ragu-ragu,
  konfirmasi sebelum kumpul, kumpul otomatis saat waktu habis, laporan per topik, pembahasan, riwayat di perangkat, unduh kartu nilai PNG).
- Rangkuman: 5 kartu ringkasan, kredit otomatis dari `credits.json`, tabel anggota dan identitas, kalimat penutup.

**Kendala dan solusi**
- Laporan "Unduh Report Card" di rencana memakai library `html-to-image`, padahal library baru harus izin dulu. Solusi: kartu nilai digambar sendiri di `<canvas>` lalu disimpan sebagai PNG.
- Tombol pilihan dua sisi (Sel Hewan | Sel Tumbuhan) dibutuhkan juga di Kuis. Solusi: gayanya `.segmented` dipindah ke `components.css`.
- Nama guru belum diketahui. Solusi: baris guru disembunyikan otomatis selama isinya kosong di `rangkuman.json`.

## Selasa, 10 November 2026 — Detail 3D (Gerbang Sel dan Lab Sel)
**Yang dikerjakan**
- Gerbang Sel: protein dibuat ulang dari beberapa subunit dengan permukaan bergelombang (protein integral 4 subunit, saluran 5 subunit dengan pori, pembawa 2 lobus, pompa dengan domain ATP di sitoplasma), protein menonjol di atas dan bawah membran.
  Fosfolipid: satu ekor bertekuk (asam lemak tak jenuh), tinggi dan putaran sedikit berbeda (kesan "cair"), warna kepala bervariasi. Rantai karbohidrat bercabang. Kamera dijauhkan agar membran tidak terpotong.
- Lab Sel: nukleus dengan membran inti dua lapis, pori nukleus, kromatin kusut, nukleolus; mitokondria tembus pandang dengan krista; ribosom dua subunit dan menempel di RE kasar; vesikel badan Golgi;
  lisosom berisi butiran enzim; peroksisom dengan inti kristal; sentriol dari 9 triplet mikrotubulus; kloroplas dengan grana.
- Screenshot sebelum/sesudah: `docs/laporan/screenshots/fase7-*`.

**Kendala dan solusi**
- Protein tenggelam di antara kepala fosfolipid sehingga hampir tidak terlihat. Solusi: protein diperbesar 1,2–1,4× dan fosfolipid di sekitarnya diberi ruang lebih lebar.
- Pompa yang lebih besar menutupi ion Na⁺/K⁺ yang menempel. Solusi: pompa dibuat tembus pandang selama mode Pompa.

## Selasa, 10 November 2026 — Rasa ruang 3D di Beranda
**Yang dikerjakan**
- File baru `scenes/depth.js`: partikel tiga lapis (jauh, tengah, dekat/bokeh) yang selalu mengelilingi kamera, sel-sel tetangga di kejauhan + satu sel latar depan, dan jaringan sel tumbuhan di belakang sel lamun.
- Sel hewan dan sel tumbuhan: kamera kini mengitari sel (orbit) sambil naik/turun, bukan hanya mundur. Sel tetap di tengah dunia, posisinya di layar diatur dengan `setViewOffset`.
- Padang lamun: lamun latar depan yang lebih tinggi dilewati kamera; daun lamun meruncing dan melengkung.
- Lumpur: kerikil di sepanjang jalur kamera dan cahaya rendah dari samping. Terumbu, penyelaman, dan lumpur memakai partikel tiga lapis.
- Screenshot: `docs/laporan/screenshots/fase7-beranda-ruang-*`.

**Kendala dan solusi**
- Sel latar depan terlalu besar dan menutupi sel utama. Solusi: diperkecil dan digeser ke tepi kanan.
- Jaringan sel tumbuhan terlalu terang sehingga bersaing dengan sel utama dan teks. Solusi: dibuat lebih jauh, lebih gelap, lebih transparan.
- Adegan lumpur hampir hitam sehingga kerikil tidak terlihat. Solusi: lantai sedikit lebih terang + cahaya samping.

## Selasa, 10 November 2026 — Bersih-bersih tampilan "AI slop" (CLAUDE.md §4.5 + skill ui-ux-pro-max)
**Yang dikerjakan**
- Navigasi: efek kaca buram (`backdrop-filter: blur`, glassmorphism) dihapus, diganti latar solid. Di atas hero Beranda tetap transparan.
- Tombol Gerbang Sel: karakter ⏸ ▶ (di Windows tampil sebagai emoji berwarna) diganti ikon garis SVG buatan sendiri (`src/core/icons.js`) dengan `aria-hidden`.
- Rangkuman: penomoran kartu 01–05 dihapus (urutan bukan informasi).
- Label kecil HURUF BESAR berjarak lebar (eyebrow) di dalam panel Kuis, Lab Osmosis, dan Rangkuman diganti label biasa. Eyebrow hanya di puncak halaman (sesuai spesifikasi) dan satu label panel yang memang berisi informasi.
- Skor laporan ujian tidak lagi memakai ukuran raksasa 220 px, cukup ukuran judul.
- Tanda pisah panjang (—) di teks antarmuka diganti titik dua/koma; judul tab memakai "·". Kalimat generik "Tetap semangat." dihapus.
- Panah → ← › ↺ tetap dipakai karena tertulis langsung di spesifikasi CLAUDE.md.

## Selasa, 10 November 2026 — Audit Web Interface Guidelines (halaman baru)
**Yang dikerjakan** (aturan terbaru dari vercel-labs/web-interface-guidelines)
- Tanda kutip lurus "…" di teks materi diganti tanda kutip melengkung “…”.
- Spasi antara angka dan satuan (10–100 µm, 30 menit, 25 soal) diganti spasi tak terputus agar tidak terpisah di dua baris.
- Mode Kuis tersimpan di alamat (`kuis.html?mode=ujian`) dan sel Lab Osmosis juga (`lab-osmosis.html?sel=tumbuhan`), jadi bisa dibuka langsung saat presentasi.
- Kotak nomor soal di Mode Ujian diberi efek hover; logo "SEL" diberi `translate="no"` agar tidak diterjemahkan otomatis.

## Selasa, 10 November 2026 — Audit standar kualitas (skill build-awwwards-quality-sites)
**Sudah memenuhi sebelumnya:** satu mesin scroll halus (Lenis, terhubung ke ScrollTrigger), GSAP sebagai sistem gerak, judul muncul per kata dengan salinan utuh untuk pembaca layar, preloader + intro hero, Three.js hanya bila mendukung cerita, DPR dibatasi, render berhenti saat tab tersembunyi/di luar layar, semua media tercatat di kredit, tidak ada testimoni/logo palsu.
**Yang diperbaiki:**
- Halaman dalam (Lab Sel, Gerbang Sel, Lab Osmosis, Kuis, Rangkuman) kini punya intro: eyebrow → judul → tagline naik bergantian, lalu kartu/panel muncul saat masuk layar (`src/core/page-intro.js`). Gerak dikurangi / Mode Tenang → langsung tampil.
- Lenis kini juga mati bila pengguna mengatur `prefers-reduced-motion`.
- Jika kartu grafis kehilangan konteks WebGL, situs otomatis pindah ke Mode Tenang dengan pesan, bukan layar hitam.
- Setiap halaman punya pesan `<noscript>` bila JavaScript mati.
**Diuji:** semua halaman dalam di-scroll sampai bawah, tidak ada blok yang tertinggal tersembunyi; mode gerak dikurangi menampilkan semua isi seketika; tidak ada error console.

## Selasa, 10 November 2026 — Kepatuhan §4.5 Aturan anti-vibecode
**Catatan:** aturan dari Howard sudah tercatat lengkap di CLAUDE.md §4.5, jadi tidak ada teks baru; yang dikerjakan adalah audit kode terhadap aturan itu.
**Yang sudah patuh:** tidak ada bayangan/glow pada teks, tidak ada glassmorphism, tidak ada gradien ungu/biru generik (gradien yang ada hanya lapisan gelap agar teks terbaca dan isi batang progres), ikon pakai SVG garis, radius kecil (8px), token grid 12 kolom, skala spasi 8px, skala huruf, dan token gerak sudah ada di `tokens.css`.
**Yang diperbaiki:**
- Ukuran huruf di luar skala diganti token: soal kuis dan timer → `--fs-h2`, kalimat penutup Rangkuman → `--fs-h1`.
- Spasi di luar skala diganti token: `80px` → `--s-8`, `28px`/`24px` → `--s-3`, `8px` → `--s-1`, `4px` → `calc(var(--s-1) / 2)`.
- State *active* (saat ditekan) kini berlaku di mouse juga, untuk semua tombol, opsi kuis, tombol larutan, chip mode, dan kotak nomor soal.
- State *hover* ditambah pada saklar dua pilihan dan chip mode Gerbang Sel.
- Tombol "Unduh Report Card" kini punya state *loading* ("Menyiapkan gambar…") dan state *error* jika gambar gagal dibuat.
**Diuji:** Kuis di 1440, 1024, 390 px; Rangkuman di 1024 px; tidak ada scroll horizontal; `npm run build` lulus.
**Belum:** desain Figma/Claude Design yang disetujui untuk perbandingan per layar belum ada, jadi pembandingan dilakukan terhadap spesifikasi CLAUDE.md §6.

## Selasa, 10 November 2026 — Sel hewan Lab Sel memakai model montanna (CC BY 4.0)
**Catatan awal:** permintaan menyebut kit "Cell Studio" (model AI dari LearningCell/Tripo, diambil dari media.prettysites.io). Setelah dicek, kit itu tidak ada di proyek ini: tidak ada `assets.json`, tidak ada model sel darah putih/neuron/DNA. Lab Sel sebelumnya memakai model buatan sendiri dengan kode Three.js. Setelah Howard setuju, sel hewan diganti dengan model montanna.
**Yang dikerjakan:**
- Unduh `animal_cell.glb` (70,6 MB) ke `assets-src/`; lisensi CC BY 4.0 tertulis di metadata file.
- Kompres dengan gltf-transform + Draco → `public/models/animal-cell.glb` 1,8 MB. Dekoder Draco disalin ke `public/draco/` (tidak memanggil internet).
- Alat baru `tools/inspect-materials.mjs` dan `tools/model-preview.html` untuk memetakan 15 material ke 11 organel (tabel di `docs/ASSETS.md`). Mode `?pick` mencatat koordinat titik yang diklik.
- `src/pages/sel/animal-model.js`: memuat model, mengganti material dengan `MeshPhysicalMaterial` lab, memecah satu mesh kuning menjadi sentriol dan lisosom, menambah peroksisom buatan sendiri (model asli tidak punya).
- Sorot/klik tetap memakai raycast per mesh organel (menyala + yang lain redup), bukan titik perkiraan. Kartu info muncul di titik yang kena raycast.
- Kredit: entri montanna dan dekoder Draco ditambah; entri model buatan sendiri diperbarui.
**Masalah & solusi:**
- URL unduhan memberi 404: repositori pindah ke `BiologySimulation/BiologySimulation` dengan cabang `master`.
- Kompresi bawaan menggabungkan organel menjadi 5 mesh + tekstur palet → dimatikan dengan `--join false --palette false --flatten false`.
- Penampang inti bergaris: material baru tidak mewarisi `side` (dua sisi) dari material asli → diperbaiki.
- Detail sentriol kecil dan tidak di tengah: potongan mesh masih menyimpan semua titik dan ada bintik anotasi kecil → titik dipadatkan, bintik disembunyikan.
**Diuji:** semua 11 organel sel hewan bisa disorot (uji sapuan pointer), glow/redup jalan, layar detail jalan, 1440 px dan 390 px, tidak ada error console, `npm run build` lulus. FPS 144 di PC Howard (RTX 5060 Ti) — **belum diuji di laptop sekolah**.
**Belum:** sel tumbuhan menunggu `assets-src/plant-cell.glb` dari Howard.

## Selasa, 10 November 2026 — Sel tumbuhan Lab Sel memakai model okchs (CC BY 4.0)
**Yang dikerjakan:**
- Howard mengunduh "Plant Cell | Biology" (Oliver/okchs) dari Sketchfab ke `assets-src/plant_cell__biology.glb`. Lisensi CC BY 4.0 tertulis di metadata file.
- Dikompres Draco: 8,7 MB → 0,76 MB (`public/models/plant-cell.glb`).
- `animal-model.js` digabung menjadi `glb-cell.js` yang memuat kedua sel. Sel tumbuhan dipetakan lewat nama node (`cell_wall`, `golgi`, …). Sitoskeleton dan lisosom dibuang karena tidak ada di daftar organel sel tumbuhan KONTEN-MATERI. Peroksisom buatan sendiri ditambahkan.
- RE kasar dan RE halus satu mesh di model ini, jadi keduanya menyorot mesh yang sama (`aliases`); `highlight.js` diubah supaya mesh bersama tetap menyala.
- Atas permintaan Howard, membran dan sitoplasma kedua sel dibuat padat (tidak tembus pandang) supaya lantai lab tidak terlihat menembus sel.
- Kredit okchs ditambah; jika model gagal dimuat, console kini menampilkan peringatan.
**Masalah & solusi:**
- Sketchfab perlu login, jadi file diunduh oleh Howard sendiri. Salinan tanpa login yang ditemukan (brianj.seely) hanya 3 material, organel tidak terpisah, jadi tidak dipakai.
- Dinding sel dan membran asli hampir hitam di ruang lab gelap, jadi warnanya diganti hijau zaitun dan hijau muda.
**Diuji:** semua organel kedua sel bisa disorot (uji sapuan pointer), RE halus menyorot mesh RE, layar detail vakuola jalan, 1440 px dan 390 px, tidak ada error console. FPS di laptop sekolah **belum diuji**.

## Selasa, 10 November 2026 — Walkthrough Beranda diganti video scroll-scrub
**Yang dikerjakan:**
- Adegan 3D setelah hero (ikan, karang, lamun, sel hewan/tumbuhan primitif, lumpur) dihapus dan diganti walkthrough scroll-scrub gaya AirPods. Hero pulau + judul beriak tetap.
- Klip diambil dari Pexels (disetujui Howard): Pavel Danilyuk, Adrien JACTA (2 klip), Sunda Manda (Gili, Indonesia), Markus Winkler, dan foto mikroskop Lidija Ostojić. Klip sel hewan dan sel tumbuhan dirender dari model Lab Sel (`tools/render-cell.html`), karena Pexels tidak punya video sel hewan asli.
- `tools/make-walkthrough.mjs` merakit video 34,5 detik (xfade 1 detik, zoom pelan, grade teal). `tools/make-frames.mjs` memotongnya menjadi 345 frame WebP (17,5 MB) + `src/data/seq.json`.
- `scroll-sequence.js` + `sequence/` (frames, plane, canvas2d, panels): pin 600%, scrub 0,5, muat bertahap (tiap frame ke-8 dulu), frame terdekat, preloader sampai 25%, shader grain + vignette + riak kursor, cadangan canvas 2D, Mode Tenang 6 gambar diam.
- Teks panel dari `src/data/landing-beats.json` (KONTEN §1), kolom 1–6 dari grid 12 dengan scrim gradien, reveal masker per baris.
- Tabel "Dua sel, satu laguna" dan tombol "Lanjut: Lab Sel" kini tampil di atas frame terakhir, bukan layar hitam.
**Masalah & solusi:**
- URL unduhan Pexels memberi file 4K besar; untuk 4 klip dipakai versi 1080p dengan nama file yang sama polanya. Total unduhan ±280 MB, disimpan di `assets-src/candidates/` (tidak di-commit).
- Frame pertama 21,1 MB (kualitas 70) → kualitas 55: 17,5 MB, masih tajam.
- Masker reveal memotong huruf "TUMBUHAN" → masker akhir dibuat lebih lebar dari kotak teks.
- Skala "30 cm › … › 20 µm" terpecah dua baris → panel 6 kolom, `nowrap`, jarak lebih kecil di HP.
**Diuji:** 1440, 1024, 390 px tanpa scroll horizontal; mode gerak dikurangi menampilkan 6 gambar diam; scrub seluruh walkthrough 129 fps, frame terlama 21 ms di PC Howard (RTX 5060 Ti); tidak ada error console; `npm run build` lulus. **Belum diuji di laptop sekolah dan HP asli.**


## Selasa, 10 November 2026 — Perbaikan hover pada layar sentuh
**Yang dikerjakan:** Membungkus seluruh 16 blok CSS yang mengandung `:hover` di tujuh file dalam `@media (hover: hover)`, sesuai temuan HIGH di AGENTS.md bagian 8. Selector pin dan organel terpilih dipisahkan agar tetap berlaku pada layar sentuh. Deklarasi dan token desain tetap digunakan seperti sebelumnya.
**Masalah & solusi:** Hover dapat tertinggal setelah ketukan pada HP. Media query membatasi hover berdasarkan kemampuan input utama. Saat memeriksa browser, chip yang sudah terpilih memang mengalahkan warna hover; pengujian kemudian memakai chip yang belum terpilih.
**Diuji:** Audit parser PostCSS atas semua CSS dalam src: 16 blok hover, semuanya terlindungi. Chrome headless pada enam halaman di lebar 1440, 1024, dan 390 px: tidak ada overflow horizontal atau exception JavaScript. Pemaksaan pseudo-state hover pada chip kuis mengubah warna border pada desktop, tetapi tidak pada emulasi sentuh 390 px. State pin terpilih dan organel aktif tetap memakai warna coral pada ketiga lebar. Build produksi berhasil dengan peringatan ukuran chunk di atas 500 kB. Tangkapan layar kuis dalam Mode Tenang: docs/laporan/screenshots/hover-kuis-{1440,1024,390}.png.
**Batas pengujian:** Emulasi sentuh desktop, belum diuji di HP asli.
**Langkah berikutnya:** Uji ketukan di HP asli sebelum presentasi; temuan review lain di AGENTS.md bagian 8 masih terpisah dari perbaikan ini.
## Selasa, 10 November 2026 — Viewport ponsel, tablet, dan desktop

Pada lebar 320 piksel, tombol navigasi, skala Beranda, dan judul Rangkuman melampaui lebar halaman. Jarak navigasi dirapatkan, menu dibuat bisa digulir pada layar pendek, dan skala serta judul bisa membungkus. Beranda memakai rangkaian gambar dan teks yang bisa digulir jika layar terlalu pendek untuk panel animasi yang dipasang tetap.

Kanvas Gerbang Sel sekarang menyesuaikan ukuran panggung. Kamera dan deteksi bagian membran memakai ukuran kanvas, lalu kartu informasi dibatasi agar muat di layar. Ketukan pada model membuka kartu yang sama seperti saat kursor menunjuk model.

Chrome menguji enam halaman dalam Mode Tenang di tujuh ukuran dari 320 × 568 sampai 1920 × 946, termasuk ponsel mendatar 667 × 375. Halaman dan menu muat tanpa gulir horizontal. Gerbang Sel juga diuji dengan WebGL aktif dan emulasi ketuk pada empat ukuran. Pergantian orientasi bolak-balik diuji pada Gerbang Sel dan Beranda. Build produksi berhasil. Tangkapan layar Gerbang Sel ada di `docs/laporan/screenshots/viewport-gerbang-390.png` dan `docs/laporan/screenshots/viewport-gerbang-1920.png`. Pengujian perangkat fisik belum dilakukan.

## 10 November 2026 — Hero Beranda diperbarui

Pulau di latar sekarang menyambung dari tepi kiri ke tepi kanan (foto diulang bolak-balik), tidak lagi terpotong. Teks hero ditata ulang: label kecil, judul dengan jarak huruf lebih rapat, slogan, dan kalimat pembuka dari KONTEN §1. Kontras dinaikkan dengan bayangan teks dan elips gelap di belakang judul. Judul, slogan, label, dan kalimat miring mengikuti kursor (maks. 7°, mati di Mode Tenang). Diuji di Playwright pada 1600 × 800 dan 390 × 800 tanpa gulir horizontal dan tanpa error konsol. Tangkapan layar: `docs/laporan/screenshots/fase8-hero-*.png`.
## Selasa, 10 November 2026 — Judul Beranda lebih responsif terhadap kursor

Kemiringan maksimum naik dari 7° ke 20° per sumbu. Perspektif diperkuat dan kedua blok teks pendamping sekarang mengikuti kemiringan judul. Gradasi di belakang teks dibuat lebih gelap dan menjangkau kalimat pembuka agar teks lebih mudah dibaca di atas pemandangan terang.

Build berhasil. Chrome WebGL pada 1280 × 800 mencapai 19,84° di dekat tepi kanan. Kedua blok teks pendamping mengikuti sudut tersebut, kembali ke 0° setelah mouse keluar, dan berhenti miring ketika Mode Tenang diaktifkan. Tampilan diperiksa lewat `docs/laporan/screenshots/hero-tilt-contrast.png`.
## Selasa, 10 November 2026 — Transisi air dan gulir lebih halus

Lapisan gelap adegan menyelam kini memudar di batas atas dan bawah untuk mengurangi garis mendadak di atas air. Kecepatan gulir roda dan faktor peralihan Lenis dikurangi.

Build berhasil. Chrome WebGL memeriksa transisi pada 1280 × 800 dan menyimpan `docs/laporan/screenshots/transisi-beranda.png`. Masukan roda 400 piksel menghasilkan perpindahan sekitar 220 piksel. Mode Tenang dapat diaktifkan dan tidak ditemukan exception JavaScript.
## Selasa, 10 November 2026 — Transisi walkthrough ke ringkasan

Lapisan gelap walkthrough memudar pada kedua ujungnya dan latar ringkasan berubah gelap secara bertahap. Warna latar akhir ringkasan disamakan dengan awal penutup. Lenis diperlambat dan pelunakannya ditingkatkan.

Build berhasil. Chrome WebGL pada 1280 × 800 memeriksa transisi menuju ringkasan dan menyimpan `docs/laporan/screenshots/transisi-ringkasan.png`. Masukan roda 400 piksel menghasilkan perpindahan 160 piksel. Mode Tenang dapat diaktifkan dan tidak ditemukan exception JavaScript.
## Selasa, 10 November 2026 — Latar gelap menyatu di Beranda

Satu gradien menggantikan lapisan terpisah dari bagian menyelam sampai penutup, dan tetap gelap sampai bawah. Footer Lab Sel duplikat di Beranda dihapus; tombol di bagian penutup tetap dipakai untuk lanjut.

Build berhasil. Chrome menguji Beranda pada 1280 × 800 dan 390 × 844, memeriksa tombol Lab Sel, tidak adanya footer duplikat, dan Mode Tenang. Foto layar bagian bawah disimpan sebagai `shadow-bottom-1280.png` dan `shadow-bottom-390.png` di `docs/laporan/screenshots/`.
## Selasa, 10 November 2026 — Posisi dan pergantian sel

Tampilan sel utama dikunci agar tetap memenuhi layar pada desktop. Daftar organel dapat digulir di dalam panel, sedangkan layar kecil dan halaman detail tetap dapat digulir. Saat kembali dari detail, halaman kembali ke posisi awal.

Ketika pilihan sel berubah, model sebelumnya memudar perlahan sementara model berikutnya masuk. Animasi dibersihkan saat pilihan diubah cepat, detail dibuka, atau viewer dibuang. Jika model selesai dimuat ketika transisi berlangsung, model baru melanjutkan tingkat transparansi yang sedang berjalan.

Build berhasil. Chrome menguji 1440 × 900 dan 1024 × 768 dengan roda mouse, tampilan detail, kembali ke posisi awal, serta gulir ponsel 390 × 844. Pergantian biasa dan berulang diuji dengan WebGL aktif tanpa exception JavaScript. Tangkapan layar ada di `docs/laporan/screenshots/lab-viewport.png` dan `docs/laporan/screenshots/lab-crossfade.png`. Ponsel fisik belum diuji.
## Selasa, 10 November 2026 — Fade pada model yang keluar

Menyesuaikan permintaan Howard: model sel lama bergerak ke samping dan memudar perlahan sampai hilang, sedangkan animasi masuk model baru tetap. Gerakan model lama dipersingkat agar fade terlihat sebelum model keluar dari layar.

Build berhasil. Chrome WebGL mencatat 29 pembaruan opacity selama transisi 1,35 detik, dari 0,82 hingga 0,02 pada sampel yang teramati. Pergantian cepat diuji tanpa exception JavaScript.
## Selasa, 10 November 2026 — Kredit Claude Code dan Codex

Menambahkan nama Claude Code dengan model Opus 5.5 dan Fable 5.2, serta Codex dengan model Astra 6, Sol 6.1, dan Terra sesuai keterangan Howard. Data kredit dan pernyataan AI di KONTEN-MATERI diperbarui.

Build berhasil dan halaman Rangkuman di Chrome menampilkan kedua alat serta seluruh nama model.
## Selasa, 10 November 2026 — Penataan kredit dan sumber materi

Nama model dipindahkan ke baris setelah Anthropic dan OpenAI. Keterangan keduanya menyebut asisten coding. Penulis slide BAB 1 SEL diubah menjadi Guru Biologi SMA Kristen 1 BPK Penabur sesuai keterangan Howard.

Build berhasil. Halaman Rangkuman diperiksa di Chrome pada lebar 1280 dan 390 piksel; baris model, keterangan, dan sumber materi pertama tampil sesuai permintaan tanpa overflow horizontal.
## Selasa, 10 November 2026 — Identitas kelompok

Nama ketua diletakkan di baris pertama, mata pelajaran menjadi Biologi & INF (Informatika), dan tahun pelajaran menjadi 2026/2027 sesuai keterangan Howard. Build dan tampilan Rangkuman pada desktop serta ponsel diperiksa.
## Selasa, 10 November 2026 — Lenis di seluruh halaman

Lenis dimulai dari pengaturan halaman bersama dan gulir di dalam daftar organel tetap didukung. Beranda tidak lagi memulainya secara terpisah.

Chrome menguji roda mouse pada keenam halaman, termasuk daftar organel yang dapat digulir tanpa menggeser Lab Sel. Mode Tenang dan preferensi gerak dikurangi menghentikan Lenis. Build berhasil.
## Selasa, 10 November 2026 — Ripple lebih lama dan parallax pulau

Menyesuaikan gerakan lensa judul dengan referensi Howard, memperpanjang gema riak menjadi 2,4 detik, serta sedikit menaikkan parallax pulau. Sesuai perubahan permintaan, tidak ada glow tambahan pada teks.

Build dan shader WebGL diuji di Chrome pada 1280 × 800 dan 390 × 844; tidak ada overflow atau error JavaScript. Mode Tenang diperiksa. Tangkapan layar tersedia sebagai `ripple-panjang-1280.png` dan `ripple-panjang-390.png`.
## Selasa, 10 November 2026 — Animasi pertukaran sel

Gerakan keluar sel dibuat lebih jauh ke samping dan ke belakang sambil memudar, sehingga pergantian tampak seperti kedua model bertukar tempat. Gerakan masuk tetap menggunakan animasi yang sudah ada.

Build berhasil. Chrome WebGL memeriksa pertukaran kedua arah pada desktop, pertukaran pada lebar 390 piksel, penggantian cepat, detail organel, dan Mode Tenang tanpa exception JavaScript. Dokumentasi tampilan akhir disimpan di `docs/laporan/screenshots/lab-swap-selesai.png`. Belum diuji pada perangkat fisik.
